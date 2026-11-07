import React from 'react';
import {downloadJSON} from './data/model.js';
let events=[];
const subscribers=new Set();
export function recordIssue(category='app',code='unexpected_error') {
  // Do not collect messages, stacks, URLs, tokens, email addresses, or typed content.
  const issue={id:globalThis.crypto?.randomUUID?.()||String(Date.now()),at:new Date().toISOString(),category:['app','network','storage','render','promise'].includes(category)?category:'app',code:String(code).replace(/[^a-z0-9_-]/gi,'').slice(0,48)};
  events=[issue,...events].slice(0,25);subscribers.forEach(fn=>fn());return issue.id;
}
export const getIssues=()=>events;
export const subscribeIssues=fn=>{subscribers.add(fn);return()=>subscribers.delete(fn)};
export const clearIssues=()=>{events=[];subscribers.forEach(fn=>fn())};
export const exportIssues=()=>downloadJSON({application:'Keiko',version:1,generatedAt:new Date().toISOString(),issues:events},'keiko-diagnostics.json');
export function installErrorReporting(){
 const error=()=>recordIssue('app','browser_error'),rejection=()=>recordIssue('promise','unhandled_rejection');
 window.addEventListener('error',error);window.addEventListener('unhandledrejection',rejection);
 return()=>{window.removeEventListener('error',error);window.removeEventListener('unhandledrejection',rejection)};
}
export class AppErrorBoundary extends React.Component {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true}}
 componentDidCatch(){recordIssue('render','render_failed')}
 render(){return this.state.failed?<main className="recovery-page"><h1>Let’s find your flow again.</h1><p>Keiko couldn’t display this screen. Your saved browser data has not been cleared.</p><button onClick={()=>window.location.reload()}>Reload Keiko</button><button onClick={exportIssues}>Download diagnostic report</button><a href="/help">Get help</a></main>:this.props.children}
}
