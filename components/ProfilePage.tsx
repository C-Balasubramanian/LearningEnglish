
import React, { useState } from 'react';
import { User } from '../types';
import { PersistenceService } from '../services/persistence';

interface ProfilePageProps {
  user: User;
  onUserUpdate: (user: User) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [level, setLevel] = useState<User['englishLevel']>(user.englishLevel);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Password Change States
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    setMessage(null);
    try {
      const updatedUser = await PersistenceService.updateUser(user.id, { name, englishLevel: level });
      onUserUpdate(updatedUser);
      setIsEditing(false);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update profile', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    setIsSaving(true);
    setMessage(null);
    try {
      await PersistenceService.updatePassword(user.id, currentPassword, newPassword);
      setMessage({ text: 'Password changed successfully!', type: 'success' });
      setShowPasswordChange(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to change password', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 font-medium">Manage your profile and learning preferences</p>
        </div>
        {!isEditing && !showPasswordChange && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Edit Profile
          </button>
        )}
      </header>

      {message && (
        <div className={`p-4 rounded-2xl font-bold text-center text-xs animate-in slide-in-from-top-2 duration-300 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>
        </div>
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6 flex justify-between items-end">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl bg-white"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                ) : (
                  <div className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700">
                    {user.name}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <div className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-400/80 cursor-not-allowed">
                  {user.email}
                  <span className="ml-2 text-[9px] font-black uppercase text-slate-300">(Read Only)</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">English Proficiency</label>
                {isEditing ? (
                  <div className="grid grid-cols-3 gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                      <button 
                        key={l} 
                        onClick={() => setLevel(l as any)}
                        className={`py-3 text-[9px] font-black uppercase tracking-widest rounded-xl border transition-all ${
                          level === l ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl font-black text-indigo-600 uppercase tracking-widest text-xs">
                    {user.englishLevel}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Account Role</label>
                <div className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 capitalize flex items-center justify-between">
                  {user.role}
                  <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 pt-8 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => { setIsEditing(false); setName(user.name); setLevel(user.englishLevel); }}
                className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security / Password Column */}
        <div className="bg-slate-900 p-8 rounded-[2rem] text-white space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-xl font-black tracking-tight">Security</h3>
              <p className="text-slate-400 text-xs font-medium">Password and access control</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
          </div>

          {!showPasswordChange ? (
            <div className="space-y-4 relative z-10">
              <p className="text-slate-400 text-xs font-medium">Your account data is managed through the local persistence layer.</p>
              <button 
                onClick={() => setShowPasswordChange(true)}
                className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Change Password
              </button>
            </div>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4 relative z-10 animate-in fade-in slide-in-from-right-2">
              <input 
                type="password" 
                placeholder="Current Password" 
                required
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="New Password" 
                required
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Confirm New Password" 
                required
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <div className="flex gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => { setShowPasswordChange(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20"
                >
                  {isSaving ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Learning Stats Column */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Preferences</h3>
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>
            </div>
          </div>
          
          <div className="space-y-4">
             <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Language</span>
               <span className="text-xs font-black text-slate-900">English (US)</span>
             </div>
             <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Feedback Style</span>
               <span className="text-xs font-black text-slate-900">Comprehensive</span>
             </div>
             <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Daily Goal</span>
               <span className="text-xs font-black text-slate-900">30 Minutes</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
