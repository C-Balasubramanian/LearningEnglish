
import React, { useState, useEffect } from 'react';
import { StoryBook, BookChapter, User, BookSentence } from '../types';
import { GoogleGenAI, Type } from '@google/genai';
import { PersistenceService } from '../services/persistence';

interface StoryBooksProps {
  user: User;
}

const INITIAL_BOOKS: StoryBook[] = [
  {
    id: 'book-mahabharata',
    title: 'Mahabharatham',
    author: 'Vyasa',
    rating: '10.0',
    coverImage: 'https://images.unsplash.com/photo-1533619239233-628ce635e8c9?auto=format&fit=crop&q=80&w=800',
    fullNarrative: [
      { english: "The Mahabharata is a saga of the Kuru dynasty, exploring the complexities of duty, power, and the ultimate war of Kurukshetra.", tamil: "மகாபாரதம் என்பது குரு வம்சத்தின் ஒரு காவியமாகும், இது கடமை, அதிகாரம் மற்றும் குருக்ஷேத்திரத்தின் இறுதிப் போரை ஆராய்கிறது." },
      { english: "It depicts the rivalry between the five Pandava brothers and their hundred Kaurava cousins over the throne of Hastinapura.", tamil: "ஹஸ்தினாபுரத்தின் அரியணைக்காக ஐந்து பாண்டவ சகோதரர்களுக்கும் அவர்களது நூறு கௌரவ உறவினர்களுக்கும் இடையிலான பகையை இது சித்தரிக்கிறது." },
      { english: "The climax is the Kurukshetra War, an eighteen-day battle that saw millions of warriors and changed the course of history.", tamil: "இதன் உச்சக்கட்டம் குருக்ஷேத்திரப் போர், பதினெட்டு நாட்கள் நடந்த இந்தப் போர் மில்லியன் கணக்கான வீரர்களைக் கண்டு வரலாற்றின் போக்கை மாற்றியது." },
      { english: "Lord Krishna serves as the divine guide, delivering the Bhagavad Gita to Arjuna in the middle of the battlefield.", tamil: "கிருஷ்ண பரமாத்மா தெய்வீக வழிகாட்டியாகச் செயல்பட்டு, போர்க்களத்தின் நடுவில் அர்ஜுனனுக்கு பகவத் கீதையை வழங்குகிறார்." }
    ],
    chapters: [
      {
        id: 'mb-1',
        title: 'I. The Divided Kingdom',
        description: 'The royal court of Hastinapura where the seeds of conflict were sown between cousins.',
        thumbnail: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=400',
        sentences: [
          { english: "In the royal court of Hastinapura, the Pandavas and Kauravas were raised together under the elders' gaze.", tamil: "ஹஸ்தினாபுரத்தின் அரச சபையில், பாண்டவர்களும் கௌரவர்களும் பெரியவர்களின் கண்காணிப்பில் ஒன்றாக வளர்னர்." }
        ]
      }
    ]
  },
  {
    id: 'book-ramayana',
    title: 'Ramayanam',
    author: 'Valmiki / Kambar',
    rating: '10.0',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    fullNarrative: [
      { english: "The Ramayana tells the story of Prince Rama, an avatar of Vishnu, who lived to uphold Dharma.", tamil: "ராமாயணம் தர்மத்தை நிலைநாட்ட வாழ்ந்த விஷ்ணுவின் அவதாரமான ராமபிரானின் கதையைச் சொல்கிறது." }
    ],
    chapters: [
      {
        id: 'ram-1',
        title: 'I. Bala Kanda',
        description: 'The divine birth and childhood of the four princes in the golden city of Ayodhya.',
        thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
        sentences: [
          { english: "The kingdom of Ayodhya celebrated as four divine children were born to King Dasharatha.", tamil: "தசரத மன்னருக்கு நான்கு தெய்வீகக் குழந்தைகள் பிறந்தபோது அயோத்தி ராஜ்ஜியம் கொண்டாடியது." }
        ]
      }
    ]
  }
];

