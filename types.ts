

export enum LearningMode {
  SPEAKING = 'speaking',
  LISTENING = 'listening',
  READING = 'reading',
  WRITING = 'writing',
  DASHBOARD = 'dashboard',
  ASSISTANT = 'assistant',
  STORY_BOOKS = 'story_books',
  PROFILE = 'profile',
  TRANSLATOR = 'translator',
  ADMIN_USERS = 'admin_users',
  DAILY_ROUTINE = 'daily_routine'
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

export interface BookSentence {
  english: string;
  tamil: string;
}

export interface BookChapter {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  sentences: BookSentence[];
}

export interface StoryBook {
  id: string;
  title: string;
  author: string;
  rating: string;
  coverImage: string;
  chapters: BookChapter[];
  fullNarrative: BookSentence[]; // New field for start-to-end explanation
}

export interface SubtitlePair {
  time: number;
  english: string;
  tamil: string;
}

export interface MovieScene {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeId: string;
  subtitles: SubtitlePair[];
}

export interface MovieStory {
  id: string;
  title: string;
  genre: string;
  rating: string;
  coverImage: string;
  parts: MovieScene[];
}

/**
 * Added to resolve compilation errors in WritingLearning.tsx.
 * Defines the structure for granular writing corrections.
 */
export interface Correction {
  originalPart: string;
  correctedPart: string;
  reason: string;
  category: 'Grammar' | 'Spelling' | 'Style' | 'Punctuation' | 'Vocabulary';
}

/**
 * Added to resolve compilation errors in WritingLearning.tsx.
 * Defines the complete feedback structure for writing analysis.
 */
export interface WritingFeedback {
  original: string;
  corrected: string;
  explanation: string;
  score: number;
  corrections: Correction[];
}

/**
 * Added to resolve compilation errors in ReadingLearning.tsx.
 * Defines a single multiple-choice question for reading comprehension.
 */
export interface ReadingQuestion {
  question: string;
  options: string[];
  answer: number;
}

/**
 * Added to resolve compilation errors in ReadingLearning.tsx.
 * Defines the complete structure for a generated reading passage and its associated quiz.
 */
export interface ReadingPassage {
  title: string;
  content: string;
  difficulty: string;
  questions: ReadingQuestion[];
}
