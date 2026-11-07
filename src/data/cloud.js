// Loaded only for authenticated sync; guest practice doesn't download the database SDK.
export function cloudConfiguration(env=import.meta.env) {
 const url=env.VITE_SUPABASE_URL||'',key=env.VITE_SUPABASE_PUBLISHABLE_KEY||env.VITE_SUPABASE_ANON_KEY||'';
 let publicKey=key.startsWith('sb_publishable_');
 if(key.startsWith('eyJ'))try{publicKey=JSON.parse(atob(key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).role==='anon'}catch{}
 return {url:url.replace(/\/$/,''),key,configured:/^https:\/\/[^/]+\/?$/.test(url)&&publicKey};
}
export function createCloudTransport({url,key},getToken,{fetcher=fetch,signal,ownerId}={}) {
 let requestToken=null,clientPromise=null;
 const client=()=>clientPromise||(clientPromise=import('@supabase/supabase-js').then(({createClient})=>createClient(url,key,{
   auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},
   accessToken:async()=>requestToken,
   global:{fetch:async(input,options)=>{
     const controller=new AbortController();const cancel=()=>controller.abort();if(signal?.aborted)controller.abort();signal?.addEventListener('abort',cancel,{once:true});
     const timer=setTimeout(cancel,15000);
     try{return await fetcher(input,{...options,signal:controller.signal})}finally{clearTimeout(timer);signal?.removeEventListener('abort',cancel)}
   }},
 })).catch(()=>{clientPromise=null;throw Error('Cloud sync could not load. Your local copy is safe.')}));
 async function rpc(name,body={}) {
   const token=await getToken();if(!token)throw Error('Sign in again to reconnect cloud sync.');
   if(ownerId){let subject;try{subject=JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))).sub}catch{}if(subject!==ownerId)throw Error('The account changed. Reconnect sync for your current account.');}
   requestToken=token;
   const {data,error,status}=await (await client()).rpc(name,body);
   if(error){const failure=Error(status===401||status===403?'Cloud access was denied. Check Clerk integration and database policies.':error.code==='PGRST202'||error.code==='42883'?'Cloud database setup is incomplete. Apply the Keiko migrations.':'Cloud sync could not complete. Your local copy is safe.');failure.code=error.code;failure.status=status;throw failure;}
   if(!data||!Number.isSafeInteger(data.revision)||!Number.isSafeInteger(data.generation))throw Error('Cloud sync returned unexpected data. Your local copy is safe.');
   return data;
 }
 return {read:()=>rpc('keiko_read'),write:s=>rpc('keiko_write',{expected_revision:s.revision,expected_generation:s.generation,new_history:s.history,new_settings:s.settings}),reset:()=>rpc('keiko_reset')};
}
