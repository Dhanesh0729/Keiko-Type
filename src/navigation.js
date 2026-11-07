import {useState,useEffect} from 'react';
export const PAGE_PATHS={practice:'/',analytics:'/progress',themes:'/appearance',data:'/data',about:'/about',help:'/help',contact:'/contact',privacy:'/privacy'};
export const PAGE_LABELS={practice:'Typing practice',analytics:'Your progress',themes:'Look & feel',data:'Data & privacy',about:'About Keiko',help:'Help',contact:'Contact',privacy:'Privacy'};
const current=()=>Object.keys(PAGE_PATHS).find(k=>PAGE_PATHS[k]===window.location.pathname.replace(/\/$/,'')||PAGE_PATHS[k]===window.location.pathname)||'practice';
export function usePage(){
 const [page,set]=useState(current);
 useEffect(()=>{const pop=()=>set(current());window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop)},[]);
 useEffect(()=>{document.title=`${PAGE_LABELS[page]} · Keiko`;window.scrollTo(0,0)},[page]);
 const setPage=value=>{if(!PAGE_PATHS[value])return;window.history.pushState({},'',PAGE_PATHS[value]);set(value)};
 return [page,setPage];
}
export function useReducedMotion(preference){
 const [system,setSystem]=useState(()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false);
 useEffect(()=>{const media=window.matchMedia?.('(prefers-reduced-motion: reduce)');if(!media)return;const change=()=>setSystem(media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[]);
 return !!preference||system;
}
