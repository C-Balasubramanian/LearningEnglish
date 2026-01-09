
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import VoiceLearning from './components/VoiceLearning';
import WritingLearning from './components/WritingLearning';
import ReadingLearning from './components/ReadingLearning';
import StoryBooks from './components/StoryBooks';
import AIHelp from './components/AIHelp';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import MethodologyPage from './components/MethodologyPage';
import AdminUserList from './components/AdminUserList';
import ProfilePage from './components/ProfilePage';
import Translator from './components/Translator';
// import DailyRoutine from './components/DailyRoutine';
import { LearningMode, User } from './types';
import { PersistenceService } from './services/persistence';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'app' | 'methodology'>('landing');
  const [currentMode, setCurrentMode] = useState<LearningMode>(LearningMode.DASHBOARD);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const saved = PersistenceService.getCurrentUser();
    if (saved) {
      setUser(saved);
      setViewState('app');
    }
    setIsInitializing(false);
  }, []);

  const handleLogout = () => {
    PersistenceService.logout();
    setUser(null);
    setViewState('landing');
    setCurrentMode(LearningMode.DASHBOARD);
  };

  const handleLogin = (u: User) => {
    setUser(u);
    setViewState('app');
    setCurrentMode(LearningMode.DASHBOARD);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (isInitializing) return null;

  if (viewState === 'landing') return <LandingPage onGetStarted={() => setViewState('auth')} onLogin={() => setViewState('auth')} onMethodology={() => setViewState('methodology')} user={user || undefined} onLogout={handleLogout} onNavigateToDashboard={() => setViewState('app')} />;
  if (viewState === 'methodology') return <MethodologyPage onBack={() => setViewState('landing')} onGetStarted={() => setViewState('auth')} />;
  if (viewState === 'auth' && !user) return <Auth onLogin={handleLogin} />;
  if (!user) { setViewState('landing'); return null; }

  const renderContent = () => {
    switch (currentMode) {
      case LearningMode.SPEAKING: return <VoiceLearning user={user} />;
      case LearningMode.WRITING: return <WritingLearning user={user} />;
      case LearningMode.READING: return <ReadingLearning user={user} />;
      case LearningMode.STORY_BOOKS: return <StoryBooks user={user} />;
      // case LearningMode.DAILY_ROUTINE: return <DailyRoutine user={user} />;
      case LearningMode.ASSISTANT: return <AIHelp user={user} onStartCall={() => setCurrentMode(LearningMode.SPEAKING)} />;
      case LearningMode.ADMIN_USERS: return <AdminUserList />;
      case LearningMode.PROFILE: return <ProfilePage user={user} onUserUpdate={handleUserUpdate} />;
      case LearningMode.TRANSLATOR: return <Translator user={user} />;
      case LearningMode.DASHBOARD:
      default: return <Dashboard user={user} onNavigate={setCurrentMode} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <div className={`fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar currentMode={currentMode} setMode={(m) => { setCurrentMode(m); setIsSidebarOpen(false); }} user={user} onLogout={handleLogout} />
      </div>
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-slate-50 rounded-lg"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <span className="font-black text-slate-900 tracking-tight">Star AI</span>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">{user.englishLevel}</span>
             <img src={user.avatar} className="w-8 h-8 rounded-xl" alt="" />
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

export default App;
