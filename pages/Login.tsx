
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

    const redirectUrl = window.location.origin;

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${redirectUrl}/#/login?reset=true`,
        });
        if (error) throw error;
        setMessage('Password reset link sent! Please check your inbox.');
      } else if (isSignUp) {
        const { error, data } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });
        if (error) throw error;
        
        if (data?.session) {
          navigate(from, { replace: true });
        } else {
          setMessage('Activation email sent! Please check your inbox and spam folder to verify your account.');
          setShowResend(true);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          // Detect if error is due to unconfirmed email
          if (error.message.toLowerCase().includes('confirm') || error.message.toLowerCase().includes('verify')) {
            setShowResend(true);
          }
          throw error;
        }
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      console.error('Auth operation failed:', err);
      setError(err?.message || 'An unexpected authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    setResendLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      if (error) throw error;
      setMessage("A new verification link has been sent to your email.");
      setShowResend(false);
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12 dark:bg-stone-950">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-xl border border-stone-100 dark:border-stone-800">
        <div className="text-center mb-8">
          <i className="fa-solid fa-mountain-sun text-emerald-700 dark:text-emerald-500 text-4xl mb-4"></i>
          <h2 className="text-3xl font-bold text-stone-800 dark:text-stone-100">
            {isForgotPassword ? 'Reset Password' : isSignUp ? 'Join Mountain View' : 'Welcome Back'}
          </h2>
          <p className="text-stone-500 dark:text-stone-400 mt-2">
            {isForgotPassword ? 'Enter your email to recover your account' : 'Access your guest dashboard'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-700 text-sm rounded-xl border border-rose-100 animate-in fade-in slide-in-from-top-2">
            <i className="fa-solid fa-circle-exclamation mr-2"></i>
            {error}
            {showResend && (
              <button 
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="block mt-2 font-bold underline hover:text-rose-900 transition-colors"
              >
                {resendLoading ? 'Sending...' : 'Resend verification email?'}
              </button>
            )}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-2">
            <i className="fa-solid fa-circle-check mr-2"></i>
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          {!isForgotPassword && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">Password</label>
                {!isSignUp && (
                  <button 
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setError(null); setMessage(null); setShowResend(false); }}
                    className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline uppercase tracking-widest"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 text-white py-4 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2 mt-2"
          >
            {loading ? (
              <i className="fa-solid fa-spinner animate-spin"></i>
            ) : (
              <span>{isForgotPassword ? 'Send Recovery Link' : isSignUp ? 'Create Account' : 'Sign In'}</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-stone-50 dark:border-stone-800 pt-6">
          {isForgotPassword ? (
            <button
              onClick={() => { setIsForgotPassword(false); setError(null); setMessage(null); setShowResend(false); }}
              className="text-stone-500 text-sm font-bold hover:text-emerald-700 transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i> Back to Login
            </button>
          ) : (
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); setShowResend(false); }}
              className="text-stone-500 text-sm font-medium"
            >
              {isSignUp ? (
                <>Already have an account? <span className="text-emerald-700 font-bold hover:underline">Sign In</span></>
              ) : (
                <>Don't have an account? <span className="text-emerald-700 font-bold hover:underline">Sign Up</span></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
