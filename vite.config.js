import {defineConfig,loadEnv} from 'vite';
// Fail before bundling if a server credential is accidentally assigned to a public setting.
export default defineConfig(({mode})=>{
 const env={...loadEnv(mode,process.cwd(),'VITE_'),...Object.fromEntries(Object.entries(process.env).filter(([key])=>key.startsWith('VITE_')))};
 for(const [name,value] of Object.entries(env)){
   if(!value)continue;
   let secret=/^(sk_|sb_secret_)/.test(value)||/SERVICE_ROLE|SECRET_KEY|DATABASE_PASSWORD/.test(name);
   if(value.startsWith('eyJ'))try{secret ||= JSON.parse(Buffer.from(value.split('.')[1],'base64url').toString()).role==='service_role'}catch{}
   if(secret)throw Error(`Remove server credentials from ${name}. VITE settings are public.`);
 }
 return {};
});
