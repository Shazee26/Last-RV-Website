
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state (set by ProtectedRoute)
  const from = (location.state as any)?.from?.pathname || '/';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/#/login?reset=true`,
        });
        if (error) throw error;
        setMessage('Password reset link sent! Please check your email inbox.');
      } else if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Registration successful! Check your email for the confirmation link.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Redirect to intended page or home
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
        <div className="text-center mb-8">
          <i className="fa-solid fa-mountain-sun text-emerald-700 text-4xl mb-4"></i>
          <h2 className="text-3xl font-bold text-stone-800">
            {isForgotPassword ? 'Reset Password' : isSignUp ? 'Join Mountain View' : 'Welcome Back'}
          </h2>
          <p className="text-stone-500 mt-2">
            {isForgotPassword ? 'Enter your email to receive a recovery link' : 'Access your guest dashboard'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-700 text-sm rounded-xl border border-rose-100 animate-in fade-in slide-in-from-top-2">
            <i className="fa-solid fa-circle-exclamation mr-2"></i>
            {error}
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
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
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
                    onClick={() => { setIsForgotPassword(true); setError(null); setMessage(null); }}
                    className="text-[10px] font-bold text-emerald-700 hover:underline uppercase tracking-widest"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
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

        <div className="mt-8 text-center border-t border-stone-50 pt-6">
          {isForgotPassword ? (
            <button
              onClick={() => { setIsForgotPassword(false); setError(null); setMessage(null); }}
              className="text-stone-500 text-sm font-bold hover:text-emerald-700 transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i> Back to Login
            </button>
          ) : (
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
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
