
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import VoiceLearning from './components/VoiceLearning';
import WritingLearning from './components/WritingLearning';
import ReadingLearning from './components/ReadingLearning';
import MovieLearning from './components/MovieLearning';
import AIHelp from './components/AIHelp';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import MethodologyPage from './components/MethodologyPage';
import AdminUserList from './components/AdminUserList';
import ProfilePage from './components/ProfilePage';
import Translator from './components/Translator';
import { LearningMode, User } from './types';
import { PersistenceService } from './services/persistence';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'app' | 'methodology'>('landing');
  const [currentMode, setCurrentMode] = useState<LearningMode>(LearningMode.DASHBOARD);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedUser = PersistenceService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      // If a user is saved, they start in the 'app' state
      setViewState('app');
    }
    setIsInitializing(false);
  }, []);

  const handleLogout = () => {
    PersistenceService.logout();
    setUser(null);
    setViewState('landing');
    setCurrentMode(LearningMode.DASHBOARD);
    setIsSidebarOpen(false);
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setViewState('app');
  };

  const handleModeChange = (mode: LearningMode) => {
    setCurrentMode(mode);
    setViewState('app'); // Ensure we are in the 'app' view
    setIsSidebarOpen(false);
  };

  const navigateToDashboard = () => {
    setViewState('app');
    setCurrentMode(LearningMode.DASHBOARD);
  };

  if (isInitializing) return null;

  // View Routing Logic
  if (viewState === 'landing') {
    return (
      <LandingPage 
        user={user || undefined}
        onGetStarted={() => user ? navigateToDashboard() : setViewState('auth')} 
        onLogin={() => setViewState('auth')} 
        onMethodology={() => setViewState('methodology')}
        onLogout={handleLogout}
        onNavigateToDashboard={navigateToDashboard}
      />
    );
  }

  if (viewState === 'methodology') {
    return (
      <MethodologyPage 
        onBack={() => setViewState('landing')}
        onGetStarted={() => user ? navigateToDashboard() : setViewState('auth')}
      />
    );
  }

  if (viewState === 'auth' && !user) {
    return <Auth onLogin={handleLogin} />;
  }

  // If we reach here, we must have a user and be in 'app' state
  if (!user) {
    setViewState('landing');
    return null;
  }

  const renderContent = () => {
    switch (currentMode) {
      case LearningMode.SPEAKING:
        return <VoiceLearning user={user} />;
      case LearningMode.WRITING:
        return <WritingLearning user={user} />;
      case LearningMode.READING:
        return <ReadingLearning user={user} />;
      case LearningMode.MOVIE_LEARNING:
        return <MovieLearning user={user} />;
      case LearningMode.ASSISTANT:
        return <AIHelp user={user} onStartCall={() => setCurrentMode(LearningMode.SPEAKING)} />;
      case LearningMode.ADMIN_USERS:
        return <AdminUserList />;
      case LearningMode.PROFILE:
        return <ProfilePage user={user} />;
      case LearningMode.TRANSLATOR:
        return <Translator user={user} />;
      case LearningMode.DASHBOARD:
      default:
        return <Dashboard user={user} onNavigate={handleModeChange} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 relative animate-in fade-in duration-500">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile by default, Slide-in via z-index */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar 
          currentMode={currentMode} 
          setMode={handleModeChange} 
          user={user} 
          onLogout={handleLogout} 
        />
      </div>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors mr-2"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <button onClick={() => setViewState('landing')} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <span className="font-black text-slate-900 tracking-tight hidden sm:inline">Star AI</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={() => handleModeChange(LearningMode.PROFILE)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
             >
                <img src={user.avatar} className="w-8 h-8 rounded-xl shadow-sm border border-white" alt={user.name} />
                <span className="text-xs font-black text-slate-900 hidden md:inline">{user.name}</span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50/30">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
