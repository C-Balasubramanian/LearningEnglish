
// import React, { useState } from 'react';
// import { User } from '../types';

// interface LandingPageProps {
//   onGetStarted: () => void;
//   onLogin: () => void;
//   onMethodology: () => void;
//   onLogout?: () => void;
//   onNavigateToDashboard?: () => void;
//   user?: User;
// }

// const LandingPage: React.FC<LandingPageProps> = ({ 
//   onGetStarted, 
//   onLogin, 
//   onMethodology, 
//   onLogout, 
//   onNavigateToDashboard, 
//   user 
// }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [email, setEmail] = useState('');

//   const features = [
//     {
//       title: 'AI Speaking Calls',
//       desc: 'Engage in natural, low-latency voice conversations. Gemini listens and responds in real-time to build your speaking confidence.',
//       icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
//       color: 'indigo'
//     },
//     {
//       title: 'Writing Workshop',
//       desc: 'Submit essays or casual messages. Receive a granular breakdown of grammar, tone, and vocabulary improvements instantly.',
//       icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
//       color: 'amber'
//     },
//     {
//       title: 'Adaptive Reading',
//       desc: 'Articles and stories that evolve with your progress. Comprehension quizzes test your understanding of complex nuances.',
//       icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253',
//       color: 'emerald'
//     },
//     {
//       title: 'Interactive Cinema',
//       desc: 'Learn through context with movie scenes. Dual-language subtitles and AI scene analysis help you master conversational idioms.',
//       icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
//       color: 'purple'
//     }
//   ];

//   const stats = [
//     { label: 'Active Learners', value: '12k+', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
//     { label: 'AI AI Tutors', value: '50+', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
//     { label: 'Satisfaction', value: '98%', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.482-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
//     { label: 'Learning Support', value: '24/7', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
//   ];

//   const scrollToSection = (id: string) => {
//     const element = document.getElementById(id);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 scroll-smooth">
//       {/* Navigation */}
//       <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 h-16 md:h-20">
//         <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
//           <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
//             <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
//               <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
//               </svg>
//             </div>
//             <span className="text-lg md:text-xl font-black tracking-tight">Star AI</span>
//           </div>
          
//           <div className="flex items-center gap-3 md:gap-8">
//             <div className="hidden lg:flex items-center gap-8">
//               <button onClick={() => scrollToSection('features')} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Features</button>
//               <button onClick={onMethodology} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Methodology</button>
//             </div>
            
//             {user ? (
//               <div className="relative">
//                 <button 
//                   onClick={() => setShowDropdown(!showDropdown)}
//                   className="flex items-center gap-2 md:gap-3 pl-1.5 pr-3 md:pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl hover:border-indigo-600 transition-all"
//                 >
//                   <img src={user.avatar} className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl" alt={user.name} />
//                   <span className="text-xs md:text-sm font-black text-slate-900 hidden sm:inline">{user.name.split(' ')[0]}</span>
//                   <svg className={`w-3 h-3 md:w-4 md:h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>
                
//                 {showDropdown && (
//                   <div className="absolute top-full right-0 mt-2 w-48 md:w-56 bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
//                     <button 
//                       onClick={onNavigateToDashboard}
//                       className="w-full flex items-center gap-3 px-4 py-3 text-xs md:text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all"
//                     >
//                       <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
//                       Dashboard
//                     </button>
//                     <div className="h-px bg-slate-50 my-1 mx-2"></div>
//                     <button 
//                       onClick={onLogout}
//                       className="w-full flex items-center gap-3 px-4 py-3 text-xs md:text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all"
//                     >
//                       <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m-4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
//                       Sign Out
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center gap-2">
//                 <button 
//                   onClick={onLogin}
//                   className="px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl border border-slate-200 text-[10px] md:text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
//                 >
//                   Login
//                 </button>
//                 <button 
//                   onClick={onGetStarted}
//                   className="px-4 md:px-6 py-2 md:py-2.5 bg-indigo-600 text-white rounded-lg md:rounded-xl text-[10px] md:text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
//                 >
//                   Join
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="pt-32 md:pt-48 pb-16 md:pb-24 px-4 md:px-6 relative overflow-hidden">
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
//           <div className="absolute top-20 left-10 w-64 md:w-96 h-64 md:h-96 bg-indigo-50 rounded-full blur-[80px] md:blur-[120px]"></div>
//           <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-purple-50 rounded-full blur-[80px] md:blur-[120px]"></div>
//         </div>

