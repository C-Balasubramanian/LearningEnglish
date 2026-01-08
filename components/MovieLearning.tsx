
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MovieStory, MovieScene, User } from '../types';

interface MovieLearningProps {
  user: User;
}

const MovieLearning: React.FC<MovieLearningProps> = ({ user }) => {
  const [selectedStory, setSelectedStory] = useState<MovieStory | null>(null);
  const [selectedScene, setSelectedScene] = useState<MovieScene | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const stories: MovieStory[] = [
    {
      id: 'story-1',
      title: 'The Great Ambition',
      genre: 'Drama / Inspirational',
      rating: '9.8',
      coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
      parts: [
        {
          id: '1-1',
          title: 'Part 1: The Spark',
          description: 'A young dreamer faces the first hurdle of their journey.',
          thumbnail: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=400',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          subtitles: [
            { time: 1, english: "Don't ever let somebody tell you...", tamil: "யாராவது உன்னிடம் சொல்ல அனுமதிக்காதே..." },
            { time: 3, english: "...you can't do something.", tamil: "...உன்னால் எதையும் செய்ய முடியாது என்று." },
            { time: 5, english: "You got a dream... you gotta protect it.", tamil: "உனக்கு ஒரு கனவு இருந்தால்... அதை நீ பாதுகாக்க வேண்டும்." }
          ]
        },
        {
          id: '1-2',
          title: 'Part 2: The Struggle',
          description: 'Working hard behind the scenes to reach the goal.',
          thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400',
          videoUrl: 'https://www.w3schools.com/html/movie.mp4',
          subtitles: [
            { time: 1, english: "It takes time to build something great.", tamil: "சிறந்த ஒன்றை உருவாக்க நேரம் எடுக்கும்." },
            { time: 4, english: "Consistency is more important than intensity.", tamil: "தீவிரத்தை விட நிலைத்தன்மை முக்கியமானது." }
          ]
        }
      ]
    },
    {
      id: 'story-2',
      title: 'Silicon Valley Dreams',
      genre: 'Business / Tech',
      rating: '9.5',
      coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
      parts: [
        {
          id: '2-1',
          title: 'The Pitch Deck',
          description: 'Learning how to present an idea with confidence.',
          thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=400',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          subtitles: [
            { time: 1, english: "We're not just building an app, we're building a future.", tamil: "நாங்கள் ஒரு செயலியை மட்டும் உருவாக்கவில்லை, எதிர்காலத்தை உருவாக்குகிறோம்." },
            { time: 5, english: "Scalability is our biggest advantage.", tamil: "அளவிடக்கூடிய தன்மையே எங்களின் மிகப்பெரிய நன்மை." }
          ]
        }
      ]
    },
    {
      id: 'story-3',
      title: 'Echoes of History',
      genre: 'Period Drama',
      rating: '9.2',
      coverImage: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800',
      parts: []
    }
  ];

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const getActiveSubtitle = () => {
    if (!selectedScene) return null;
    return selectedScene.subtitles
      .filter(s => currentTime >= s.time)
      .slice(-1)[0];
  };

  const analyzeScene = async () => {
    if (!selectedScene || isAnalyzing) return;
    setIsAnalyzing(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const dialogue = selectedScene.subtitles.map(s => s.english).join(' ');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a cinematic language expert. Analyze the storytelling and dialogue in this scene: "${selectedScene.title}".
        Dialogue: "${dialogue}". 
        Explain the context, 3 advanced vocabulary words, and their Tamil equivalents for a student. 
        Format as a professional story breakdown.`,
      });
      setAiAnalysis(response.text);
    } catch (err) {
      console.error(err);
      setAiAnalysis("Analysis currently unavailable. Please check back later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const activeSub = getActiveSubtitle();

  // Navigation Logic
  const goBackToLibrary = () => {
    setSelectedStory(null);
    setSelectedScene(null);
    setAiAnalysis(null);
  };

  const goBackToStory = () => {
    setSelectedScene(null);
    setAiAnalysis(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
      {/* Dynamic Header */}
      <header className="p-6 border-b border-white/5 bg-slate-900/40 backdrop-blur-xl flex items-center justify-between z-30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">Show & Learn</h1>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Premium Story-Based English</p>
          </div>
        </div>

        {(selectedStory || selectedScene) && (
          <button 
            onClick={selectedScene ? goBackToStory : goBackToLibrary}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-white/10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {selectedScene ? 'Back to Story' : 'All Shows'}
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto">
        {!selectedStory ? (
          /* Show Gallery */
          <div className="p-8 md:p-12 space-y-12">
            <section>
              <h2 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">Original Series</h2>
              <div className="flex gap-8 overflow-x-auto pb-8 custom-scrollbar scroll-smooth">
                {stories.map(story => (
                  <div 
                    key={story.id}
                    onClick={() => setSelectedStory(story)}
                    className="flex-shrink-0 w-72 md:w-96 group cursor-pointer"
                  >
                    <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-indigo-500/20 group-hover:border-indigo-500/30">
                      <img src={story.coverImage} alt={story.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-8">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-indigo-600 rounded text-[9px] font-black uppercase">Lesson</span>
                          <span className="text-[10px] font-bold text-white/60">{story.genre}</span>
                        </div>
                        <h3 className="text-2xl font-black text-white">{story.title}</h3>
                      </div>
                      <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white/5 rounded-[3rem] p-10 border border-white/5">
              <div className="max-w-3xl">
                <h3 className="text-3xl font-black mb-4">Master English via Storytelling</h3>
                <p className="text-white/40 leading-relaxed text-lg">
                  Each story is segmented into manageable parts. Watch the drama unfold, learn the nuances of 
                  emotional dialogue, and see the direct translation to Tamil.
                </p>
                <div className="mt-8 flex gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-bold uppercase text-white/60">Dual Subtitles</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span className="text-xs font-bold uppercase text-white/60">AI Context Analysis</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : !selectedScene ? (
          /* Story Parts / Episode List */
          <div className="flex flex-col lg:flex-row h-full">
            <div className="flex-1 p-8 md:p-16 space-y-12 overflow-y-auto">
               <div className="flex flex-col md:flex-row gap-12 items-start">
                 <img src={selectedStory.coverImage} className="w-full md:w-80 aspect-[16/10] rounded-[2rem] object-cover shadow-2xl border border-white/10" />
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-lg text-xs font-black tracking-widest border border-indigo-400/20">SERIES</span>
                      <span className="text-white/40 font-bold">{selectedStory.rating} / 10 Rating</span>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter">{selectedStory.title}</h2>
                    <p className="text-white/40 text-lg max-w-xl">{selectedStory.genre} • Interactive Video Workshop</p>
                    <p className="text-white/60 text-base leading-relaxed max-w-2xl">
                      Welcome to this story-based learning experience. Follow the character arcs and learn high-frequency 
                      idioms and expressions used in native English cinema.
                    </p>
                 </div>
               </div>

               <section className="space-y-6">
                  <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em]">Episodes / Parts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {selectedStory.parts.length > 0 ? selectedStory.parts.map((part, idx) => (
                      <div 
                        key={part.id}
                        onClick={() => setSelectedScene(part)}
                        className="group bg-slate-900/50 rounded-3xl p-4 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer flex gap-4 items-center"
                      >
                        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                          <img src={part.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-indigo-400 text-[10px] font-black uppercase mb-1">Part {idx + 1}</p>
                           <h4 className="font-black text-lg truncate mb-1">{part.title}</h4>
                           <p className="text-[11px] text-white/40 truncate">{part.description}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                        <p className="text-white/20 font-black text-lg uppercase tracking-widest">More Parts Coming Soon</p>
                      </div>
                    )}
                  </div>
               </section>
            </div>
          </div>
        ) : (
          /* The Interactive Cinema Player */
          <div className="flex flex-col lg:flex-row h-full overflow-hidden">
            <div className="flex-1 bg-black relative flex flex-col group">
              <div className="flex-1 flex items-center justify-center p-4">
                <video 
                  ref={videoRef}
                  src={selectedScene.videoUrl} 
                  onTimeUpdate={handleTimeUpdate}
                  controls 
                  className="max-w-full max-h-[75vh] rounded-[2rem] shadow-[0_0_100px_rgba(79,70,229,0.2)] border border-white/10"
                />
              </div>

              {/* Enhanced Subtitle Overlay */}
              <div className="absolute bottom-[15%] left-0 right-0 flex flex-col items-center pointer-events-none p-8">
                {activeSub && (
                  <div className="bg-slate-950/90 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] max-w-3xl text-center space-y-4 animate-in fade-in slide-in-from-bottom-8 shadow-2xl">
                    <p className="text-2xl md:text-4xl font-black text-white leading-tight tracking-tight">{activeSub.english}</p>
                    <div className="flex items-center gap-4 py-2">
                       <div className="h-px flex-1 bg-indigo-500/20"></div>
                       <span className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.3em]">Tamil Sub</span>
                       <div className="h-px flex-1 bg-indigo-500/20"></div>
                    </div>
                    <p className="text-xl md:text-3xl font-bold text-indigo-400/90">{activeSub.tamil}</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI Breakdown Panel */}
            <div className="w-full lg:w-[480px] bg-slate-900 border-l border-white/5 flex flex-col overflow-hidden">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Cinema Analysis</h3>
                  <p className="text-[10px] font-bold text-white/40 uppercase mt-1">Contextual Learning</p>
                </div>
                <button 
                  onClick={analyzeScene}
                  disabled={isAnalyzing}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95c.23 2.61 2.293 4.674 4.903 4.903a1 1 0 01.95.897v5.405a1 1 0 01-.95.897c-2.61.23-4.674 2.293-4.903 4.903a1 1 0 01-.897.95h-5.405a1 1 0 01-.897-.95c-.23-2.61-2.293-4.674-4.903-4.903a1 1 0 01-.95-.897V8.797a1 1 0 01.95-.897c2.61-.23 4.674-2.293 4.903-4.903a1 1 0 01.897-.95h5.405zM10 11a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                  )}
                  {isAnalyzing ? 'Analyzing' : 'Breakdown'}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {aiAnalysis ? (
                  <div className="animate-in fade-in slide-in-from-right duration-700">
                    <div className="p-7 bg-white/5 border border-white/10 rounded-[2rem] leading-relaxed text-slate-200 whitespace-pre-wrap text-sm md:text-base shadow-inner">
                      {aiAnalysis}
                    </div>
                    <div className="mt-8 p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] relative overflow-hidden group/card">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-bl-full -mr-16 -mt-16"></div>
                       <p className="text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-3">Immersive Challenge</p>
                       <p className="text-white font-medium text-sm leading-relaxed">
                         Can you summarize what happened in this part using at least two new words you just learned?
                       </p>
                       <button className="mt-6 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all">Try Speaking Challenge</button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center border border-white/5">
                      <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white/60 font-black uppercase tracking-widest text-xs mb-2">Awaiting Breakdown</h4>
                      <p className="text-white/20 text-[11px] leading-relaxed max-w-xs mx-auto">
                        Pause the video at any time and click the 'Breakdown' button to get AI-powered linguistic insights for this part of the story.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-8 bg-slate-950/40 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Learning for {user.name}</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/50"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer / Status Bar */}
      <footer className="relative z-10 p-4 flex justify-center border-t border-white/5 bg-slate-950/40">
        <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em]">Linguist AI Show & Learn Studio • Propelled by Gemini 3</p>
      </footer>
    </div>
  );
};

export default MovieLearning;
