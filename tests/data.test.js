import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {sanitizeSnapshot,parseBackup,mergeHistory,reconcile,storageKey} from '../src/data/model.js';
import {createCloudTransport} from '../src/data/cloud.js';
const now=Date.now();
const entry=(id=now,age=0)=>({id,date:new Date(now-age*86400000).toISOString(),wpm:60,accuracy:98,seconds:30,mode:'time',timeline:[{second:1,wpm:60,correct:5,errors:1,mistakes:[{actual:'x',expected:'y'}]}]});
test('retention removes expired detail, keeps summaries, and limits retained graphs',()=>{
 const history=Array.from({length:55},(_,i)=>entry(now-i,i===54?40:0));const clean=sanitizeSnapshot({history,settings:{retentionDays:30}},now);
 assert.equal(clean.history.length,55);assert.ok(clean.history[0].timeline);assert.equal(clean.history[50].timeline,undefined);assert.equal(clean.history[54].timeline,undefined);
});
test('cloud serialization excludes mistaken letters, injected fields and full passages',()=>{
 const result=sanitizeSnapshot({history:[{...entry(),passage:'private text',token:'secret'}],settings:{retentionDays:7,token:'secret',__proto__:{evil:true}}},now,{cloud:true});
 assert.deepEqual(result.history[0].timeline[0].mistakes,[]);assert.equal(result.history[0].passage,undefined);assert.equal(result.settings.token,undefined);
});
test('backup import rejects malformed files and merges valid legacy IDs without duplicates',()=>{
 assert.throws(()=>parseBackup('{'));assert.throws(()=>parseBackup(JSON.stringify({version:2,history:[{id:'wrong'}]})));
 const parsed=parseBackup(JSON.stringify({version:1,history:[entry()]}),now);assert.equal(parsed.history.length,1);assert.equal(mergeHistory(parsed.history,parsed.history).length,1);
 assert.notEqual(storageKey('guest'),storageKey('user_a'));assert.notEqual(storageKey('user_a'),storageKey('user_b'));
});
test('a cloud reset generation defeats stale offline data and settings',()=>{
 const stale={history:[entry()],settings:{theme:'neon',retentionDays:30},generation:1,revision:2,pending:true,settingsDirty:true};
 const clean=reconcile(stale,{history:[],settings:{},generation:2,revision:3},now);assert.equal(clean.history.length,0);assert.equal(clean.settings.theme,undefined);assert.equal(clean.pending,false);
});
test('cloud transport uses the current Clerk session token and optimistic revisions',async()=>{
 let called;const transport=createCloudTransport({url:'https://example.supabase.co',key:'public'},async()=>'session_token',{fetcher:async(url,options)=>{called={url,...options};return new Response(JSON.stringify({revision:2,generation:0}),{status:200,headers:{'Content-Type':'application/json'}})}});
 await transport.write({revision:1,generation:0,history:[],settings:{}});assert.equal(new Headers(called.headers).get('authorization'),'Bearer session_token');assert.equal(JSON.parse(called.body).expected_revision,1);assert.ok(!called.body.includes('owner_id'));
});
test('cloud transport preserves conflict codes and rejects expired authentication',async()=>{
 const conflict=createCloudTransport({url:'https://example.test',key:'public'},async()=>'token',{fetcher:async()=>new Response(JSON.stringify({code:'40001',message:'conflict'}),{status:409})});await assert.rejects(conflict.read(),e=>e.code==='40001');
 const guest=createCloudTransport({url:'https://example.test',key:'public'},async()=>null,{fetcher:()=>assert.fail('must not send unauthenticated request')});await assert.rejects(guest.read(),/Sign in again/);
});

test('PostgreSQL enforces ownership, authenticated RPCs, reset generations and retention',async()=>{
 const db=new PGlite();try{
 await db.exec(`create role anon; create role authenticated; create schema auth; create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;grant usage on schema auth to authenticated,anon;grant execute on function auth.jwt() to authenticated,anon;`);
 await db.exec((await readFile(new URL('../supabase/migrations/001_progress.sql',import.meta.url),'utf8')).replace(/^\uFEFF/,''));
 async function as(user,sql,params=[]){await db.exec('reset role');await db.query("select set_config('request.jwt.claims',$1,false)",[JSON.stringify({sub:user,role:'authenticated'})]);await db.exec('set role authenticated');return db.query(sql,params)}
 const h=[entry(),entry(now-1,40)];
 const first=await as('user_a','select public.keiko_write(0,0,$1::jsonb,$2::jsonb) as value',[JSON.stringify(h),JSON.stringify({retentionDays:30})]);assert.equal(first.rows[0].value.revision,1);
 let read=await as('user_a','select public.keiko_read() as value');assert.equal(read.rows[0].value.history.length,2);assert.deepEqual(read.rows[0].value.history[0].timeline[0].mistakes,[]);assert.equal(read.rows[0].value.history[1].timeline,undefined);
 const other=await as('user_b','select * from public.keiko_progress');assert.equal(other.rows.length,0,'RLS hides user A from user B');
 read=await as('user_b','select public.keiko_read() as value');assert.equal(read.rows[0].value.history.length,0,'RPC never accepts a caller-supplied owner');
 await assert.rejects(as('user_b',"update public.keiko_progress set owner_id='user_b'"),/permission denied/);
 await assert.rejects(as('user_b',"insert into public.keiko_progress(owner_id) values('user_a')"),/permission denied/);
 await assert.rejects(as('user_b','select public.keiko_write(1,0,$1::jsonb,$2::jsonb)',[JSON.stringify(h),'{}']),e=>e.code==='40001');
 await as('user_b','select public.keiko_write(0,0,$1::jsonb,$2::jsonb)',[JSON.stringify([entry(now-2)]),'{}']);
 const reset=await as('user_a','select public.keiko_reset() as value');assert.equal(reset.rows[0].value.generation,1);
 await assert.rejects(as('user_a','select public.keiko_write(1,0,$1::jsonb,$2::jsonb)',[JSON.stringify(h),'{}']),e=>e.code==='40001');
 read=await as('user_a','select public.keiko_read() as value');assert.deepEqual(read.rows[0].value.history,[]);
 read=await as('user_b','select public.keiko_read() as value');assert.equal(read.rows[0].value.history.length,1,'A reset never clears B');
 await db.exec('reset role;set role anon');await assert.rejects(db.query('select public.keiko_read()'),/permission denied/);await assert.rejects(db.query('select * from public.keiko_progress'),/permission denied/);
 await db.exec('reset role');await db.query("select set_config('request.jwt.claims','{}',false)");await db.exec('set role authenticated');await assert.rejects(db.query('select public.keiko_reset()'),/Authentication required/);
 }finally{await db.close()}
});

test('cloud transport rejects a token belonging to a different account scope',async()=>{
 const token='header.'+Buffer.from(JSON.stringify({sub:'user_b'})).toString('base64url')+'.signature';
 const client=createCloudTransport({url:'https://example.test',key:'public'},async()=>token,{ownerId:'user_a',fetcher:()=>assert.fail('must not upload account A with account B token')});
 await assert.rejects(client.write({revision:0,generation:0,history:[entry()],settings:{}}),/account changed/);
});