//         <div className="max-w-5xl mx-auto text-center relative z-10">
//           <div className="inline-flex items-center gap-2 px-4 py-1.5 md:py-2 bg-indigo-50 rounded-full mb-6 md:mb-8">
//             <span className="flex h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-indigo-600 animate-pulse"></span>
//             <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-indigo-600 whitespace-nowrap">Powered by Star AI</span>
//           </div>
//           <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter mb-6 md:mb-10 leading-[1.1] md:leading-[0.9]">
//             Master English with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Real-Time AI</span>
//           </h1>
//           <p className="text-base md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed mb-8 md:mb-14 px-4">
//             The first language platform that actually listens, speaks, and learns with you. 
//             Personalized lessons powered by the world's most advanced AI.
//           </p>
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
//             <button 
//               onClick={user ? onNavigateToDashboard : onGetStarted}
//               className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-slate-900 text-white rounded-xl md:rounded-[2rem] text-sm md:text-lg font-black uppercase tracking-widest shadow-2xl hover:bg-black transition-all transform hover:-translate-y-1"
//             >
//               {user ? 'Enter Dashboard' : 'Start Free Trial'}
//             </button>
//             {!user && (
//               <button 
//                 onClick={onLogin}
//                 className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-white border border-slate-200 text-slate-900 rounded-xl md:rounded-[2rem] text-sm md:text-lg font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
//               >
//                 Login to Portal
//               </button>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Features Grid */}
//       <section id="features" className="py-16 md:py-32 bg-slate-50 px-4 md:px-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-12 md:mb-24">
//             <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">A Holistic Approach to Fluency</h2>
//             <p className="text-slate-500 font-medium text-sm md:text-base">Four core pillars of learning integrated into one seamless platform.</p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
//             {features.map((f, i) => (
//               <div 
//                 key={i} 
//                 className="group bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-default"
//               >
//                 <div className={`w-12 h-12 md:w-16 md:h-16 bg-${f.color}-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-10 shadow-lg shadow-${f.color}-100 text-white`}>
//                   <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={f.icon} />
//                   </svg>
//                 </div>
//                 <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-5">{f.title}</h3>
//                 <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">{f.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Redesigned Stats Section */}
//       <section className="py-20 md:py-40 bg-white relative overflow-hidden border-t border-slate-100 px-4 md:px-6">
//         <div className="max-w-7xl mx-auto relative z-10">
//           <div className="text-center mb-12 md:mb-24 px-4">
//             <h2 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
//               Trusted by Thousands of <br className="hidden md:block" /><span className="text-indigo-600">Future Polyglots</span>
//             </h2>
//             <div className="w-16 md:w-24 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
//           </div>

//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
//             {stats.map((stat, i) => (
//               <div 
//                 key={i} 
//                 className="group relative p-6 md:p-10 rounded-[1.5rem] md:rounded-[3rem] bg-white border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.15)] transition-all duration-500 hover:-translate-y-1 md:hover:-translate-y-3"
//               >
//                 <div className="flex flex-col items-center text-center">
//                   <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 md:mb-8 group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-500">
//                     <svg className="w-6 h-6 md:w-10 md:h-10 text-indigo-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
//                     </svg>
//                   </div>
//                   <p className="text-3xl md:text-6xl font-black text-slate-900 mb-1 md:mb-3 tracking-tighter group-hover:text-indigo-600 transition-colors">
//                     {stat.value}
//                   </p>
//                   <p className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.3em] group-hover:text-indigo-400 transition-colors">
//                     {stat.label}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Premium Redesigned Dark Footer */}
//       <footer className="bg-slate-950 text-white pt-16 md:pt-32 pb-12 px-4 md:px-6 relative overflow-hidden">
//         {/* Subtle Background Accent */}
//         <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -mr-40 -mt-40"></div>

