-- Run once in the Supabase SQL editor as the project owner.
-- Keiko: Clerk session JWTs via Supabase Third-party Auth. No auth.users FK: Clerk IDs are text.
begin;
create table if not exists public.keiko_progress (
  owner_id text primary key,
  history jsonb not null default '[]'::jsonb check(jsonb_typeof(history)='array' and jsonb_array_length(history)<=500),
  settings jsonb not null default '{}'::jsonb check(jsonb_typeof(settings)='object'),
  revision bigint not null default 0,
  generation bigint not null default 0,
  updated_at timestamptz not null default now(),
  check(octet_length(history::text)<=8388608)
);
alter table public.keiko_progress enable row level security;
revoke all on public.keiko_progress from anon,authenticated;
grant select on public.keiko_progress to authenticated;
drop policy if exists keiko_owner_read on public.keiko_progress;
create policy keiko_owner_read on public.keiko_progress for select to authenticated
  using (owner_id=(select auth.jwt()->>'sub'));

create or replace function public.keiko_clean_settings(value jsonb) returns jsonb
language sql immutable set search_path='' as $$
 select coalesce(jsonb_object_agg(key,val),'{}'::jsonb) || jsonb_build_object('retentionDays',case when value->>'retentionDays' in ('7','30','90') then (value->>'retentionDays')::int else 30 end)
 from jsonb_each(case when jsonb_typeof(value)='object' then value else '{}'::jsonb end) as e(key,val)
 where (key in ('dark','buddy','roast','keyboard','punctuation','numbers','buddyMotion','buddyReactions','reducedMotion') and jsonb_typeof(val)='boolean')
 or (key in ('theme','sound','accent','buddyName','buddyHair','buddyOutfit','buddySkin','buddyAccessory','buddyClothes','buddyPersonality','buddyGodStyle') and jsonb_typeof(val)='string' and length(val #>> '{}')<=64)
 or (key='volume' and jsonb_typeof(val)='number' and (val #>> '{}')::numeric between 0 and 100);
$$;
create or replace function public.keiko_clean_history(value jsonb,days integer) returns jsonb
language plpgsql stable set search_path='' as $$
declare output jsonb;
begin
 if jsonb_typeof(value)<>'array' or jsonb_array_length(value)>5000 or octet_length(value::text)>15728640 then raise exception 'Invalid history payload'; end if;
 with source as (
   select distinct on (h->>'id') h
   from jsonb_array_elements(value) h
   where jsonb_typeof(h)='object' and jsonb_typeof(h->'id')='number'
     and jsonb_typeof(h->'wpm')='number' and (h->>'wpm')::numeric between 0 and 10000
     and jsonb_typeof(h->'accuracy')='number' and (h->>'accuracy')::numeric between 0 and 100
     and jsonb_typeof(h->'seconds')='number' and (h->>'seconds')::numeric between 0 and 86400
     and jsonb_typeof(h->'date')='string' and (h->>'date')::timestamptz<=now()+interval '5 minutes'
 ), ranked as (
   select h,row_number() over(order by (h->>'date')::timestamptz desc,(h->>'id')::numeric desc) as pos from source
 ), cleaned as (
   select pos,
     (select coalesce(jsonb_object_agg(k,v),'{}'::jsonb) from jsonb_each(h) e(k,v)
       where k in ('id','date','wpm','raw','accuracy','seconds','duration','characters','errors','mode','endReason') and jsonb_typeof(v) in ('string','number'))
     || case when pos<=50 and (h->>'date')::timestamptz>=now()-make_interval(days=>days) and jsonb_typeof(h->'timeline')='array'
       then jsonb_build_object('timeline',(select coalesce(jsonb_agg(bin order by ord),'[]'::jsonb) from (
         select ord,(select coalesce(jsonb_object_agg(k,v),'{}'::jsonb) from jsonb_each(b) e(k,v)
           where k in ('second','attempts','correct','errors','duration','wpm','raw','accuracy') and jsonb_typeof(v)='number') || '{"mistakes":[]}'::jsonb as bin
         from jsonb_array_elements(h->'timeline') with ordinality as t(b,ord) where ord<=3600 and jsonb_typeof(b)='object'
       ) bins)) else '{}'::jsonb end as item
   from ranked where pos<=500
 ) select coalesce(jsonb_agg(item order by pos),'[]'::jsonb) into output from cleaned;
 return output;
end;
$$;

create or replace function public.keiko_read() returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid text := auth.jwt()->>'sub'; result public.keiko_progress;
begin
 if uid is null or uid='' then raise insufficient_privilege using message='Authentication required'; end if;
 select * into result from public.keiko_progress where owner_id=uid;
 if not found then return jsonb_build_object('history','[]'::jsonb,'settings','{}'::jsonb,'revision',0,'generation',0); end if;
 return jsonb_build_object('history',public.keiko_clean_history(result.history,coalesce((result.settings->>'retentionDays')::integer,30)),'settings',result.settings,'revision',result.revision,'generation',result.generation);
end;
$$;
create or replace function public.keiko_write(expected_revision bigint,expected_generation bigint,new_history jsonb,new_settings jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid text := auth.jwt()->>'sub'; prefs jsonb; cleaned jsonb; result public.keiko_progress;
begin
 if uid is null or uid='' then raise insufficient_privilege using message='Authentication required'; end if;
 prefs:=public.keiko_clean_settings(new_settings);
 cleaned:=public.keiko_clean_history(new_history,(prefs->>'retentionDays')::integer);
 if expected_revision=0 and expected_generation=0 then
   insert into public.keiko_progress(owner_id,history,settings,revision,generation)
   values(uid,cleaned,prefs,1,0) on conflict do nothing returning * into result;
 else
   update public.keiko_progress set history=cleaned,settings=prefs,revision=revision+1,updated_at=now()
   where owner_id=uid and revision=expected_revision and generation=expected_generation returning * into result;
 end if;
 if result.owner_id is null then raise exception using errcode='40001',message='Progress changed; reload before saving'; end if;
 return jsonb_build_object('revision',result.revision,'generation',result.generation);
end;
$$;
create or replace function public.keiko_reset() returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid text := auth.jwt()->>'sub'; result public.keiko_progress;
begin
 if uid is null or uid='' then raise insufficient_privilege using message='Authentication required'; end if;
 insert into public.keiko_progress(owner_id,history,settings,revision,generation)
 values(uid,'[]','{}',1,1) on conflict(owner_id) do update set history='[]',settings='{}',revision=keiko_progress.revision+1,generation=keiko_progress.generation+1,updated_at=now() returning * into result;
 return jsonb_build_object('revision',result.revision,'generation',result.generation);
end;
$$;
-- Only the trusted scheduler may run this maintenance routine.
create or replace function public.keiko_prune_details() returns void
language sql security definer set search_path='' as $$
 update public.keiko_progress set history=public.keiko_clean_history(history,coalesce((settings->>'retentionDays')::integer,30))
 where jsonb_array_length(history)>0;
$$;
revoke all on function public.keiko_clean_settings(jsonb),public.keiko_clean_history(jsonb,integer),public.keiko_prune_details() from public,anon,authenticated;
revoke all on function public.keiko_read(),public.keiko_write(bigint,bigint,jsonb,jsonb),public.keiko_reset() from public,anon;
grant execute on function public.keiko_read(),public.keiko_write(bigint,bigint,jsonb,jsonb),public.keiko_reset() to authenticated;
commit;


-- Apply after 001_progress.sql using the Supabase SQL editor (database owner).
-- Runs even if no user opens Keiko; read/write RPCs also enforce retention immediately.
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('keiko-daily-retention','17 3 * * *','select public.keiko_prune_details()')
where not exists(select 1 from cron.job where jobname='keiko-daily-retention');
