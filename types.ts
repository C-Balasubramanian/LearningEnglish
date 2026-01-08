
export enum LearningMode {
  SPEAKING = 'speaking',
  LISTENING = 'listening',
  READING = 'reading',
  WRITING = 'writing',
  DASHBOARD = 'dashboard',
  ASSISTANT = 'assistant',
  MOVIE_LEARNING = 'movie_learning',
  HISTORY = 'history',
  ADMIN_USERS = 'admin_users',
  PROFILE = 'profile',
  TRANSLATOR = 'translator'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  englishLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  password?: string;
  role: 'admin' | 'user';
}

export interface Activity {
  id: string;
  userId: string;
  type: LearningMode;
  title: string;
  timestamp: number;
  score?: number;
  details?: any;
}

export interface TranscriptionEntry {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Subtitle {
  time: number;
  english: string;
  tamil: string;
}

export interface MovieScene {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  description: string;
  subtitles: Subtitle[];
}

export interface MovieStory {
  id: string;
  title: string;
  coverImage: string;
  genre: string;
  rating: string;
  parts: MovieScene[];
}

export interface Correction {
  originalPart: string;
  correctedPart: string;
  reason: string;
  category: 'Grammar' | 'Spelling' | 'Style' | 'Punctuation' | 'Vocabulary';
}

export interface WritingFeedback {
  original: string;
  corrected: string;
  explanation: string;
  score: number;
  corrections: Correction[];
}

export interface ReadingPassage {
  title: string;
  content: string;
  difficulty: string;
  questions: {
    question: string;
    options: string[];
    answer: number;
  }[];
}