//         <div className="max-w-7xl mx-auto relative z-10">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 md:mb-24">
//             {/* Brand Column */}
//             <div className="space-y-6 md:space-y-8">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
//                   <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
//                   </svg>
//                 </div>
//                 <span className="text-xl font-black tracking-tight">Star AI</span>
//               </div>
//               <p className="text-slate-400 font-medium leading-relaxed text-sm max-w-xs">
//                 Empowering individuals to master global communication through advanced multimodal AI reasoning and real-time feedback loops.
//               </p>
//               <div className="flex gap-4">
//                 {[
//                   { name: 'X', path: 'M2.048 2.048l7.636 10.871L2.048 21.952h1.718l6.685-7.662L15.939 21.952h5.842l-8.118-11.558L21.293 2.048h-1.718l-6.223 7.132L5.438 2.048H2.048z' },
//                   { name: 'LinkedIn', path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
//                   { name: 'YouTube', path: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 6.816-.029 4.185.426 6.549 4.385 6.816 3.6.246 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-6.816.029-4.185-.426-6.549-4.385-6.816zm-10.615 10.816v-8l7 4-7 4z' }
//                 ].map((social, i) => (
//                   <button key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500 transition-all group">
//                     <svg className="w-4 h-4 text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
//                       <path d={social.path} />
//                     </svg>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Product Column */}
//             <div className="space-y-4 md:space-y-6">
//               <h4 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Products</h4>
//               <ul className="space-y-3 md:space-y-4">
//                 <li><button onClick={() => scrollToSection('features')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Speaking Studio</button></li>
//                 <li><button onClick={() => scrollToSection('features')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Writing Workshop</button></li>
//                 <li><button onClick={onMethodology} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Scientific Method</button></li>
//                 <li><button onClick={onGetStarted} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Free Proficiency Test</button></li>
//               </ul>
//             </div>

//             {/* Resources Column */}
//             <div className="space-y-4 md:space-y-6">
//               <h4 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Resources</h4>
//               <ul className="space-y-3 md:space-y-4">
//                 <li><button className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Documentation</button></li>
//                 <li><button className="text-sm font-bold text-slate-400 hover:text-white transition-colors">API Status</button></li>
//                 <li><button className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Privacy Policy</button></li>
//                 <li><button className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Terms of Service</button></li>
//               </ul>
//             </div>

//             {/* Newsletter Column */}
//             <div className="space-y-4 md:space-y-6">
//               <h4 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Join the Circle</h4>
//               <p className="text-slate-400 text-sm font-medium">Get early access to new AI tutors and learning modules.</p>
//               <div className="relative group">
//                 <input 
//                   type="email" 
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="name@email.com" 
//                   className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
//                 />
//                 <button className="absolute right-2 top-2 bottom-2 bg-indigo-600 px-4 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
//                   Join
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Bottom Bar */}
//           <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
//             <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
//               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">© 2024 Star AI Global • All Rights Reserved</p>
//               <div className="flex gap-4">
//                 <button className="text-[9px] font-black text-slate-700 hover:text-white uppercase tracking-widest transition-colors">System Status</button>
//                 <button className="text-[9px] font-black text-slate-700 hover:text-white uppercase tracking-widest transition-colors">Cookies</button>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <span className="text-[9px] font-black text-slate-800 uppercase tracking-[0.4em] hidden sm:inline">Propelled by</span>
//               <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
//                 <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
//                 <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Star AI Live Engine</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;


import React, { useState } from 'react';
import { User } from '../types';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onMethodology: () => void;
  onLogout?: () => void;
  onNavigateToDashboard?: () => void;
  user?: User;
}

