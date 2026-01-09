
import React, { useState } from 'react';
import { PersistenceService } from '../services/persistence';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [level, setLevel] = useState<User['englishLevel']>('Intermediate');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError('');
    setStatus('Creating your profile...');
    
    try {
      const user = await PersistenceService.createUser(name, email, password, level);
      PersistenceService.setCurrentUser(user);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during sign up.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setStatus('Verifying credentials...');
    
    try {
      const user = await PersistenceService.login(email, password);
      PersistenceService.setCurrentUser(user);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full -ml-16 -mb-16 blur-2xl opacity-50"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200 text-white transform rotate-3 hover:rotate-0 transition-transform">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Star AI</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-3">
            {isLogin ? 'Welcome Back' : 'Get Started for Free'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold text-center animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4 relative z-10">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white focus:outline-none transition-all font-medium" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com" 
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white focus:outline-none transition-all font-medium" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 focus:bg-white focus:outline-none transition-all font-medium" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          {!isLogin && (
            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-center block">Current Proficiency</label>
              <div className="grid grid-cols-3 gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                  <button 
                    key={l} 
                    type="button" 
                    onClick={() => setLevel(l as any)} 
                    className={`py-3 text-[9px] font-black uppercase tracking-widest rounded-xl border transition-all ${level === l ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-indigo-300'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full mt-4 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {status}
              </>
            ) : (
              isLogin ? 'Sign In to Portal' : 'Register Account'
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center relative z-10">
          <p className="text-slate-400 text-xs font-medium mb-4">
            {isLogin ? "Don't have an account yet?" : "Already have an account?"}
          </p>
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {isLogin ? 'Create Secure Profile' : 'Sign In to Existing'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
