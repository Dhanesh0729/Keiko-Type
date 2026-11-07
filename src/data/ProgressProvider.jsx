import React,{createContext,useContext,useState,useEffect,useRef,useCallback} from 'react';
import {recordIssue} from '../diagnostics.jsx';
import {useAccount} from '../auth.jsx';
import {cloudConfiguration,createCloudTransport} from './cloud.js';
import {sanitizeSnapshot,cleanHistory,cleanSettings,mergeHistory,reconcile,storageKey,backupDocument,parseBackup} from './model.js';
const Data=createContext(null);
export const useProgress=()=>useContext(Data);
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
export function ProgressProvider({children}) {
  const account=useAccount();
  const scope=account.isLoaded?(account.userId||'guest'):'guest';
  return <ScopedProgress key={scope} scope={scope} account={account}>{children}</ScopedProgress>;
}
function ScopedProgress({children,scope,account}) {
  const key=storageKey(scope),config=cloudConfiguration();
  const [snapshot,setSnapshot]=useState(()=>{
    const legacy=scope==='guest'?{history:read('keiko-history',[]),settings:read('keiko-settings',{})}:{};
    const stored=read(key,legacy);
    return {...stored,...sanitizeSnapshot(stored),generation:stored.generation??null,revision:stored.revision??0,pending:!!stored.pending,settingsDirty:!!stored.settingsDirty,resetPending:!!stored.resetPending,version:0};
  });
  const [status,setStatus]=useState('local'),[error,setError]=useState(''),[storageError,setStorageError]=useState('');
  const [backups,setBackups]=useState(()=>read(key+':backups',[]).slice(0,3).map(b=>({...b,...sanitizeSnapshot(b),history:cleanHistory(b.history,snapshot.settings.retentionDays)})));
  const [guestOffer,setGuestOffer]=useState(()=>scope!=='guest'&&!read(key+':guest-choice',false)&&sanitizeSnapshot(read(storageKey('guest'),{history:read('keiko-history',[])})).history.length>0);
  const backupsRef=useRef(backups);backupsRef.current=backups;
  const ref=useRef(snapshot),alive=useRef(true),busy=useRef(null),abort=useRef(null);
  const commit=useCallback(next=>{if(!alive.current)return;ref.current=next;setSnapshot(next)},[]);
  const mutate=useCallback(fn=>{const prev=ref.current;commit({...fn(prev),pending:true,version:prev.version+1})},[commit]);
  useEffect(()=>()=>{alive.current=false;abort.current?.abort()},[]);
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(snapshot));if(scope==='guest'){localStorage.removeItem('keiko-history');localStorage.removeItem('keiko-settings');}setStorageError('')}catch{setStorageError('Browser storage is unavailable or full. Download a backup to keep this session.')}},[snapshot,key,scope]);
  useEffect(()=>{
    const timer=setInterval(()=>{
      const current=ref.current;const history=cleanHistory(current.history,current.settings.retentionDays);
      if(JSON.stringify(history)!==JSON.stringify(current.history))mutate(s=>({...s,history}));
      const previous=backupsRef.current;const cleaned=previous.map(b=>({...b,history:cleanHistory(b.history,current.settings.retentionDays)}));
      if(JSON.stringify(cleaned)!==JSON.stringify(previous)){
        setBackups(cleaned);try{localStorage.setItem(key+':backups',JSON.stringify(cleaned))}catch{setStorageError('Browser backup cleanup could not be saved. Download a current export.');}
      }
    },60000);
    return()=>clearInterval(timer);
  },[mutate,key]);
  useEffect(()=>{
    const now=Date.now();if(!snapshot.history.length||snapshot.resetPending)return;
    const previous=backupsRef.current;
    const clean=previous.map(b=>({...b,...sanitizeSnapshot(b),history:cleanHistory(b.history,snapshot.settings.retentionDays)}));
    const next=previous[0]&&now-previous[0].createdAt<86400000?clean:[{...backupDocument(snapshot),createdAt:now},...clean].slice(0,3);
    try{localStorage.setItem(key+':backups',JSON.stringify(next))}catch{setStorageError('An automatic browser backup could not be saved. Download an export to keep a separate copy.');}
    setBackups(next);
  },[snapshot.history,snapshot.settings.retentionDays,key,snapshot.resetPending]);
  const sync=useCallback(()=>{
    if(!account.isLoaded||!account.userId||!config.configured)return Promise.resolve();
    if(busy.current)return busy.current;
    const controller=new AbortController();abort.current=controller;
    const transport=createCloudTransport(config,account.getToken,{signal:controller.signal,ownerId:account.userId});
    setStatus('syncing');setError('');
    busy.current=(async()=>{
      try {
        for(let attempt=0;attempt<6;attempt++) {
          if(!alive.current)return;
          if(ref.current.resetPending) {
            const reset=await transport.reset();if(!alive.current)return;
            commit({...ref.current,generation:reset.generation,revision:reset.revision,resetPending:false,pending:true});
          }
          const remote=await transport.read();if(!alive.current)return;
          // A reset requested during the read takes priority over its old response.
          if(ref.current.resetPending)continue;
          if(ref.current.generation!==null&&ref.current.generation!==remote.generation){
            setBackups([]);setGuestOffer(false);try{localStorage.removeItem(key+':backups');localStorage.setItem(key+':guest-choice','true')}catch{}
          }
          commit(reconcile(ref.current,remote));
          if(!ref.current.pending){setStatus('synced');return;}
          const sent=ref.current;
          try {
            const saved=await transport.write({...sent,...sanitizeSnapshot(sent,Date.now(),{cloud:true})});
            if(!alive.current)return;
            if(ref.current.resetPending)continue;
            const changed=ref.current.version!==sent.version;
            commit({...ref.current,revision:saved.revision,generation:saved.generation,pending:changed,settingsDirty:changed&&ref.current.settingsDirty});
            if(!changed){setStatus('synced');return;}
          } catch(e) { if(e.code==='40001')continue;throw e; }
        }
        setStatus('pending');setError('Changes are saved locally. Sync will retry shortly.');
      } catch(e) {if(alive.current&&e.name!=='AbortError'){setStatus('error');setError(e.message);recordIssue('network','cloud_sync_failed')}}
      finally {busy.current=null;}
    })();return busy.current;
  },[account.isLoaded,account.userId,account.getToken,config.url,config.key,config.configured,commit]);
  useEffect(()=>{
    sync();const refresh=()=>sync();window.addEventListener('online',refresh);window.addEventListener('focus',refresh);const timer=setInterval(refresh,60000);
    return()=>{window.removeEventListener('online',refresh);window.removeEventListener('focus',refresh);clearInterval(timer)};
  },[sync]);
  useEffect(()=>{if(!snapshot.pending)return;const timer=setTimeout(sync,1000);return()=>clearTimeout(timer)},[snapshot.version,snapshot.pending,sync]);
  const setHistory=useCallback(fn=>mutate(s=>({...s,history:cleanHistory(typeof fn==='function'?fn(s.history):fn,s.settings.retentionDays)})),[mutate]);
  const setSettings=useCallback(fn=>mutate(s=>{const settings=cleanSettings(typeof fn==='function'?fn(s.settings):fn);return {...s,settings,history:cleanHistory(s.history,settings.retentionDays),settingsDirty:true}}),[mutate]);
  const importBackup=useCallback((text,{includeSettings=false}={})=>{const data=parseBackup(text);mutate(s=>({...s,settings:includeSettings?data.settings:s.settings,settingsDirty:includeSettings||s.settingsDirty,history:mergeHistory(data.history,s.history,includeSettings?data.settings.retentionDays:s.settings.retentionDays)}))},[mutate]);
  const clearData=useCallback(async()=>{
    // Keep a reset marker until acknowledged, so offline devices cannot resurrect deleted records.
    mutate(s=>({...s,history:[],settings:cleanSettings({}),settingsDirty:true,resetCounter:(s.resetCounter||0)+1,resetPending:scope!=='guest'}));
    setBackups([]);setGuestOffer(false);
    try{localStorage.removeItem(key+':backups');localStorage.setItem(key+':guest-choice','true');if(scope==='guest'){localStorage.removeItem('keiko-history');localStorage.removeItem('keiko-settings')}}catch{}
    await sync();
  },[mutate,scope,key,sync]);
  const chooseGuest=useCallback(importIt=>{
    if(importIt){const guest=sanitizeSnapshot(read(storageKey('guest'),{history:read('keiko-history',[])}));setHistory(h=>mergeHistory(guest.history,h,ref.current.settings.retentionDays));}
    try{localStorage.setItem(key+':guest-choice','true')}catch{}setGuestOffer(false);
  },[key,setHistory]);
  const restoreBackup=useCallback(backup=>{const safe=sanitizeSnapshot(backup);mutate(s=>({...s,history:mergeHistory(safe.history,s.history,s.settings.retentionDays)}))},[mutate]);
  const value={...snapshot,resetEpoch:`${snapshot.generation??0}:${snapshot.resetCounter||0}`,setHistory,setSettings,scope,isSignedIn:!!account.userId,configured:config.configured,status,error,storageError,sync,backups,guestOffer,chooseGuest,importBackup,restoreBackup,clearData};
  return <Data.Provider value={value}><React.Fragment key={scope}>{children}</React.Fragment></Data.Provider>;
}
