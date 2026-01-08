
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GeminiBlob } from '@google/genai';
import { decode, encode, decodeAudioData } from '../services/audioUtils';
import { TranscriptionEntry, User, LearningMode } from '../types';
import { PersistenceService } from '../services/persistence';

interface VoiceLearningProps {
  user: User;
}

const VoiceLearning: React.FC<VoiceLearningProps> = ({ user }) => {
  const [isActive, setIsActive] = useState(false);
  const [transcriptions, setTranscriptions] = useState<TranscriptionEntry[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  
  const audioContextInputRef = useRef<AudioContext | null>(null);
  const audioContextOutputRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const transcriptionBufferRef = useRef({ user: '', model: '' });
  const timerIntervalRef = useRef<number | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const stopSession = useCallback(() => {
    if (transcriptions.length > 0) {
      PersistenceService.saveActivity(
        user.id, 
        LearningMode.SPEAKING, 
        `AI Call: ${user.englishLevel} Session`,
        undefined,
        { transcriptions, duration: callDuration }
      );
    }

    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (audioContextInputRef.current) {
      audioContextInputRef.current.close();
      audioContextInputRef.current = null;
    }
    if (audioContextOutputRef.current) {
      audioContextOutputRef.current.close();
      audioContextOutputRef.current = null;
    }

    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) {}
    });
    activeSourcesRef.current.clear();
    
    setIsActive(false);
    setIsConnecting(false);
    setCallDuration(0);
  }, [transcriptions, user.id, user.englishLevel, callDuration]);

  const startSession = async () => {
    if (isConnecting || isActive) return;
    setIsConnecting(true);
    setTranscriptions([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextInputRef.current = inputCtx;
      audioContextOutputRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { 
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } 
          },
          systemInstruction: `You are Zephyr, a world-class AI English tutor. You are on a phone call with ${user.name}, who is at the ${user.englishLevel} level. 
          Respond verbally, naturally, and warmly. Keep responses concise for the call format. Correct mistakes gently. 
          Start by saying: "Hi ${user.name.split(' ')[0]}, Zephyr here! I'm ready for our call. What's on your mind today?"`,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            setCallDuration(0);
            timerIntervalRef.current = window.setInterval(() => {
              setCallDuration(prev => prev + 1);
            }, 1000);

            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              if (isMuted) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob: GeminiBlob = { 
                data: encode(new Uint8Array(int16.buffer)), 
                mimeType: 'audio/pcm;rate=16000' 
              };
              sessionPromise.then((session) => { 
                session.sendRealtimeInput({ media: pcmBlob }); 
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              transcriptionBufferRef.current.user += message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.outputTranscription) {
              transcriptionBufferRef.current.model += message.serverContent.outputTranscription.text;
            }
            
            if (message.serverContent?.turnComplete) {
              const uText = transcriptionBufferRef.current.user;
              const mText = transcriptionBufferRef.current.model;
              if (uText) setTranscriptions(prev => [...prev, { role: 'user', text: uText, timestamp: Date.now() }]);
              if (mText) setTranscriptions(prev => [...prev, { role: 'model', text: mText, timestamp: Date.now() }]);
              transcriptionBufferRef.current = { user: '', model: '' };
            }

            if (message.serverContent?.interrupted) {
              activeSourcesRef.current.forEach(s => { try { s.stop(); } catch(e) {} });
              activeSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextOutputRef.current) {
              const outCtx = audioContextOutputRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
              const source = outCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outCtx.destination);
              
              source.addEventListener('ended', () => {
                activeSourcesRef.current.delete(source);
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              activeSourcesRef.current.add(source);
            }
          },
          onerror: (e) => {
            console.error("Call Error:", e);
            stopSession();
          },
          onclose: () => stopSession(),
        },
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("Connection Failed:", err);
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (sessionRef.current) sessionRef.current.close();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative">
      {/* Background Decor - Dynamic gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] transition-all duration-1000 ${isActive ? 'opacity-40 scale-110' : 'opacity-10 scale-100'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] transition-all duration-1000 ${isActive ? 'opacity-40 scale-110' : 'opacity-10 scale-100'}`}></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {!isActive && !isConnecting ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="w-48 h-48 bg-slate-900 rounded-[3rem] border border-white/5 flex items-center justify-center shadow-2xl">
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Zephyr" alt="Zephyr" className="w-32 h-32 opacity-80" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white tracking-tight">AI Call with Zephyr</h2>
              <p className="text-white/40 max-w-sm mx-auto text-lg font-medium leading-relaxed">
                Connect for a real-time voice conversation to boost your fluency at the {user.englishLevel} level.
              </p>
            </div>
            <button
              onClick={startSession}
              className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 flex items-center gap-4"
            >
              Start Call
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.505 5.505l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
            </button>
          </div>
        ) : isConnecting ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-12">
            <div className="relative">
              <div className="w-40 h-40 bg-slate-900 rounded-full flex items-center justify-center animate-pulse border-4 border-indigo-500/20">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Zephyr" alt="Zephyr" className="w-24 h-24 opacity-40" />
              </div>
              <div className="absolute inset-[-10px] border-2 border-indigo-500/50 rounded-full animate-[ping_2s_infinite]"></div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Calling Zephyr...</h3>
              <p className="text-white/20 font-bold">Establishing secure audio link</p>
            </div>
            <button onClick={stopSession} className="px-8 py-4 bg-rose-600/10 text-rose-500 border border-rose-500/20 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-600 hover:text-white transition-all">Cancel Call</button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row h-full">
            {/* Call Screen */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
              <div className="mb-8 flex flex-col items-center">
                <span className="text-emerald-500 font-mono font-bold text-xl mb-1 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {formatTime(callDuration)}
                </span>
                <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px]">Connected to Zephyr</p>
              </div>

              <div className="relative mb-16">
                <div className="absolute inset-[-40px] border border-indigo-500/20 rounded-full animate-pulse"></div>
                <div className="absolute inset-[-80px] border border-indigo-500/10 rounded-full animate-pulse [animation-delay:0.5s]"></div>
                <div className="w-56 h-56 md:w-72 md:h-72 bg-slate-900 rounded-full flex items-center justify-center border-8 border-white/5 shadow-[0_0_100px_rgba(79,70,229,0.2)] overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Zephyr" alt="Zephyr" className="w-3/4 h-3/4 opacity-90" />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${isMuted ? 'bg-rose-600 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/10'}`}
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMuted ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    )}
                  </svg>
                </button>
                <button 
                  onClick={stopSession}
                  className="w-24 h-24 rounded-[2.5rem] bg-rose-600 flex items-center justify-center text-white shadow-2xl shadow-rose-600/40 hover:bg-rose-500 transition-all active:scale-95"
                >
                  <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.505 5.505l.773-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                </button>
                <button 
                  onClick={() => setShowTranscript(!showTranscript)}
                  className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all ${showTranscript ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/10'}`}
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Transcript Overlay/Panel */}
            {showTranscript && (
              <div className="w-full md:w-[400px] bg-slate-900/80 backdrop-blur-3xl border-l border-white/5 flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400">Live Transcript</h4>
                  <button onClick={() => setShowTranscript(false)} className="text-white/40 hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {transcriptions.map((t, i) => (
                    <div key={i} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] rounded-2xl p-4 text-sm leading-relaxed ${
                        t.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white/5 text-white/80 border border-white/10 rounded-bl-none'
                      }`}>
                        <p className="font-black text-[9px] uppercase tracking-tighter mb-1 opacity-50">
                          {t.role === 'user' ? 'You' : 'Zephyr'}
                        </p>
                        {t.text}
                      </div>
                    </div>
                  ))}
                  {transcriptions.length === 0 && (
                    <div className="h-full flex items-center justify-center text-center px-8 text-white/20 font-black text-xs uppercase tracking-[0.2em]">
                      Transcription will appear as you speak
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <footer className="relative z-10 p-6 flex justify-center border-t border-white/5 bg-slate-950/40">
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Propelled by Linguist AI • Gemini Real-time Engine</p>
      </footer>
    </div>
  );
};

export default VoiceLearning;