const StoryBooks: React.FC<StoryBooksProps> = ({ user }) => {
  const [allBooks, setAllBooks] = useState<StoryBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<StoryBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<BookChapter | null>(null);
  const [isExplainingFullStory, setIsExplainingFullStory] = useState(false);
  const [activeTab, setActiveTab] = useState<'chapters' | 'storyboard'>('chapters');
  
  // Creation Flow States
  const [isCreating, setIsCreating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookSections, setNewBookSections] = useState<{title: string, desc: string, content: string}[]>([{title: '', desc: '', content: ''}]);

  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [isGeneratingImage, setIsGeneratingImage] = useState<string | null>(null);

  // Load persistence data based on user login
  useEffect(() => {
    const customBooks = PersistenceService.getUserBooks(user.id);
    setAllBooks([...customBooks, ...INITIAL_BOOKS]);
  }, [user.id]);

  const handleAiMagicFill = async () => {
    if (!newBookTitle.trim() || isSuggesting) return;
    setIsSuggesting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `I want to write a long epic story titled "${newBookTitle}". 
        Create exactly 20 engaging story chapters/sections for this title to form a complete book. 
        For each of the 20 sections, provide:
        1. A compelling Chapter Title.
        2. A short description (one sentence).
        3. The actual story content (3-4 sentences in English).
        
        Return the result as a JSON array of 20 objects with keys: "title", "desc", "content".`,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const suggestions = JSON.parse(response.text);
      if (Array.isArray(suggestions)) {
        setNewBookSections(suggestions);
      }
    } catch (err) {
      console.error("Magic Fill Error:", err);
      alert("AI was unable to generate 20 chapters at this time. Try again.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAddSection = () => {
    setNewBookSections([...newBookSections, { title: '', desc: '', content: '' }]);
  };

  const handleUpdateSection = (index: number, field: 'title' | 'desc' | 'content', value: string) => {
    const updated = [...newBookSections];
    updated[index][field] = value;
    setNewBookSections(updated);
  };

  const handlePublishStory = async () => {
    if (!newBookTitle || newBookSections.some(s => !s.title || !s.content)) return;
    setIsPublishing(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const translationResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Translate the following ${newBookSections.length} story chapters into Tamil. 
        Chapters: ${JSON.stringify(newBookSections.map((s, i) => ({ id: i, title: s.title, content: s.content })))}
        
        Return a JSON array of objects, one for each chapter, with this exact schema:
        {
          "index": number,
          "tamilTitle": "...",
          "sentences": [{"english": "...", "tamil": "..."}]
        }`,
        config: { responseMimeType: 'application/json' }
      });
      
      const results = JSON.parse(translationResponse.text);
      
      const chapters: BookChapter[] = newBookSections.map((section, i) => {
        const translation = results.find((r: any) => r.index === i) || { tamilTitle: section.title, sentences: [{ english: section.content, tamil: 'Translation Pending' }] };
        return {
          id: `new-ch-${Date.now()}-${i}`,
          title: section.title,
          description: section.desc,
          thumbnail: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=400',
          sentences: translation.sentences
        };
      });

      const newStory: StoryBook = {
        id: `book-custom-${Date.now()}`,
        title: newBookTitle,
        author: user.name,
        rating: 'New',
        coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
        chapters,
        fullNarrative: chapters.flatMap(c => c.sentences).slice(0, 10)
      };

      // PERSIST DATA LOCALLY KEYED TO USER ID
      PersistenceService.saveUserBook(user.id, newStory);
      
      setAllBooks([newStory, ...allBooks]);
      setIsCreating(false);
      setNewBookTitle('');
      setNewBookSections([{title: '', desc: '', content: ''}]);
    } catch (err) {
      console.error("Publishing Error:", err);
      alert("Linguistic Engine Error during batch translation. Please check connection.");
    } finally {
      setIsPublishing(false);
    }
  };

  const generateImage = async (id: string, promptText: string) => {
    if (isGeneratingImage) return;
    setIsGeneratingImage(id);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A cinematic masterpiece illustration for the Indian Epic ${selectedBook?.title}. Scene title: "${promptText}". Style: Ancient Indian art meets modern cinema, divine lighting, hyper-realistic, 16:9 aspect ratio, vibrant colors.` }]
        },
        config: {
          imageConfig: { aspectRatio: "16:9" }
        }
      });

      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part?.inlineData?.data) {
        setGeneratedImages(prev => ({ ...prev, [id]: `data:image/png;base64,${part.inlineData.data}` }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingImage(null);
    }
  };

  const handleNextChapter = () => {
    if (!selectedBook || !selectedChapter) return;
    const currentIndex = selectedBook.chapters.findIndex(c => c.id === selectedChapter.id);
    if (currentIndex < selectedBook.chapters.length - 1) {
      setSelectedChapter(selectedBook.chapters[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSelectedChapter(null);
      setSelectedBook(null);
    }
  };

  const renderFullNarrative = () => (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-40">
      <header className="text-center space-y-6">
        <div className="inline-flex px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-amber-100">Narrative Overview</div>
        <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">{selectedBook?.title}</h2>
        <p className="text-xl text-slate-400 font-bold italic tracking-tight">The Complete Start-to-End Explanation</p>
      </header>

      <div className="grid gap-12">
        {selectedBook?.fullNarrative.map((pair, idx) => (
          <div key={idx} className="relative group">
            <div className="absolute -left-12 top-0 text-7xl font-black text-slate-50 opacity-10 group-hover:opacity-20 transition-opacity">{idx < 9 ? `0${idx + 1}` : idx + 1}</div>
            <div className="space-y-6 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl relative z-10 border-l-8 border-l-amber-400">
               <p className="text-2xl md:text-3xl font-medium text-slate-800 leading-tight tracking-tight">
                 {pair.english}
               </p>
               <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                 <p className="text-xl md:text-2xl font-bold text-indigo-500 italic opacity-80">
                   {pair.tamil}
                 </p>
                 <button 
                  onClick={() => generateImage(`narrative-${idx}`, pair.english)}
                  className="p-3 bg-slate-50 hover:bg-amber-100 rounded-2xl text-amber-600 transition-colors border border-slate-100"
                  title="Visualize this segment"
                 >
                   {isGeneratingImage === `narrative-${idx}` ? <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div> : <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                 </button>
               </div>
               {generatedImages[`narrative-${idx}`] && (
                 <div className="mt-8 rounded-[2rem] overflow-hidden shadow-2xl border border-amber-100 animate-in zoom-in duration-500">
                    <img src={generatedImages[`narrative-${idx}`]} className="w-full aspect-video object-cover" alt="Scene" />
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans">
      <header className="p-6 md:p-8 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 text-white">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Library of Epics</h1>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Illustrated Story Collections</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(!selectedBook && !isCreating) && (
            <button 
              onClick={() => setIsCreating(true)}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
              Create Epic
            </button>
          )}

          {(selectedBook || selectedChapter || isExplainingFullStory || isCreating) && (
            <button 
              onClick={() => {
                if (selectedChapter) setSelectedChapter(null);
                else if (isExplainingFullStory) setIsExplainingFullStory(false);
                else if (isCreating) setIsCreating(false);
                else setSelectedBook(null);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 text-slate-500"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Library
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        {isCreating ? (
          <div className="max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="mb-12">
               <h2 className="text-4xl font-black text-slate-900 tracking-tight">Story Creator Studio</h2>
               <p className="text-slate-500 font-medium">Draft your epic. Magic Fill generates a full 20-chapter outline.</p>
            </header>

            <div className="space-y-10">
               <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Epic Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. The Legend of the Rising Sun" 
                      className="w-full px-8 py-5 bg-white border border-slate-200 rounded-[2rem] text-xl font-bold focus:outline-none focus:ring-4 focus:ring-indigo-50 shadow-sm"
                      value={newBookTitle}
                      onChange={(e) => setNewBookTitle(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleAiMagicFill}
                    disabled={!newBookTitle.trim() || isSuggesting}
                    className="h-[64px] px-8 bg-amber-500 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-amber-100 hover:bg-amber-400 transition-all flex items-center gap-3 disabled:opacity-50"
                  >
                    {isSuggesting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                    Full 20-Chapter Fill
                  </button>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Story Sections ({newBookSections.length})</label>
                    <button 
                      onClick={handleAddSection}
                      className="text-[10px] font-black uppercase text-indigo-600 tracking-widest px-4 py-2 bg-indigo-50 rounded-xl"
                    >
                      + Add Section
                    </button>
                  </div>

                  <div className="grid gap-8 max-h-[1000px] overflow-y-auto pr-4 custom-scrollbar p-1">
                    {newBookSections.map((section, idx) => (
                      <div key={idx} className="p-8 bg-white border border-slate-200 rounded-[3rem] shadow-sm space-y-6 relative group">
                        <div className="absolute -left-4 -top-4 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-xl">
                          {idx + 1}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase text-slate-400">Section Title</label>
                             <input 
                               type="text" 
                               className="w-full px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm"
                               placeholder="Chapter Title..."
                               value={section.title}
                               onChange={(e) => handleUpdateSection(idx, 'title', e.target.value)}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black uppercase text-slate-400">Brief Description</label>
                             <input 
                               type="text" 
                               className="w-full px-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm"
                               placeholder="Short summary..."
                               value={section.desc}
                               onChange={(e) => handleUpdateSection(idx, 'desc', e.target.value)}
                             />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-slate-400">Story Body (English)</label>
                          <textarea 
                            className="w-full h-32 px-6 py-5 bg-slate-50 border border-slate-100 rounded-3xl font-medium text-slate-700 focus:outline-none focus:bg-white transition-all"
                            placeholder="Tell your story here..."
                            value={section.content}
                            onChange={(e) => handleUpdateSection(idx, 'content', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="pt-10 flex justify-end gap-4 pb-20">
                  <button 
                    onClick={() => setIsCreating(false)}
                    className="px-10 py-5 bg-white border border-slate-200 text-slate-400 rounded-[2rem] font-black text-sm uppercase tracking-widest"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={handlePublishStory}
                    disabled={isPublishing || !newBookTitle || newBookSections[0].content.length < 5}
                    className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-100 flex items-center gap-3 disabled:opacity-50"
                  >
                    {isPublishing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Linguistic Batch Processing...
                      </>
                    ) : (
                      <>
                        Publish to Library
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </>
                    )}
                  </button>
               </div>
            </div>
          </div>
        ) : !selectedBook ? (
          <div className="p-6 md:p-12 space-y-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <div 
                onClick={() => setIsCreating(true)}
                className="group cursor-pointer aspect-[3/4.5] rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center hover:border-indigo-600/30 hover:bg-white transition-all transform hover:-translate-y-2"
              >
                 <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                   <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create Your Own Epic</h3>
                 <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Personal Authoring Studio</p>
              </div>

              {allBooks.map(book => (
                <div key={book.id} onClick={() => setSelectedBook(book)} className="group cursor-pointer transform hover:-translate-y-4 transition-all duration-700">
                  <div className="relative aspect-[3/4.5] rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl bg-white">
                    <img src={book.coverImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={book.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent flex flex-col justify-end p-10">
                      <h3 className="text-4xl font-black text-white group-hover:text-amber-400 transition-colors tracking-tighter leading-none mb-2">{book.title}</h3>
                      <p className="text-amber-400/80 text-[11px] font-black uppercase tracking-[0.3em] mb-4">{book.author}</p>
                      <div className="flex items-center gap-4">
                         <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase text-white/60">Bilingual</span>
                         <span className="text-[10px] font-black uppercase text-white/40">{book.chapters.length} Chapters</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : isExplainingFullStory ? (
          renderFullNarrative()
        ) : !selectedChapter ? (
          <div className="p-6 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-7xl mx-auto space-y-16 pb-32">
            <div className="flex flex-col xl:flex-row gap-16 items-center xl:items-end">
              <div className="w-full max-w-[400px] aspect-[3/4.5] rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(79,70,229,0.15)] border border-slate-200 bg-white group">
                <img src={selectedBook.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={selectedBook.title} />
              </div>
              <div className="flex-1 text-center xl:text-left space-y-8">
                <div className={`inline-block px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.4em] ${selectedBook.id.includes('custom') ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                  {selectedBook.id.includes('custom') ? 'Personal Authoring' : 'Master Piece Selection'}
                </div>
                <h2 className={`text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] ${selectedBook.id === 'book-mahabharata' ? 'text-amber-900' : 'text-slate-950'}`}>{selectedBook.title}</h2>
                <div className="flex flex-col md:flex-row items-center justify-center xl:justify-start gap-8 pt-4">
                  <button 
                    onClick={() => setIsExplainingFullStory(true)}
                    className="px-12 py-6 bg-amber-500 hover:bg-amber-400 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center gap-4"
                  >
                    Read Full Story
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"/></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Book Tabs */}
            <div className="flex items-center gap-12 border-b border-slate-200 pb-2">
               <button onClick={() => setActiveTab('chapters')} className={`pb-4 text-xs font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === 'chapters' ? 'text-indigo-600' : 'text-slate-400'}`}>
                 Chapter Directory
                 {activeTab === 'chapters' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
               </button>
               <button onClick={() => setActiveTab('storyboard')} className={`pb-4 text-xs font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === 'storyboard' ? 'text-indigo-600' : 'text-slate-400'}`}>
                 Visual Storyboard
                 {activeTab === 'storyboard' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full"></div>}
               </button>
            </div>

            {activeTab === 'chapters' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedBook.chapters.map((chapter, idx) => (
                  <div key={chapter.id} onClick={() => setSelectedChapter(chapter)} className="group bg-white p-6 rounded-[2.5rem] border border-slate-200 hover:border-indigo-600/40 hover:shadow-2xl transition-all cursor-pointer flex flex-col gap-6">
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-lg bg-slate-100">
                      {generatedImages[chapter.id] ? (
                        <img src={generatedImages[chapter.id]} className="w-full h-full object-cover animate-in fade-in duration-500" alt={chapter.title} />
                      ) : (
                        <img src={chapter.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={chapter.title} />
                      )}
                      <div className="absolute top-4 left-4 w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-indigo-500 text-sm shadow-lg border border-indigo-50">
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1 px-2">
                      <h4 className="font-black text-xl text-slate-950 mb-2 group-hover:text-indigo-600 transition-colors tracking-tight leading-none">{chapter.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 font-medium">{chapter.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-12">
                 {selectedBook.chapters.map((chapter) => (
                   <div key={chapter.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-10 rounded-[4rem] border border-slate-100 shadow-sm items-center">
                      <div className="space-y-6">
                         <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Show Image: Chapter {selectedBook.chapters.indexOf(chapter)+1}</div>
                         <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{chapter.title}</h3>
                         <p className="text-lg text-slate-500 font-medium leading-relaxed italic">"{chapter.description}"</p>
                         <button 
                           onClick={() => generateImage(chapter.id, chapter.title)}
                           className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 active:scale-95"
                         >
                           {isGeneratingImage === chapter.id ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                           Visualize Title
                         </button>
                      </div>
                      <div className="aspect-video bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 relative group">
                        {generatedImages[chapter.id] ? (
                          <img src={generatedImages[chapter.id]} className="w-full h-full object-cover animate-in zoom-in duration-700" alt={chapter.title} />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
                             <svg className="w-16 h-16 text-slate-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                             <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">Image will appear here</p>
                          </div>
                        )}
                        {isGeneratingImage === chapter.id && (
                          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                             <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-indigo-600 font-black uppercase text-[10px] tracking-[0.2em] animate-pulse">Painting Epic Scene...</p>
                             </div>
                          </div>
                        )}
                      </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-40">
            <header className="text-center space-y-6">
              <div className="inline-flex px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.4em]">Active Reading</div>
              <h2 className="text-5xl font-black text-slate-950 tracking-tighter leading-none">{selectedChapter.title}</h2>
              <p className="text-slate-400 font-bold italic text-lg">Part {selectedBook.chapters.indexOf(selectedChapter) + 1} of {selectedBook.chapters.length}</p>
            </header>

            <div className="space-y-16">
              {selectedChapter.sentences.map((pair, idx) => (
                <div key={idx} className="group relative">
                   <div className="absolute -left-6 top-10 w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xs font-black border-8 border-slate-50 shadow-2xl z-10">
                      {idx + 1}
                   </div>
                   <div className="space-y-10 p-12 bg-white border border-slate-100 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all relative">
                      <div className="flex justify-between items-start gap-6">
                        <p className="text-2xl md:text-3xl font-medium text-slate-800 leading-tight tracking-tight flex-1">
                          {pair.english}
                        </p>
                        <button 
                          onClick={() => generateImage(`${selectedChapter.id}-sentence-${idx}`, pair.english)}
                          className="flex-shrink-0 w-12 h-12 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-2xl border border-slate-100 flex items-center justify-center transition-all shadow-sm"
                          title="Illustrate Scene"
                        >
                          {isGeneratingImage === `${selectedChapter.id}-sentence-${idx}` ? <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        </button>
                      </div>
                      <div className="pt-10 border-t border-slate-50">
                        <p className="text-xl md:text-2xl font-bold text-indigo-400/80 group-hover:text-indigo-600 transition-colors italic leading-relaxed">
                          {pair.tamil}
                        </p>
                      </div>
                      {generatedImages[`${selectedChapter.id}-sentence-${idx}`] && (
                        <div className="mt-8 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-700">
                           <img src={generatedImages[`${selectedChapter.id}-sentence-${idx}`]} className="w-full aspect-video object-cover" alt="Scene" />
                        </div>
                      )}
                   </div>
                </div>
              ))}
            </div>

            <footer className="pt-24 flex flex-col items-center gap-10">
               <div className="h-px w-32 bg-slate-200"></div>
               <div className="text-[11px] font-black text-slate-300 uppercase tracking-[1em]">Chapter Concluded</div>
               <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedChapter(null)}
                    className="px-8 py-5 bg-white border border-slate-200 text-slate-400 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-50 transition-all"
                  >
                    Library
                  </button>
                  <button 
                    onClick={handleNextChapter}
                    className="px-12 py-5 bg-slate-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center gap-3"
                  >
                    {selectedBook.chapters.indexOf(selectedChapter) < selectedBook.chapters.length - 1 ? 'Next Chapter' : 'Finish Collection'}
                  </button>
               </div>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
};

export default StoryBooks;
