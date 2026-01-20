
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showResend, setShowResend] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setShowResend(false);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/#/login?reset=true`,
        });
        if (error) throw error;
        setMessage('Vibrant reset link dispatched! Please check your inbox.');
      } else if (isSignUp) {
        const { error, data } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { emailRedirectTo: window.location.origin }
        });
        if (error) throw error;
        
        if (data?.session) {
          navigate(from, { replace: true });
        } else {
          setMessage('Activation transmission sent! Please verify your account to proceed.');
          setShowResend(true);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes('confirm') || error.message.toLowerCase().includes('verify')) {
            setShowResend(true);
          }
          throw error;
        }
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError("Email address required for re-transmission.");
      return;
    }
    setResendLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: { emailRedirectTo: window.location.origin }
      });
      if (error) throw error;
      setMessage("Vibrant verification link re-dispatched.");
      setShowResend(false);
    } catch (err: any) {
      setError(err.message || "Re-transmission failed.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb] dark:bg-[#0a0a0c] px-4 py-32 transition-colors duration-500 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent)] pointer-events-none"></div>

      <div className="max-w-md w-full animate-in zoom-in duration-700">
        <div className="bg-white dark:bg-stone-900 p-12 rounded-[3.5rem] shadow-3xl border border-stone-100 dark:border-white/5 relative overflow-hidden group">
          {/* Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 vibrant-gradient"></div>
          
          <div className="text-center mb-12">
            <div className="w-20 h-20 vibrant-gradient rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20 transform group-hover:rotate-6 transition-transform">
              <i className="fa-solid fa-mountain-sun text-3xl text-white"></i>
            </div>
            <h2 className="text-4xl font-black text-stone-900 dark:text-white tracking-tighter mb-4">
              {isForgotPassword ? 'Reset Access' : isSignUp ? 'Join Frontier' : 'Welcome Back'}
            </h2>
            <p className="text-stone-500 dark:text-stone-400 font-medium text-sm">
              {isForgotPassword ? 'Secure your account recovery' : 'The high desert is waiting for you'}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-rose-500/10 text-rose-500 text-xs font-bold rounded-2xl border border-rose-500/20 animate-in slide-in-from-top-2">
              <i className="fa-solid fa-triangle-exclamation mr-2"></i>
              {error}
              {showResend && (
                <button onClick={handleResendVerification} disabled={resendLoading} className="block mt-2 underline hover:text-rose-700">
                  {resendLoading ? 'Re-sending...' : 'Re-send verification email?'}
                </button>
              )}
            </div>
          )}

          {message && (
            <div className="mb-8 p-5 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-2xl border border-emerald-500/20 animate-in slide-in-from-top-2">
              <i className="fa-solid fa-circle-check mr-2"></i>
              {message}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Email Address</label>
              <input type="email" required placeholder="maverick@pioneer.com" className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            
            {!isForgotPassword && (
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Passphrase</label>
                  {!isSignUp && (
                    <button type="button" onClick={() => setIsForgotPassword(true)} className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline">Forgot?</button>
                  )}
                </div>
                <input type="password" required placeholder="••••••••" className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full vibrant-gradient text-white py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-emerald-500/30 flex items-center justify-center space-x-3">
              {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <span>{isForgotPassword ? 'Send Recovery link' : isSignUp ? 'Initiate Account' : 'Secure Sign In'}</span>}
            </button>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-stone-100 dark:border-white/5">
            <button onClick={() => { setIsSignUp(!isSignUp); setIsForgotPassword(false); setError(null); setMessage(null); }} className="text-stone-500 dark:text-stone-400 text-xs font-bold transition-colors hover:text-emerald-500">
              {isSignUp ? "Already a member? Sign In" : "New to Mountain View? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
