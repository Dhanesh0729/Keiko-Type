export const MAX_SESSIONS = 500;
export const DETAIL_LIMIT = 50;
export const DEFAULT_RETENTION = 30;
export const RETENTION_OPTIONS = [7,30,90];
const day = 86400000;
const plain = v => v && typeof v === 'object' && !Array.isArray(v);
const number = (v,min=0,max=1e7) => Number.isFinite(v) && v >= min && v <= max;
export function cleanSettings(value={}) {
  const clean = {};
  if (!plain(value)) return clean;
  const booleans = ['dark','buddy','roast','keyboard','punctuation','numbers','buddyMotion','buddyReactions','reducedMotion'];
  const strings = ['theme','sound','accent','buddyName','buddyHair','buddyOutfit','buddySkin','buddyAccessory','buddyClothes','buddyPersonality','buddyGodStyle'];
  for (const k of booleans) if (typeof value[k] === 'boolean') clean[k] = value[k];
  for (const k of strings) if (typeof value[k] === 'string') clean[k] = value[k].slice(0,k==='buddyName'?24:64);
  if (number(value.volume,0,100)) clean.volume=value.volume;
  clean.retentionDays=RETENTION_OPTIONS.includes(value.retentionDays)?value.retentionDays:DEFAULT_RETENTION;
  return clean;
}
export function cleanHistory(history=[],retentionDays=DEFAULT_RETENTION,now=Date.now(),{cloud=false}={}) {
  if (!Array.isArray(history)) return [];
  const unique=new Map();
  for (const h of history) {
    if (!plain(h) || !number(h.id,0,Number.MAX_SAFE_INTEGER) || !number(h.wpm,0,10000) || !number(h.accuracy,0,100) || !number(h.seconds,0,86400) || typeof h.date!=='string' || !Number.isFinite(Date.parse(h.date)) || Date.parse(h.date)>now+300000) continue;
    const item={id:h.id,date:new Date(h.date).toISOString(),wpm:h.wpm,accuracy:h.accuracy,seconds:h.seconds,mode:['time','words','quote','custom','free'].includes(h.mode)?h.mode:'time'};
    for (const k of ['raw','characters','errors','duration']) if(number(h[k])) item[k]=h[k];
    if (['timer','idle','escape','completed'].includes(h.endReason)) item.endReason=h.endReason;
    if(Array.isArray(h.timeline)&&Date.parse(h.date)>=now-retentionDays*day) item.timeline=h.timeline.slice(0,3600).filter(plain).map(bin=>{
      const b={}; for(const k of ['second','attempts','correct','errors','duration','wpm','raw','accuracy']) if(number(bin[k]))b[k]=bin[k];
      b.mistakes=cloud?[]:Array.isArray(bin.mistakes)?bin.mistakes.slice(0,30).map(m=>({actual:String(m.actual??'').slice(0,1),expected:String(m.expected??'').slice(0,1)})):[];
      return b;
    });
    // Preserve available local detail when importing an older summary of the same match.
    const old=unique.get(item.id); unique.set(item.id,old?.timeline&&!item.timeline?old:item);
  }
  return [...unique.values()].sort((a,b)=>Date.parse(b.date)-Date.parse(a.date)||b.id-a.id).slice(0,MAX_SESSIONS).map((h,i)=>{if(i>=DETAIL_LIMIT)delete h.timeline;return h});
}
export function sanitizeSnapshot(value={},now=Date.now(),options={}) {
  const settings=cleanSettings(value.settings);
  return {history:cleanHistory(value.history,settings.retentionDays,now,options),settings};
}
export function mergeHistory(a,b,days=DEFAULT_RETENTION,now=Date.now()) { return cleanHistory([...b,...a],days,now); }
export function reconcile(local,remote,now=Date.now()) {
  if(local.generation!==null && remote.generation!==local.generation) {
    return {...local,...sanitizeSnapshot(remote,now),generation:remote.generation,revision:remote.revision,pending:false,settingsDirty:false,resetPending:false};
  }
  const settings=local.settingsDirty?local.settings:cleanSettings(remote.settings);
  return {...local,settings,history:mergeHistory(local.history,remote.history,settings.retentionDays,now),generation:remote.generation,revision:remote.revision};
}
export function parseBackup(text,now=Date.now()) {
  if(typeof text!=='string'||text.length>15*1024*1024)throw Error('Choose a backup smaller than 15 MB.');
  const parsed=JSON.parse(text);
  if(!plain(parsed)||![1,2].includes(parsed.version)||!Array.isArray(parsed.history)||parsed.history.length>5000)throw Error('Choose a valid Keiko backup.');
  const result=sanitizeSnapshot(parsed,now);
  if(result.history.length===0&&parsed.history.length>0)throw Error('The backup contains no valid match records.');
  return result;
}
export function backupDocument(snapshot) { return {version:2,exportedAt:new Date().toISOString(),...sanitizeSnapshot(snapshot)}; }
export function downloadJSON(value,name='keiko-progress.json') {
  const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function storageKey(scope){return `keiko:v2:${scope}`;}
