
import React, { useState } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { ReadingPassage, User, LearningMode } from '../types';
import { PersistenceService } from '../services/persistence';

interface ReadingLearningProps {
  user: User;
}

const ReadingLearning: React.FC<ReadingLearningProps> = ({ user }) => {
  const [passage, setPassage] = useState<ReadingPassage | null>(null);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const generatePassage = async () => {
    setLoading(true);
    setAnswers({});
    setShowResults(false);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a high-quality reading comprehension passage for a student at the ${user.englishLevel} level. 
        Focus on interesting tech or cultural topics. 
        Include 3 multiple-choice questions with one clear correct answer for each.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    answer: { type: Type.INTEGER }
                  },
                  required: ['question', 'options', 'answer']
                }
              }
            },
            required: ['title', 'content', 'difficulty', 'questions']
          }
        }
      });
      
      const result = JSON.parse(response.text);
      setPassage(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!passage) return;
    setShowResults(true);

    let correctCount = 0;
    passage.questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) correctCount++;
    });

    const score = Math.round((correctCount / passage.questions.length) * 100);

    await PersistenceService.saveActivity(
      user.id,
      LearningMode.READING,
      `Reading: ${passage.title}`,
      score,
      { title: passage.title, score, correctCount, total: passage.questions.length }
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 md:p-8 overflow-y-auto">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Reading Mastery</h2>
          <p className="text-slate-500 text-base md:text-lg">Content curated for {user.englishLevel} level.</p>
        </div>
        <button
          onClick={generatePassage}
          disabled={loading}
          className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
          {loading ? 'Curating...' : 'New Topic'}
        </button>
      </div>

      {!passage && !loading ? (
        <div className="flex-1 bg-white rounded-[2rem] border border-slate-200 flex flex-col items-center justify-center text-center p-8 md:p-12">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2">Immersion Reading</h3>
          <p className="text-slate-400 max-w-sm mb-8 text-sm md:text-base">Generate a high-fidelity tech topic to test your comprehension at the {user.englishLevel} level.</p>
        </div>
      ) : loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
           <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
           <p className="text-slate-600 font-black text-lg">Synthesizing material...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 pb-12">
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-200">
                  {passage?.difficulty}
                </span>
                <div className="h-px flex-1 bg-slate-50"></div>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 md:mb-10 leading-tight">{passage?.title}</h1>
              <div className="text-lg md:text-xl text-slate-700 leading-relaxed space-y-6 font-medium">
                {passage?.content.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Comprehension
            </h3>
            
            <div className="flex-1 space-y-10">
              {passage?.questions.map((q, qIndex) => (
                <div key={qIndex} className="space-y-4">
                  <p className="font-black text-slate-800 text-base leading-snug">{qIndex + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, oIndex) => {
                      const isSelected = answers[qIndex] === oIndex;
                      const isCorrect = q.answer === oIndex;
                      
                      let containerStyle = "border-slate-100 bg-slate-50 text-slate-600";
                      if (showResults) {
                        if (isCorrect) containerStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500 ring-opacity-20";
                        else if (isSelected && !isCorrect) containerStyle = "border-rose-500 bg-rose-50 text-rose-800";
                        else containerStyle = "border-slate-50 bg-slate-50 text-slate-300 opacity-60";
                      } else if (isSelected) {
                        containerStyle = "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-100";
                      }

                      return (
                        <button
                          key={oIndex}
                          disabled={showResults}
                          onClick={() => setAnswers(prev => ({ ...prev, [qIndex]: oIndex }))}
                          className={`w-full text-left p-4 rounded-xl border transition-all text-sm font-bold flex items-center gap-3 ${containerStyle}`}
                        >
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] ${isSelected && !showResults ? 'bg-white/20' : 'bg-slate-200/50'}`}>
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100">
               {!showResults ? (
                 <button
                   disabled={Object.keys(answers).length < (passage?.questions.length || 0)}
                   onClick={handleFinish}
                   className="w-full bg-slate-900 text-white py-4 md:py-5 rounded-2xl font-black text-lg hover:bg-black transition-all disabled:opacity-30"
                 >
                   Reveals Results
                 </button>
               ) : (
                 <button 
                  onClick={generatePassage} 
                  className="w-full bg-indigo-600 text-white py-4 md:py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                 >
                   Next Lesson
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadingLearning;
