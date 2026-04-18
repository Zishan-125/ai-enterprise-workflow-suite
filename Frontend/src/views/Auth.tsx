// Frontend/src/views/Auth.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';
import api from '../api/axios';

interface AuthViewProps {
  onLogin: (token: string, user?: any) => void;
  darkMode: boolean;
  authMode: 'login' | 'signup' | 'forgot';
  setAuthMode: (mode: 'login' | 'signup' | 'forgot') => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, darkMode, authMode, setAuthMode }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]       = useState('');
  const [error, setError]     = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // ✅ Route to correct endpoint based on mode
      const endpoint = authMode === 'signup' ? '/auth/signup' : '/auth/login';
      const payload  = authMode === 'signup'
        ? { name, email, password }
        : { email, password };

      const response = await api.post(endpoint, payload);

      // ✅ Destructure the REAL JWT and user from the response
      const { token, user } = response.data;

      if (!token || token.split('.').length !== 3) {
        setError('Auth system returned an invalid token. Contact support.');
        return;
      }

      // ✅ Pass real JWT token — NOT profile data, NOT neuralId
      onLogin(token, user);

    } catch (err: any) {
      const msg = err.response?.data?.message || 'Connection failed. Is the server running on port 5000?';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const base  = darkMode ? 'bg-slate-950 text-white'       : 'bg-slate-50 text-slate-900';
  const card  = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200';
  const input = darkMode ? 'bg-slate-800 text-white placeholder-slate-500'
                         : 'bg-slate-100 text-slate-900 placeholder-slate-400';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${base}`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`w-full max-w-md p-8 rounded-[2.5rem] border shadow-2xl ${card}`}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-black uppercase italic tracking-tighter">SMARTDO</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-widest">
            {authMode === 'login' ? 'Re-enter the network' : 'Initialize your node'}
          </p>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase text-center tracking-wide"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-3">
          <AnimatePresence>
            {authMode === 'signup' && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <input
                  required type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Full Name" autoComplete="name"
                  className={`w-full px-4 py-3 rounded-xl outline-none text-sm ${input}`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <input
            required type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" autoComplete="email"
            className={`w-full px-4 py-3 rounded-xl outline-none text-sm ${input}`}
          />

          {authMode !== 'forgot' && (
            <input
              required type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder={authMode === 'signup' ? 'Create password (min 6 chars)' : 'Secret Key'}
              autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
              minLength={6}
              className={`w-full px-4 py-3 rounded-xl outline-none text-sm ${input}`}
            />
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition-colors text-white font-black py-4 rounded-xl flex justify-center items-center gap-2 text-sm"
          >
            {loading
              ? <Loader2 size={16} className="animate-spin" />
              : authMode === 'login' ? 'Sync Connection'
              : authMode === 'signup' ? 'Initialize Node'
              : 'Send Reset Link'
            }
          </button>
        </form>

        {/* Mode switchers */}
        <div className="mt-6 flex flex-col items-center gap-2">
          {authMode === 'login' && (
            <>
              <button onClick={() => { setAuthMode('signup'); setError(''); }}
                className="text-[11px] font-black uppercase text-indigo-500 hover:text-indigo-400 transition-colors tracking-wider">
                → Initialize New Node
              </button>
              <button onClick={() => { setAuthMode('forgot'); setError(''); }}
                className="text-[10px] font-bold text-slate-500 hover:text-slate-400 transition-colors">
                Forgot password?
              </button>
            </>
          )}
          {authMode !== 'login' && (
            <button onClick={() => { setAuthMode('login'); setError(''); }}
              className="text-[11px] font-black uppercase text-indigo-500 hover:text-indigo-400 transition-colors tracking-wider">
              ← Back to Login
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthView;