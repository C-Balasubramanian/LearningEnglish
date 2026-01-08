
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { User, TranscriptionEntry, LearningMode } from '../types';

interface AIHelpProps {
  user: User;
  onStartCall?: () => void;
}

const AIHelp: React.FC<AIHelpProps> = ({ user, onStartCall }) => {
  const [messages, setMessages] = useState<TranscriptionEntry[]>([
    { role: 'model', text: `Hi ${user.name.split(' ')[0]}! I'm your personal English Tutor. How can I help you improve your ${user.englishLevel} level skills today?`, timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are a world-class English Language Assistant. Your goal is to help a student at the ${user.englishLevel} level. 
        Provide clear, encouraging, and accurate answers about grammar, vocabulary, idioms, and cultural context. 
        Always provide example sentences when explaining new words or rules.`,
      },
    });
  }, [user.englishLevel]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !chatRef.current || isTyping) return;

    const userMsg: TranscriptionEntry = { role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseStream = await chatRef.current.sendMessageStream({ message: text });
      let fullText = '';
      
      const assistantMsgId = Date.now();
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: assistantMsgId }]);

      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        fullText += c.text;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'model', text: fullText, timestamp: assistantMsgId };
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an error. Please try again.", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    "Explain 'Present Perfect'",
    "Synonyms for 'Beautiful'",
    "How to use 'Nevertheless'?",
    "Common office idioms"
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 md:p-8 border-b border-slate-200 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-3">
            <span className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </span>
            AI Assistant
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">24/7 personalized language tutoring for {user.englishLevel} level.</p>
        </div>
        
        {onStartCall && (
          <button 
            onClick={onStartCall}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Voice Call
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] md:max-w-[70%] rounded-[1.5rem] p-5 shadow-sm ${
                m.role === 'user' 
                  ? 'bg-slate-900 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}>
                <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{m.text || (isTyping && i === messages.length - 1 ? '...' : '')}</div>
                <p className={`text-[10px] mt-2 font-bold uppercase tracking-widest ${m.role === 'user' ? 'text-slate-400' : 'text-slate-400'}`}>
                  {m.role === 'user' ? 'You' : 'Assistant'} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && !messages[messages.length-1].text && (
             <div className="flex justify-start">
               <div className="bg-white border border-slate-200 rounded-[1.5rem] px-5 py-4 flex gap-1">
                 <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                 <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                 <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
             </div>
          )}
        </div>

        <div className="p-4 md:p-8 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-2">
              {quickActions.map(action => (
                <button
                  key={action}
                  onClick={() => sendMessage(action)}
                  className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 rounded-full text-xs font-bold transition-all whitespace-nowrap"
                >
                  {action}
                </button>
              ))}
            </div>

            <form 
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="relative flex items-center gap-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about English..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-medium"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-indigo-600 text-white p-4 rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-30 active:scale-95 flex-shrink-0"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIHelp;
