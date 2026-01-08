
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { WritingFeedback, User, LearningMode, Correction } from '../types';
import { PersistenceService } from '../services/persistence';

interface WritingLearningProps {
  user: User;
}

const WritingLearning: React.FC<WritingLearningProps> = ({ user }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);

  const analyzeWriting = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as an expert English linguistics professor. Analyze the following text for errors and provide a technical breakdown of improvements. 
        Text: "${text}"`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              original: { type: Type.STRING },
              corrected: { type: Type.STRING },
              explanation: { type: Type.STRING },
              score: { type: Type.NUMBER },
              corrections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    originalPart: { type: Type.STRING },
                    correctedPart: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    category: { type: Type.STRING, enum: ['Grammar', 'Spelling', 'Style', 'Punctuation', 'Vocabulary'] }
                  },
                  required: ['originalPart', 'correctedPart', 'reason', 'category']
                }
              }
            },
            required: ['original', 'corrected', 'explanation', 'score', 'corrections']
          }
        }
      });
      
      const result: WritingFeedback = JSON.parse(response.text);
      setFeedback(result);

      PersistenceService.saveActivity(
        user.id,
        LearningMode.WRITING,
        `Writing Practice (${user.englishLevel})`,
        result.score,
        result
      );

    } catch (err) {
      console.error("Analysis Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Grammar': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Spelling': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Style': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Vocabulary': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 p-4 md:p-8">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Writing Workshop</h2>
          <p className="text-slate-500 text-base md:text-lg">Improve your prose with technical feedback.</p>
        </div>
        {feedback && (
          <button 
            onClick={() => {setFeedback(null); setText('');}}
            className="text-indigo-600 font-bold hover:underline flex items-center gap-1 self-start"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Session
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 flex-1">
        {/* Editor Side */}
        <div className={`bg-white rounded-[2rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden transition-all duration-500 ${feedback ? 'hidden xl:flex' : 'flex min-h-[400px]'}`}>
          <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2 text-slate-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              <span className="text-xs font-black uppercase tracking-wider">Composition</span>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{text.split(/\s+/).filter(x => x).length} words</span>
          </div>
          <textarea
            className="flex-1 p-6 md:p-8 resize-none focus:outline-none text-slate-800 leading-relaxed text-lg md:text-xl font-medium placeholder:text-slate-300"
            placeholder="Start writing to receive expert feedback..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading || !!feedback}
          />
          {!feedback && (
            <div className="p-6 border-t border-slate-100 bg-white">
              <button
                onClick={analyzeWriting}
                disabled={!text.trim() || loading}
                className={`w-full py-4 md:py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${
                  !text.trim() || loading 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : 'Analyze Writing'}
              </button>
            </div>
          )}
        </div>

        {/* Feedback Side */}
        <div className={`flex flex-col gap-6 md:gap-8 ${feedback ? 'flex' : 'hidden xl:flex'}`}>
          {feedback ? (
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
              {/* Mobile View Correction */}
              <button 
                onClick={() => {setFeedback(null); setText('');}}
                className="xl:hidden w-full py-3 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-2xl text-sm"
              >
                ← Back to Editor
              </button>

              {/* Score and Summary Card */}
              <div className="bg-white rounded-[2rem] border border-slate-200 p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Summary</h3>
                    <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">Linguistic Proficiency</p>
                  </div>
                  <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                      <circle 
                        cx="50%" cy="50%" r="40%" stroke="currentColor" strokeWidth="6" fill="transparent" 
                        strokeDasharray="251.2" 
                        strokeDashoffset={251.2 - (251.2 * feedback.score) / 100} 
                        className={`${feedback.score > 80 ? 'text-emerald-500' : 'text-indigo-600'} transition-all duration-1000 ease-out`}
                      />
                    </svg>
                    <span className="absolute text-lg md:text-xl font-black text-slate-800">{feedback.score}</span>
                  </div>
                </div>
                
                <div className="p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-slate-700 leading-relaxed italic text-sm md:text-base">"{feedback.explanation}"</p>
                </div>
              </div>

              {/* Improved Version */}
              <div className="bg-white rounded-[2rem] border border-slate-200 p-6 md:p-8 shadow-sm">
                 <h3 className="text-base md:text-lg font-black text-slate-900 mb-4 md:mb-6 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                   Polished Prose
                 </h3>
                 <div className="p-5 md:p-6 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-slate-800 text-base md:text-lg leading-relaxed font-medium">
                   {feedback.corrected}
                 </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Mistake Mapping</h3>
                {feedback.corrections.map((corr, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm hover:border-indigo-300 transition-colors">
                    <div className="flex flex-col gap-3">
                       <div className="flex items-center gap-3">
                         <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border ${getCategoryColor(corr.category)}`}>
                           {corr.category}
                         </span>
                       </div>
                       <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-800">
                         <span className="line-through text-rose-400 font-bold text-sm md:text-base">{corr.originalPart}</span>
                         <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                         <span className="text-emerald-600 font-black text-sm md:text-base">{corr.correctedPart}</span>
                       </div>
                       <div className="pt-3 border-t border-slate-50">
                        <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed">
                          <span className="font-black text-slate-700 uppercase tracking-tighter mr-1">Rule:</span> {corr.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-dashed border-slate-200 flex-1 flex flex-col items-center justify-center p-12 text-center h-full">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                 <svg className="w-10 h-10 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v3m2 4l-2 2m0 0l-2-2m2 2v-5m1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
               </div>
               <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">Awaiting Analysis</h3>
               <p className="text-slate-300 mt-2 max-w-xs text-xs font-bold leading-relaxed">Submit your writing above to see a word-by-word technical breakdown of improvements.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WritingLearning;
