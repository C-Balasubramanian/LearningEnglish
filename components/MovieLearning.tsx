
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
      id: 'story-vikram',
      title: 'Vikram: The Ghost',
      genre: 'Action / Thriller',
      rating: '9.9',
      coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800',
      parts: [
        {
          id: 'v-1',
          title: 'The Interrogation Scene',
          description: 'Master the art of assertive English dialogue used in high-stakes situations.',
          thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          subtitles: [
            { time: 1, english: "I am not who you think I am.", tamil: "நீ நினைக்கும் ஆள் நான் இல்லை." },
            { time: 3, english: "The system is broken beyond repair.", tamil: "இந்த கட்டமைப்பு சரி செய்ய முடியாத அளவிற்கு உடைந்துவிட்டது." },
            { time: 6, english: "Nature always finds its way back.", tamil: "இயற்கை எப்போதும் தன் வழியைத் தேடிக்கொள்ளும்." }
          ]
        },
        {
          id: 'v-2',
          title: 'The Strategy Meeting',
          description: 'Learn professional vocabulary for planning and execution.',
          thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=400',
          videoUrl: 'https://www.w3schools.com/html/movie.mp4',
          subtitles: [
            { time: 1, english: "We need a tactical advantage.", tamil: "நமக்கு ஒரு தந்திரோபாய சாதகம் தேவை." },
            { time: 4, english: "Execute the plan with zero casualties.", tamil: "உயிரிழப்புகள் இல்லாமல் திட்டத்தை நிறைவேற்றுங்கள்." }
          ]
        },
        {
          id: 'v-3',
          title: 'The Hidden Base',
          description: 'Discover descriptive English for environments and technology.',
          thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          subtitles: [
            { time: 1, english: "Synchronize all units immediately.", tamil: "அனைத்து பிரிவுகளையும் உடனடியாக ஒருங்கிணைக்கவும்." },
            { time: 4, english: "The target is within our perimeter.", tamil: "இலக்கு நமது எல்லைக்குள் உள்ளது." }
          ]
        }
      ]
    },
    {
      id: 'story-ps',
      title: 'Ponniyin Selvan: Empire',
      genre: 'Historical / Epic',
      rating: '9.7',
      coverImage: 'https://images.unsplash.com/photo-1599408162165-401246c5c7bc?auto=format&fit=crop&q=80&w=800',
      parts: [
        {
          id: 'ps-1',
          title: 'A Kings Welcome',
          description: 'Formal English for ceremonies and royal introductions.',
          thumbnail: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&q=80&w=400',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          subtitles: [
            { time: 1, english: "Behold the majesty of the Chola kingdom.", tamil: "சோழ சாம்ராஜ்யத்தின் கம்பீரத்தைப் பாருங்கள்." },
            { time: 5, english: "Loyalty is worth more than gold.", tamil: "விசுவாசம் தங்கத்தை விட மதிப்புமிக்கது." }
          ]
        },
        {
          id: 'ps-2',
          title: 'The Secret Scroll',
          description: 'Mysterious dialogue and narrative English.',
          thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400',
          videoUrl: 'https://www.w3schools.com/html/movie.mp4',
          subtitles: [
            { time: 1, english: "This message must reach the capital.", tamil: "இந்த செய்தி தலைநகரை சென்றடைய வேண்டும்." },
            { time: 4, english: "History is written by the survivors.", tamil: "வரலாறு உயிர் பிழைத்தவர்களால் எழுதப்படுகிறது." }
          ]
        }
      ]
    },
    {
      id: 'story-leo',
      title: 'Leo: Bloody Sweet',
      genre: 'Action / Drama',
      rating: '9.6',
      coverImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=800',
      parts: [
        {
          id: 'l-1',
          title: 'The Cafe Confrontation',
          description: 'Everyday English mixed with intense cinematic tension.',
          thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=400',
          videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
          subtitles: [
            { time: 1, english: "I just want a peaceful life for my family.", tamil: "என் குடும்பத்திற்கு ஒரு அமைதியான வாழ்க்கை மட்டுமே எனக்கு வேண்டும்." },
            { time: 4, english: "Don't push me to the edge.", tamil: "என்னை எல்லை வரை தள்ளாதே." }
          ]
        }
      ]
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
    setAiAnalysis(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const dialogue = selectedScene.subtitles.map(s => s.english).join(' ');
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a bilingual English-Tamil linguistics expert. Analyze this movie scene: "${selectedScene.title}".
        English Dialogue: "${dialogue}".
        
        1. Explain the context of the English phrases used.
        2. Identify 3 advanced English words/idioms.
        3. Provide the natural Tamil conversational equivalent for these phrases (not literal translation).
        4. Suggest a practice sentence for the user.
        
        Format beautifully in Markdown for a Tamil speaker learning English.`,
      });
      setAiAnalysis(response.text);
    } catch (err) {
      console.error(err);
      setAiAnalysis("ஆய்வு இப்போது கிடைக்கவில்லை. தயவுசெய்து பின்னர் முயற்சிக்கவும். (Analysis unavailable)");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSceneChange = (scene: MovieScene) => {
    setSelectedScene(scene);
    setAiAnalysis(null);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const activeSub = getActiveSubtitle();

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* YouTube Style Header */}
      <header className="p-4 md:p-6 border-b border-white/5 bg-[#0f0f0f] flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#ff0000] rounded-xl flex items-center justify-center shadow-lg shadow-red-600/10">
            <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg md:text-xl font-black tracking-tight flex items-center gap-2">
              Cinema Studio 
              <span className="text-[10px] bg-red-600 px-1.5 py-0.5 rounded text-white font-black uppercase">LIVE</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Master English through Tamil hits</p>
          </div>
        </div>

        {(selectedStory || selectedScene) && (
          <button 
            onClick={() => selectedScene ? setSelectedScene(null) : setSelectedStory(null)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Go Back
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto bg-[#0a0a0a] scroll-smooth">
        {!selectedStory ? (
          /* Landing / Gallery */
          <div className="p-6 md:p-12 space-y-12 max-w-7xl mx-auto">
            <section>
              <h2 className="text-sm font-black text-red-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                <span className="w-8 h-px bg-red-500/30"></span>
                Featured Collections
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stories.map(story => (
                  <div 
                    key={story.id}
                    onClick={() => setSelectedStory(story)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:border-red-500/30">
                      <img src={story.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={story.title} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-8">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-2 py-0.5 bg-red-600 rounded text-[9px] font-black uppercase">ULTRA HD</span>
                          <span className="text-[10px] font-bold text-white/70 tracking-widest uppercase">{story.genre}</span>
                        </div>
                        <h3 className="text-3xl font-black text-white group-hover:text-red-500 transition-colors">{story.title}</h3>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-2">{story.parts.length} Lesson Modules</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-gradient-to-br from-[#111] to-[#0a0a0a] p-10 md:p-16 rounded-[4rem] border border-white/5 flex flex-col md:flex-row items-center gap-12">
               <div className="flex-1 space-y-8">
                 <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                 </div>
                 <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">Beyond Subtitles. <br/><span className="text-red-600">Pure Fluency.</span></h3>
                 <p className="text-white/40 text-lg md:text-xl leading-relaxed max-w-xl">
                   Learn English by living through the most iconic scenes of Tamil cinema. Our AI identifies cultural nuances and conversational styles that textbooks ignore.
                 </p>
                 <div className="flex flex-wrap gap-4">
                   <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300">Punch Dialogues</div>
                   <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300">Scene Analysis</div>
                   <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300">Dual Translation</div>
                 </div>
               </div>
               <div className="w-full md:w-80 h-80 bg-slate-900 rounded-[3rem] flex items-center justify-center border border-white/10 relative overflow-hidden group shadow-2xl">
                  <div className="absolute inset-0 bg-red-600/20 blur-[100px] group-hover:opacity-100 opacity-0 transition-all duration-1000"></div>
                  <div className="text-center relative z-10 space-y-4">
                     <div className="w-24 h-24 bg-red-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-red-600/20">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 12H9v-2h3v2zm0-4H9V9h3v2zm4 4h-3v-2h3v2zm0-4h-3V9h3v2z"/></svg>
                     </div>
                     <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Premium Learning</p>
                  </div>
               </div>
            </section>
          </div>
        ) : !selectedScene ? (
          /* Multi-Video Grid (Episode Picker) */
          <div className="p-6 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
             <div className="max-w-7xl mx-auto space-y-12">
                <div className="flex flex-col md:flex-row gap-12 items-center md:items-end">
                   <div className="w-full md:w-[450px] aspect-[16/9] rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(255,0,0,0.1)] border border-white/5">
                     <img src={selectedStory.coverImage} className="w-full h-full object-cover" alt={selectedStory.title} />
                   </div>
                   <div className="flex-1 text-center md:text-left space-y-4">
                      <div className="inline-block px-3 py-1 bg-red-600/10 border border-red-600/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-widest mb-2">Selected Anthology</div>
                      <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">{selectedStory.title}</h2>
                      <p className="text-white/40 text-lg font-medium">{selectedStory.genre} • High Proficiency Module</p>
                      <div className="flex items-center justify-center md:justify-start gap-10 pt-4">
                        <div className="text-center">
                          <p className="text-3xl font-black text-red-600">{selectedStory.rating}</p>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Difficulty</p>
                        </div>
                        <div className="w-px h-12 bg-white/10"></div>
                        <div className="text-center">
                          <p className="text-3xl font-black text-white">{selectedStory.parts.length}</p>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Episodes</p>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.5em] border-b border-white/5 pb-4">Select an Episode to Play</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {selectedStory.parts.map((part, idx) => (
                      <div 
                        key={part.id} 
                        onClick={() => setSelectedScene(part)}
                        className="group bg-[#111] p-6 rounded-[2.5rem] border border-white/5 hover:border-red-600/40 hover:bg-[#161616] transition-all cursor-pointer transform hover:-translate-y-2"
                      >
                        <div className="relative aspect-video rounded-3xl overflow-hidden mb-6 shadow-xl">
                          <img src={part.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={part.title} />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                              </div>
                          </div>
                          <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/80 backdrop-blur rounded text-[10px] font-bold">2:45</div>
                        </div>
                        <div className="flex gap-4">
                           <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center font-black text-white/20 text-sm">
                             {idx + 1}
                           </div>
                           <div className="flex-1">
                             <h4 className="font-black text-lg text-white mb-1 group-hover:text-red-500 transition-colors">{part.title}</h4>
                             <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{part.description}</p>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        ) : (
          /* YouTube Style Player + Multi-Video Sidebar */
          <div className="flex flex-col xl:flex-row h-full overflow-hidden bg-black animate-in fade-in duration-500">
            {/* Primary Video Player Area */}
            <div className="flex-1 flex flex-col relative group bg-black">
              <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                 <video 
                   ref={videoRef}
                   key={selectedScene.id}
                   src={selectedScene.videoUrl}
                   onTimeUpdate={handleTimeUpdate}
                   className="w-full max-h-full object-contain"
                   autoPlay
                   controls
                 />
                 
                 {/* Cinema Subtitles Overlay */}
                 <div className="absolute bottom-20 left-0 right-0 flex flex-col items-center pointer-events-none px-12 text-center">
                  {activeSub && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <p className="text-3xl md:text-5xl lg:text-6xl font-black text-white [text-shadow:_0_6px_20px_rgb(0_0_0_/_100%)] tracking-tight">
                        {activeSub.english}
                      </p>
                      <div className="flex items-center gap-6 justify-center">
                         <div className="h-0.5 w-16 bg-red-600/60 shadow-[0_0_10px_rgba(255,0,0,0.5)]"></div>
                         <p className="text-2xl md:text-3xl font-bold text-red-500 [text-shadow:_0_4px_12px_rgb(0_0_0_/_80%)]">
                           {activeSub.tamil}
                         </p>
                         <div className="h-0.5 w-16 bg-red-600/60 shadow-[0_0_10px_rgba(255,0,0,0.5)]"></div>
                      </div>
                    </div>
                  )}
                 </div>
              </div>

              {/* Video Info Header below video (like YouTube) */}
              <div className="p-6 md:p-8 bg-[#0f0f0f] border-t border-white/5 space-y-4">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                       <div className="flex items-center gap-3">
                         <span className="px-2 py-0.5 bg-red-600 text-[10px] font-black uppercase rounded">EPISODE {selectedStory.parts.findIndex(p => p.id === selectedScene.id) + 1}</span>
                         <h2 className="text-2xl md:text-3xl font-black">{selectedScene.title}</h2>
                       </div>
                       <p className="text-white/40 text-sm font-medium">{selectedScene.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <button 
                         onClick={analyzeScene}
                         className="flex-1 md:flex-none px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-3"
                       >
                         {isAnalyzing ? (
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                         ) : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M11.3 1.047a1 1 0 01.897.95c.23 2.61 2.293 4.674 4.903 4.903a1 1 0 01.95.897v5.405a1 1 0 01-.95.897c-2.61.23-4.674 2.293-4.903 4.903a1 1 0 01-.897.95h-5.405a1 1 0 01-.897-.95c-.23-2.61-2.293-4.674-4.903-4.903a1 1 0 01-.95-.897V8.797a1 1 0 01.95-.897c2.61-.23 4.674-2.293 4.903-4.903a1 1 0 01.897-.95h5.405zM10 11a1 1 0 100-2 1 1 0 000 2z"/></svg>}
                         AI Breakdown
                       </button>
                    </div>
                 </div>
              </div>
            </div>

            {/* Sidebar: Related Clips + Analysis */}
            <div className="w-full xl:w-[450px] bg-[#0f0f0f] border-l border-white/5 flex flex-col overflow-hidden shadow-2xl">
               {/* Analysis Result (if available) */}
               {aiAnalysis && (
                  <div className="p-6 border-b border-white/5 bg-[#161616] animate-in slide-in-from-right duration-500 max-h-[50%] overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.2em]">Context Analysis</h3>
                       <button onClick={() => setAiAnalysis(null)} className="text-white/20 hover:text-white transition-colors">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                       </button>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-slate-300 font-medium leading-relaxed bg-white/5 p-5 rounded-2xl border border-white/10">
                       {aiAnalysis}
                    </div>
                    <div className="mt-6 flex gap-2">
                       <button className="flex-1 py-3 bg-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all">Start Task</button>
                       <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Save Notes</button>
                    </div>
                  </div>
               )}

               {/* Multi-Video Related Clips Section */}
               <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">More from this Anthology</h3>
                  <div className="space-y-4">
                    {selectedStory.parts.map((part) => {
                      const isActive = selectedScene.id === part.id;
                      return (
                        <div 
                          key={part.id}
                          onClick={() => handleSceneChange(part)}
                          className={`flex gap-4 group cursor-pointer p-3 rounded-2xl transition-all ${isActive ? 'bg-red-600/10 border border-red-600/20' : 'hover:bg-white/5 border border-transparent'}`}
                        >
                          <div className="relative w-32 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
                            <img src={part.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={part.title} />
                            {isActive && (
                               <div className="absolute inset-0 bg-red-600/40 flex items-center justify-center">
                                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                    <div className="w-3 h-3 bg-red-600 animate-pulse rounded-sm"></div>
                                  </div>
                               </div>
                            )}
                            <div className="absolute bottom-1 right-1 px-1 bg-black/80 rounded text-[8px] font-bold">3:21</div>
                          </div>
                          <div className="flex-1 min-w-0 py-1">
                            <h4 className={`text-sm font-black truncate mb-1 ${isActive ? 'text-red-500' : 'text-white'}`}>{part.title}</h4>
                            <p className="text-[10px] text-white/40 font-medium line-clamp-2 leading-relaxed">{part.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
               </div>

               <div className="p-6 bg-[#0a0a0a] border-t border-white/5">
                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-white/20">
                    <span>STUDIO v3.1</span>
                    <span className="flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                       DYNAMIC FEED
                    </span>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MovieLearning;
