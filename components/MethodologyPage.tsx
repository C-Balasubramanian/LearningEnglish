
import React from 'react';

interface MethodologyPageProps {
  onBack: () => void;
  onGetStarted: () => void;
}

const MethodologyPage: React.FC<MethodologyPageProps> = ({ onBack, onGetStarted }) => {
  const steps = [
    {
      id: '01',
      title: 'Multimodal Input',
      subtitle: 'The Intake Phase',
      desc: 'Humans learn best through immersion. Our AI curates high-fidelity reading and listening materials tailored to your specific proficiency (CEFR aligned).',
      tech: 'Powered by Star AI Pro Reasoning'
    },
    {
      id: '02',
      title: 'Active Interaction',
      subtitle: 'The Engagement Phase',
      desc: 'Real-time voice sessions simulate natural human conversation. This triggers the brain\'s language acquisition center through high-frequency neural feedback.',
      tech: 'Gemini Live Native Audio Engine'
    },
    {
      id: '03',
      title: 'Analytical Deconstruction',
      subtitle: 'The Feedback Phase',
      desc: 'Every word spoken or written is analyzed against a multi-billion parameter linguistic model to identify subtle tonal and grammatical nuances.',
      tech: 'Star AI Flash Analytical Logic'
    },
    {
      id: '04',
      title: 'Iterative Synthesis',
      subtitle: 'The Growth Phase',
      desc: 'The platform identifies your "Linguistic Blindspots" and automatically adjusts future content to bridge those specific gaps in knowledge.',
      tech: 'Adaptive Context Window Management'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 animate-in fade-in duration-700">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group">
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          <div className="flex items-center gap-3">
             <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Scientific Methodology</span>
             <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-24">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-8">
              The Science of <span className="text-indigo-600">Fluency</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
              How Star AI mirrors the natural human language acquisition process using world-class neural reasoning.
            </p>
          </div>

          {/* Diagram Section */}
          <div className="relative mb-32 p-12 bg-slate-50 rounded-[4rem] border border-slate-100 overflow-hidden">
             <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px]"></div>
             </div>
             
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <div className="inline-flex px-4 py-2 bg-indigo-100 text-indigo-700 rounded-2xl text-xs font-black uppercase tracking-widest">The Feedback Loop</div>
                   <h2 className="text-3xl font-black text-slate-900 leading-tight">Closing the gap between knowledge and speech.</h2>
                   <p className="text-slate-600 leading-relaxed font-medium">
                     Unlike traditional learning methods that rely on passive consumption, Star AI creates a high-velocity feedback loop. We focus on the "Second Language Acquisition" theory where comprehensible input and output are equally vital.
                   </p>
                </div>
                <div className="flex items-center justify-center">
                   <div className="relative w-64 h-64">
                      <div className="absolute inset-0 border-4 border-dashed border-indigo-200 rounded-full animate-[spin_20s_linear_infinite]"></div>
                      <div className="absolute inset-4 border-4 border-indigo-600/20 rounded-full"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200">
                            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Deep Dive Steps */}
          <div className="space-y-32">
            {steps.map((step, idx) => (
              <div key={idx} className="group">
                <div className="flex flex-col md:flex-row gap-12 items-start">
                   <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-slate-900 text-white flex items-center justify-center text-3xl font-black rounded-3xl shadow-xl">
                        {step.id}
                      </div>
                   </div>
                   <div className="space-y-4">
                      <span className="text-xs font-black uppercase tracking-[0.4em] text-indigo-600">{step.subtitle}</span>
                      <h3 className="text-4xl font-black text-slate-900">{step.title}</h3>
                      <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-2xl">
                        {step.desc}
                      </p>
                      <div className="pt-4 flex items-center gap-2">
                        <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{step.tech}</span>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Footer */}
          <div className="mt-40 text-center p-16 bg-slate-900 rounded-[4rem] text-white">
             <h2 className="text-4xl font-black mb-6">Ready to Experience the Method?</h2>
             <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto font-medium">
               Fluency isn't about how much you know, it's about how much you can use. Start your first session today.
             </p>
             <button 
               onClick={onGetStarted}
               className="px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-black text-lg uppercase tracking-widest transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
             >
               Begin Learning Cycle
             </button>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="py-12 border-t border-slate-100 flex justify-center">
         <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Star AI Scientific Framework v1.0 • Star AI Engine</p>
      </footer>
    </div>
  );
};

export default MethodologyPage;
