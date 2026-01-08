
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { User, LearningMode } from '../types';
import { PersistenceService } from '../services/persistence';

interface TranslatorProps {
  user: User;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'Tamil' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'it', name: 'Italian' }
];

const Translator: React.FC<TranslatorProps> = ({ user }) => {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ta');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim() || isTranslating) return;
    setIsTranslating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const fromLang = languages.find(l => l.code === sourceLang)?.name;
      const toLang = languages.find(l => l.code === targetLang)?.name;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate the following text from ${fromLang} to ${toLang}. Only return the translated text without any explanation or quotes.
        
        Text: "${inputText}"`,
      });

      const result = response.text || '';
      setTranslatedText(result.trim());

      PersistenceService.saveActivity(
        user.id,
        LearningMode.TRANSLATOR,
        `Translation: ${fromLang} to ${toLang}`,
        undefined,
        { sourceLang, targetLang, input: inputText, output: result }
      );
    } catch (err) {
      console.error("Translation Error:", err);
      setTranslatedText("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(translatedText);
    setTranslatedText('');
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Smart Translator</h1>
        <p className="text-slate-500 font-medium">Break language barriers with AI-powered precision.</p>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Source Column */}
        <div className="flex-1 p-6 md:p-8 space-y-4 border-b md:border-b-0 md:border-r border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <select 
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Input</span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste text to translate..."
            className="w-full h-48 md:h-64 bg-transparent resize-none focus:outline-none text-slate-800 text-lg md:text-xl font-medium placeholder:text-slate-300 leading-relaxed"
          />
        </div>

        {/* Swap Control - Desktop middle absolute / Mobile center */}
        <div className="relative flex items-center justify-center md:w-0">
          <button 
            onClick={swapLanguages}
            className="md:absolute z-10 w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shadow-lg active:scale-95"
          >
            <svg className="w-6 h-6 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>

        {/* Target Column */}
        <div className="flex-1 p-6 md:p-8 space-y-4 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2">
            <select 
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-white border border-slate-200 text-slate-900 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Output</span>
          </div>
          <div className="w-full h-48 md:h-64 text-slate-800 text-lg md:text-xl font-bold leading-relaxed overflow-y-auto custom-scrollbar">
            {isTranslating ? (
              <div className="flex flex-col gap-2 mt-2">
                <div className="h-4 bg-slate-200 rounded-full w-full animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded-full w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded-full w-1/2 animate-pulse"></div>
              </div>
            ) : translatedText || (
              <span className="text-slate-300 font-medium italic">Translation will appear here...</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={handleTranslate}
          disabled={!inputText.trim() || isTranslating}
          className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 flex items-center gap-4"
        >
          {isTranslating ? (
            <>
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              Processing...
            </>
          ) : (
            <>
              Translate Now
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Translator;
