
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
  const [statusMessage, setStatusMessage] = useState('');

  const dbInfo = PersistenceService.getDbInfo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setStatusMessage(isLogin ? 'Verifying Atlas Document...' : 'Connecting to Cluster0...');

    try {
      if (isLogin) {
        const user = await PersistenceService.getUserByEmail(email);
        if (user && user.password === password) {
          PersistenceService.setCurrentUser(user);
          onLogin(user);
        } else {
          setError('Invalid cloud credentials. Please check your email/password.');
        }
      } else {
        if (!name || !email || !password) {
          setError('Required fields: Name, Email, Password.');
        } else {
          const existing = await PersistenceService.getUserByEmail(email);
          if (existing) {
            setError('User document already exists in this cluster.');
          } else {
            setStatusMessage('Inserting document into test.users...');
            const user = await PersistenceService.createUser(name, email, password, level);
            setStatusMessage('Document committed successfully!');
            await new Promise(r => setTimeout(r, 600));
            PersistenceService.setCurrentUser(user);
            onLogin(user);
          }
        }
      }
    } catch (err) {
      setError('Connection to MongoDB Atlas failed. Check network.');
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent_70%)]"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 relative overflow-hidden">
          {/* MongoDB Status Badge */}
          <div className="absolute top-0 right-0 p-6 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Cluster0 Online</span>
          </div>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Linguist AI</h1>
            <p className="text-slate-500 mt-2 font-bold uppercase text-[10px] tracking-widest">
              {isLogin ? `Log in to ${dbInfo.database}` : `Sign up to ${dbInfo.database}`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all disabled:opacity-50 font-medium"
                  placeholder="Your Name"
                  disabled={isLoading}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all disabled:opacity-50 font-medium"
                placeholder="email@example.com"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all disabled:opacity-50 font-medium"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLevel(l)}
                      className={`py-3 text-[10px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                        level === l 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-indigo-300'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl">
                <p className="text-rose-500 text-[11px] font-bold text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4.5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center min-h-[56px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="text-[10px] uppercase">{statusMessage}</span>
                </div>
              ) : (
                <span>{isLogin ? 'Sign In to Cluster0' : 'Create Atlas Account'}</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-slate-400 hover:text-indigo-600 font-black transition-colors text-[10px] uppercase tracking-widest"
              disabled={isLoading}
            >
              {isLogin ? "New to Linguist? Sign Up" : "Already have a document? Sign In"}
            </button>
          </div>
        </div>
        <p className="mt-6 text-center text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">Project: {dbInfo.project} • Node: {dbInfo.host}</p>
      </div>
    </div>
  );
};

export default Auth;
