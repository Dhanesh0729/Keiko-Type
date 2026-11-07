import test from 'node:test';
import assert from 'node:assert/strict';
import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
const compiled=await build({entryPoints:['src/data/ProgressProvider.jsx'],bundle:true,platform:'node',format:'cjs',packages:'external',write:false,plugins:[{name:'mock-account-and-cloud',setup(b){
 b.onResolve({filter:/auth\.jsx$/},()=>({path:'account',namespace:'mock'}));
 b.onResolve({filter:/diagnostics\.jsx$/},()=>({path:'diagnostics',namespace:'mock'}));
 b.onResolve({filter:/cloud\.js$/},()=>({path:'cloud',namespace:'mock'}));
 b.onLoad({filter:/.*/,namespace:'mock'},args=>({contents:args.path==='account'?'export const useAccount=()=>globalThis.keikoTestAccount;':args.path==='cloud'?'export const cloudConfiguration=()=>globalThis.keikoTestConfiguration;export const createCloudTransport=()=>globalThis.keikoTestTransport;':'export const recordIssue=()=>{};'}));
}}]});
const mod={exports:{}};new Function('require','module','exports',compiled.outputFiles[0].text)(createRequire(import.meta.url),mod,mod.exports);
const {ProgressProvider,useProgress}=mod.exports;
const now=Date.now();const match=id=>({id,date:new Date().toISOString(),wpm:55,accuracy:99,seconds:30});
function browser(){const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost:5173'});globalThis.window=dom.window;globalThis.document=dom.window.document;globalThis.localStorage=dom.window.localStorage;globalThis.IS_REACT_ACT_ENVIRONMENT=true;return {dom,root:createRoot(document.getElementById('root'))}}
let current;
function Harness(){current=useProgress();return React.createElement('div',null,current.scope)}
const render=root=>act(async()=>root.render(React.createElement(ProgressProvider,null,React.createElement(Harness))));
function setup(){globalThis.keikoTestAccount={isLoaded:true,userId:null,getToken:async()=>'test'};globalThis.keikoTestConfiguration={configured:false};}

test('guest migration and account switching isolate cache, settings and import consent',async()=>{
 setup();const {dom,root}=browser();try{
 localStorage.setItem('keiko-history',JSON.stringify([match(now)]));localStorage.setItem('keiko-settings',JSON.stringify({theme:'neon'}));
 await render(root);assert.equal(current.history.length,1);assert.equal(current.settings.theme,'neon');assert.equal(localStorage.getItem('keiko-history'),null);
 keikoTestAccount={...keikoTestAccount,userId:'user_a'};await render(root);assert.equal(current.history.length,0);assert.equal(current.settings.theme,undefined);assert.equal(current.guestOffer,true);
 act(()=>current.chooseGuest(true));assert.equal(current.history.length,1);assert.equal(current.guestOffer,false);
 keikoTestAccount={...keikoTestAccount,userId:'user_b'};await render(root);assert.equal(current.history.length,0);act(()=>current.setHistory([match(now+1)]));
 keikoTestAccount={...keikoTestAccount,userId:'user_a'};await render(root);assert.equal(current.history[0].id,now);
 keikoTestAccount={...keikoTestAccount,userId:null};await render(root);assert.equal(current.history[0].id,now);assert.equal(current.settings.theme,'neon');
 }finally{await act(async()=>root.unmount());dom.window.close()}
});
test('sync saves edits made while a write is in flight without losing either match',async()=>{
 setup();const {dom,root}=browser();try{
 keikoTestAccount={...keikoTestAccount,userId:'user_a'};keikoTestConfiguration={configured:true};
 let remote={history:[],settings:{retentionDays:30},revision:0,generation:0},release,started;
 const waitStarted=new Promise(r=>started=r);let block=true;
 globalThis.keikoTestTransport={read:async()=>remote,reset:async()=>assert.fail('unexpected reset'),write:async s=>{if(block){block=false;started();await new Promise(r=>release=r)}remote={...s,revision:remote.revision+1};return remote}};
 await render(root);act(()=>current.setHistory([match(now)]));let pending;
 await act(async()=>{pending=current.sync();await waitStarted});
 act(()=>current.setHistory(h=>[match(now+1),...h]));await act(async()=>{release();await pending});
 assert.equal(current.history.length,2);assert.equal(remote.history.length,2);assert.equal(current.pending,false);assert.equal(current.status,'synced');
 }finally{await act(async()=>root.unmount());dom.window.close()}
});
test('a remote reset clears old cached history and browser backups without reupload',async()=>{
 setup();const {dom,root}=browser();try{
 const history=[match(now)];localStorage.setItem('keiko:v2:user_a',JSON.stringify({history,settings:{},generation:0,revision:1,pending:true}));localStorage.setItem('keiko:v2:user_a:backups',JSON.stringify([{history,settings:{},createdAt:now}]));
 keikoTestAccount={...keikoTestAccount,userId:'user_a'};keikoTestConfiguration={configured:true};
 globalThis.keikoTestTransport={read:async()=>({history:[],settings:{},generation:1,revision:2}),write:async()=>assert.fail('stale history must not be uploaded'),reset:async()=>assert.fail('unexpected reset')};
 await render(root);assert.equal(current.history.length,0);assert.equal(current.backups.length,0);assert.equal(current.pending,false);
 }finally{await act(async()=>root.unmount());dom.window.close()}
});

test('switching accounts during a pending read cannot render or upload the old account',async()=>{
 setup();const {dom,root}=browser();try{
 let release;const oldRead=new Promise(r=>release=r);keikoTestAccount={...keikoTestAccount,userId:'user_a'};keikoTestConfiguration={configured:true};
 globalThis.keikoTestTransport={read:()=>oldRead,write:async()=>assert.fail('old scope must not upload after unmount'),reset:async()=>assert.fail()};
 await render(root);
 keikoTestAccount={...keikoTestAccount,userId:'user_b'};globalThis.keikoTestTransport={read:async()=>({history:[match(now+2)],settings:{},generation:0,revision:1}),write:async()=>assert.fail('B is already saved'),reset:async()=>assert.fail()};
 await render(root);await act(async()=>release({history:[match(now)],settings:{},generation:0,revision:1}));
 assert.equal(current.scope,'user_b');assert.deepEqual(current.history.map(h=>h.id),[now+2]);
 }finally{await act(async()=>root.unmount());dom.window.close()}
});