const LandingPage: React.FC<LandingPageProps> = ({ 
  onGetStarted, 
  onLogin, 
  onMethodology, 
  onLogout, 
  onNavigateToDashboard, 
  user 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [email, setEmail] = useState('');

  const features = [
    {
      title: 'AI Speaking Calls',
      desc: 'Engage in natural, low-latency voice conversations. Gemini listens and responds in real-time to build your speaking confidence.',
      icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
      color: 'indigo'
    },
    {
      title: 'Writing Workshop',
      desc: 'Submit essays or casual messages. Receive a granular breakdown of grammar, tone, and vocabulary improvements instantly.',
      icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      color: 'amber'
    },
    {
      title: 'Adaptive Reading',
      desc: 'Articles and stories that evolve with your progress. Comprehension quizzes test your understanding of complex nuances.',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253',
      color: 'emerald'
    },
    {
      title: 'Interactive Cinema',
      desc: 'Learn through context with movie scenes. Dual-language subtitles and AI scene analysis help you master conversational idioms.',
      icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      color: 'purple'
    }
  ];

  const stats = [
    { label: 'Active Learners', value: '12k+', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { label: 'AI AI Tutors', value: '50+', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { label: 'Satisfaction', value: '98%', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.482-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
    { label: 'Learning Support', value: '24/7', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 scroll-smooth">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 h-16 md:h-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 text-white">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <span className="text-lg md:text-xl font-black tracking-tight">Star AI</span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-8">
            <div className="hidden lg:flex items-center gap-8">
              <button onClick={() => scrollToSection('features')} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Features</button>
              <button onClick={onMethodology} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Methodology</button>
            </div>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 md:gap-3 pl-1.5 pr-3 md:pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl hover:border-indigo-600 transition-all"
                >
                  <img src={user.avatar} className="w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl" alt={user.name} />
                  <span className="text-xs md:text-sm font-black text-slate-900 hidden sm:inline">{user.name.split(' ')[0]}</span>
                  <svg className={`w-3 h-3 md:w-4 md:h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 md:w-56 bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button 
                      onClick={onNavigateToDashboard}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs md:text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                      Dashboard
                    </button>
                    <div className="h-px bg-slate-50 my-1 mx-2"></div>
                    <button 
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs md:text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m-4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={onLogin}
                  className="px-4 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl border border-slate-200 text-[10px] md:text-sm font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Login
                </button>
                <button 
                  onClick={onGetStarted}
                  className="px-4 md:px-6 py-2 md:py-2.5 bg-indigo-600 text-white rounded-lg md:rounded-xl text-[10px] md:text-sm font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Join
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 md:pt-48 pb-16 md:pb-24 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-20 left-10 w-64 md:w-96 h-64 md:h-96 bg-indigo-50 rounded-full blur-[80px] md:blur-[120px]"></div>
          <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-purple-50 rounded-full blur-[80px] md:blur-[120px]"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 md:py-2 bg-indigo-50 rounded-full mb-6 md:mb-8">
            <span className="flex h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-indigo-600 whitespace-nowrap">Powered by Star AI</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter mb-6 md:mb-10 leading-[1.1] md:leading-[0.9]">
            Master English with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Real-Time AI</span>
          </h1>
          <p className="text-base md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed mb-8 md:mb-14 px-4">
            The first language platform that actually listens, speaks, and learns with you. 
            Personalized lessons powered by the world's most advanced AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <button 
              onClick={user ? onNavigateToDashboard : onGetStarted}
              className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-slate-900 text-white rounded-xl md:rounded-[2rem] text-sm md:text-lg font-black uppercase tracking-widest shadow-2xl hover:bg-black transition-all transform hover:-translate-y-1"
            >
              {user ? 'Enter Dashboard' : 'Start Free Trial'}
            </button>
            {!user && (
              <button 
                onClick={onLogin}
                className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-6 bg-white border border-slate-200 text-slate-900 rounded-xl md:rounded-[2rem] text-sm md:text-lg font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
              >
                Login to Portal
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 md:py-32 bg-slate-50 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-tight">A Holistic Approach to Fluency</h2>
            <p className="text-slate-500 font-medium text-sm md:text-base">Four core pillars of learning integrated into one seamless platform.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="group bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-default"
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 bg-${f.color}-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-10 shadow-lg shadow-${f.color}-100 text-white`}>
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3 md:mb-5">{f.title}</h3>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-40 bg-white relative overflow-hidden border-t border-slate-100 px-4 md:px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-24 px-4">
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tight mb-4 leading-tight">
              Trusted by Thousands of <br className="hidden md:block" /><span className="text-indigo-600">Future Polyglots</span>
            </h2>
            <div className="w-16 md:w-24 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="group relative p-6 md:p-10 rounded-[1.5rem] md:rounded-[3rem] bg-white border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.15)] transition-all duration-500 hover:-translate-y-1 md:hover:-translate-y-3"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 md:w-20 md:h-20 rounded-xl md:rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 md:mb-8 group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-500">
                    <svg className="w-6 h-6 md:w-10 md:h-10 text-indigo-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                    </svg>
                  </div>
                  <p className="text-3xl md:text-6xl font-black text-slate-900 mb-1 md:mb-3 tracking-tighter group-hover:text-indigo-600 transition-colors">
                    {stat.value}
                  </p>
                  <p className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.3em] group-hover:text-indigo-400 transition-colors">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white pt-16 md:pt-32 pb-12 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -mr-40 -mt-40"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 md:mb-24">
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <span className="text-xl font-black tracking-tight">Star AI</span>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed text-sm max-w-xs">
                Empowering individuals to master global communication through advanced multimodal AI reasoning and real-time feedback loops.
              </p>
              <div className="flex gap-4">
                {[
                  { name: 'X', path: 'M2.048 2.048l7.636 10.871L2.048 21.952h1.718l6.685-7.662L15.939 21.952h5.842l-8.118-11.558L21.293 2.048h-1.718l-6.223 7.132L5.438 2.048H2.048z' },
                  { name: 'LinkedIn', path: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' },
                  { name: 'YouTube', path: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 6.816-.029 4.185.426 6.549 4.385 6.816 3.6.246 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-6.816.029-4.185-.426-6.549-4.385-6.816zm-10.615 10.816v-8l7 4-7 4z' }
                ].map((social, i) => (
                  <button key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500 transition-all group">
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Products</h4>
              <ul className="space-y-3 md:space-y-4">
                <li><button onClick={() => scrollToSection('features')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Speaking Studio</button></li>
                <li><button onClick={() => scrollToSection('features')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Writing Workshop</button></li>
                <li><button onClick={onMethodology} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Scientific Method</button></li>
                <li><button onClick={onGetStarted} className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Free Proficiency Test</button></li>
              </ul>
            </div>

            <div className="space-y-4 md:space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Resources</h4>
              <ul className="space-y-3 md:space-y-4">
                <li><button className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Documentation</button></li>
                <li><button className="text-sm font-bold text-slate-400 hover:text-white transition-colors">API Status</button></li>
                <li><button className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Terms of Service</button></li>
              </ul>
            </div>

            <div className="space-y-4 md:space-y-6">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Join the Circle</h4>
              <p className="text-slate-400 text-sm font-medium">Get early access to new AI tutors and learning modules.</p>
              <div className="relative group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-slate-600"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-indigo-600 px-4 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 text-white">
                  Join
                </button>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">© 2025 Star AI Global • All Rights Reserved</p>
              <div className="flex gap-4">
                <button className="text-[9px] font-black text-slate-700 hover:text-white uppercase tracking-widest transition-colors">System Status</button>
                <button className="text-[9px] font-black text-slate-700 hover:text-white uppercase tracking-widest transition-colors">Cookies</button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Live Engine</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
