-- Apply after 001_progress.sql using the Supabase SQL editor (database owner).
-- Runs even if no user opens Keiko; read/write RPCs also enforce retention immediately.
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('keiko-daily-retention','17 3 * * *','select public.keiko_prune_details()')
where not exists(select 1 from cron.job where jobname='keiko-daily-retention');
