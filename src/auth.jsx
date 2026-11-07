import React, {createContext, memo, useContext, useMemo, useCallback} from 'react';
import {ClerkProvider, ClerkLoaded, ClerkLoading, ClerkFailed, SignInButton, SignUpButton, UserButton, useUser, useAuth, useSession} from '@clerk/react';
import './auth.css';

const Configured = createContext(false);
const Account = createContext({isLoaded:true,userId:null,getToken:async()=>null});
export const useAccount=()=>useContext(Account);
function AccountBridge({children}) {
  const {isLoaded,userId}=useAuth();
  const {session}=useSession();
  const getToken=useCallback(async()=>session?.getToken()??null,[session]);
  const value=useMemo(()=>({isLoaded,userId,getToken}),[isLoaded,userId,getToken]);
  return <Account.Provider value={value}>{children}</Account.Provider>;
}
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export function AuthProvider({children}) {
  // Authentication is optional: missing configuration must never block guest practice.
  if (!publishableKey) return children;
  return <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/" signInFallbackRedirectUrl="/" signUpFallbackRedirectUrl="/"><Configured.Provider value={true}><AccountBridge>{children}</AccountBridge></Configured.Provider></ClerkProvider>;
}

// Choose readable button text for every custom RGB accent.
function accentInk(accent) {
  const rgb = accent.match(/[a-f0-9]{2}/gi)?.map(v => parseInt(v,16)/255) || [1,1,1];
  const linear = rgb.map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
  const luminance = linear[0]*.2126 + linear[1]*.7152 + linear[2]*.0722;
  return luminance > .179 ? '#15141b' : '#ffffff';
}

export function useAuthAppearance({accent, background, foreground, muted, border}) {
  return useMemo(() => ({variables: {
    colorPrimary: accent, colorPrimaryForeground: accentInk(accent),
    colorBackground: background, colorForeground: foreground,
    colorInput: background, colorInputForeground: foreground,
    colorMutedForeground: muted, colorBorder: border,
    fontFamily: 'Manrope, sans-serif', borderRadius: '0.75rem',
  }, elements: {
    rootBox: {'--keiko-auth-accent': accent, '--keiko-auth-ink': accentInk(accent)},
    socialButtonsBlockButton: 'keiko-social-button',
    socialButtonsBlockButtonText: 'keiko-social-button-text',
  }}), [accent, background, foreground, muted, border]);
}

function ReadyControls({appearance}) {
  const {isSignedIn} = useUser();
  return isSignedIn
    ? <UserButton appearance={appearance} userProfileProps={{appearance}}/>
    : <><SignInButton mode="modal" appearance={appearance}><button className="auth-button">Sign in</button></SignInButton><SignUpButton mode="modal" appearance={appearance}><button className="auth-button auth-primary">Sign up</button></SignUpButton></>;
}
export const AuthControls = memo(function AuthControls({appearance}) {
  const configured = useContext(Configured);
  if (!configured) return <span className="auth-status" title="Configure Clerk to enable sign-in">Guest</span>;
  return <div className="auth-controls"><ClerkLoading><span className="auth-status" role="status">Loading account…</span></ClerkLoading><ClerkFailed><span className="auth-status" title="Sign-in is unavailable. Guest practice is still available.">Guest</span></ClerkFailed><ClerkLoaded><ReadyControls appearance={appearance}/></ClerkLoaded></div>;
});

function Identity({user}) {
  const name = user?.firstName || user?.fullName || user?.username || 'Your space';
  return <><div className="avatar">{user?.imageUrl ? <img src={user.imageUrl} alt=""/> : user ? name[0].toUpperCase() : 'G'}</div><div className="account-label"><strong>{user ? name : 'Guest space'}</strong><small>Saved on this device</small></div></>;
}
function ReadyIdentity() { const {user} = useUser(); return <Identity user={user}/>; }
export const AccountIdentity = memo(function AccountIdentity() {
  const configured = useContext(Configured);
  return configured ? <><ClerkLoading><Identity/></ClerkLoading><ClerkFailed><Identity/></ClerkFailed><ClerkLoaded><ReadyIdentity/></ClerkLoaded></> : <Identity/>;
});
