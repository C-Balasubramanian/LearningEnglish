
import React, { useState, useEffect } from 'react';
import { LearningMode, User, Activity } from '../types';
import { PersistenceService } from '../services/persistence';

interface DashboardProps {
  user: User;
  onNavigate: (mode: LearningMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [history, setHistory] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      const data = await PersistenceService.getActivities(user.id);
      setHistory(data);
      setIsLoading(false);
    };
    fetchHistory();
  }, [user.id]);

  const speakingCount = history.filter(a => a.type === LearningMode.SPEAKING).length;
  const readingCount = history.filter(a => a.type === LearningMode.READING).length;
  const writingCount = history.filter(a => a.type === LearningMode.WRITING).length;
  const total = history.length || 1;

  const cards = [
    { mode: LearningMode.SPEAKING, title: 'AI Call', desc: 'Real-time conversation practice', icon: 'mic', color: 'indigo' },
    { mode: LearningMode.READING, title: 'Reading Mastery', desc: 'Personalized stories & quizzes', icon: 'book', color: 'emerald' },
    { mode: LearningMode.WRITING, title: 'Writing Studio', desc: 'Grammar analysis & feedback', icon: 'pencil', color: 'amber' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 md:space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h1>
          <p className="text-slate-500 text-base md:text-lg font-medium">You've completed <span className="text-indigo-600 font-bold">{history.length} learning sessions</span> so far.</p>
        </div>
        
        <div className="flex items-center gap-4 self-end md:self-center">
          <div className="hidden sm:flex gap-3">
            <div className="bg-white px-6 py-4 rounded-3xl border border-slate-200 shadow-sm text-center min-w-[100px]">
              <p className="text-xl font-black text-indigo-600">{(history.length * 15 / 60).toFixed(1)}h</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Hours</p>
            </div>
          </div>
          
          <button 
            onClick={() => onNavigate(LearningMode.PROFILE)}
            className="flex items-center gap-3 p-2 pr-5 bg-white border border-slate-200 rounded-3xl hover:border-indigo-600 transition-all group"
          >
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-2xl shadow-sm border border-slate-100 group-hover:scale-105 transition-transform" />
            <div className="text-left hidden md:block">
              <p className="text-xs font-black text-slate-900 leading-none">{user.name}</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">View Profile</p>
            </div>
          </button>
        </div>
      </header>

      {/* Mode Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        {cards.map((card) => (
          <div
            key={card.mode}
            onClick={() => onNavigate(card.mode)}
            className="group bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-${card.color}-50 rounded-bl-full -mr-12 md:-mr-16 -mt-12 md:-mt-16 group-hover:bg-${card.color}-100 transition-colors`}></div>
            <div className={`w-12 md:w-14 h-12 md:h-14 bg-${card.color}-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-${card.color}-100 text-white relative z-10`}>
               {card.icon === 'mic' && <svg className="w-6 md:w-7 h-6 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>}
               {card.icon === 'book' && <svg className="w-6 md:w-7 h-6 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" /></svg>}
               {card.icon === 'pencil' && <svg className="w-6 md:w-7 h-6 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 md:mb-3">{card.title}</h3>
            <p className="text-slate-500 leading-relaxed text-sm font-medium">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-lg md:text-xl font-black text-slate-900">Learning Activity</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Daily Document Submissions</p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {isLoading ? (
              <div className="p-20 text-center flex flex-col items-center gap-6">
                 <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Querying History...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No activity recorded yet</p>
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="group p-4 md:p-6 flex items-center gap-4 md:gap-6 hover:bg-slate-50 transition-all rounded-3xl">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                    item.type === LearningMode.SPEAKING ? 'bg-indigo-100 text-indigo-600 shadow-inner' : 
                    item.type === LearningMode.READING ? 'bg-emerald-100 text-emerald-600 shadow-inner' : 'bg-amber-100 text-amber-600 shadow-inner'
                  }`}>
                    <span className="text-[10px] font-black uppercase">{item.type[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-slate-900 truncate flex items-center gap-2">
                      {item.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                  </div>
                  {item.score !== undefined && (
                    <div className="text-right">
                      <p className={`text-lg font-black ${item.score > 80 ? 'text-emerald-600' : 'text-slate-700'}`}>{item.score}%</p>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Score</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col relative overflow-hidden">
           <div className="mb-10 relative z-10">
             <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-100">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Skill Breakdown</h3>
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Usage across categories</p>
           </div>
           
           <div className="flex-1 space-y-8 relative z-10">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Speaking</p>
                  <p className="text-sm font-black text-indigo-600">{Math.round((speakingCount/total)*100)}%</p>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                   <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${(speakingCount/total)*100}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Reading</p>
                  <p className="text-sm font-black text-emerald-600">{Math.round((readingCount/total)*100)}%</p>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                   <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${(readingCount/total)*100}%` }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Writing</p>
                  <p className="text-sm font-black text-amber-600">{Math.round((writingCount/total)*100)}%</p>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                   <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${(writingCount/total)*100}%` }} />
                </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
