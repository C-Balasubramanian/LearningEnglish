
import React from 'react';
import { User } from '../types';

interface ProfilePageProps {
  user: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 font-medium">Manage your profile and learning preferences</p>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-12 mb-6">
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
                <div className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700">
                  {user.name}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <div className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700">
                  {user.email}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">English Proficiency</label>
                <div className="px-5 py-4 bg-indigo-50 border border-indigo-100 rounded-2xl font-black text-indigo-600 uppercase tracking-widest text-xs">
                  {user.englishLevel}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Account Type</label>
                <div className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 capitalize">
                  {user.role}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-black text-slate-900">Learning Stats</h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Language</span>
               <span className="text-xs font-black text-slate-900">English (US)</span>
             </div>
             <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Daily Goal</span>
               <span className="text-xs font-black text-slate-900">30 Minutes</span>
             </div>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2rem] text-white space-y-4">
          <h3 className="text-lg font-black">Security</h3>
          <p className="text-slate-400 text-xs font-medium">Your data is stored in MongoDB Atlas Cluster0.</p>
          <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
