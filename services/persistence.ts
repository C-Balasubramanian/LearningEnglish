
import { User, Activity, LearningMode, StoryBook } from '../types';

const USERS_KEY = 'linguist_users_db';
const SESSION_KEY = 'linguist_session';
const ACTIVITIES_KEY = 'linguist_activities_db';
const CUSTOM_BOOKS_KEY = 'linguist_custom_books_db';

// Simulated delay to mimic network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const PersistenceService = {
  getUserByEmail: async (email: string): Promise<User | null> => {
    await delay(500);
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  login: async (email: string, password: string): Promise<User> => {
    await delay(800);
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }
    
    // Create a copy without password for session
    const { password: _, ...userSession } = user;
    return userSession as User;
  },

  createUser: async (name: string, email: string, password: string, level: User['englishLevel']): Promise<User> => {
    await delay(1000);
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      password,
      englishLevel: level,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'user'
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const { password: _, ...userSession } = newUser;
    return userSession as User;
  },

  updateUser: async (userId: string, updates: Partial<User>): Promise<User> => {
    await delay(800);
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) throw new Error('User not found');
    
    // Update the record
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Update current session
    const { password: _, ...userSession } = users[index];
    localStorage.setItem(SESSION_KEY, JSON.stringify(userSession));
    
    return userSession as User;
  },

  updatePassword: async (userId: string, currentPass: string, newPass: string): Promise<void> => {
    await delay(1000);
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = users.findIndex(u => u.id === userId);
    
    if (index === -1) throw new Error('User not found');
    if (users[index].password !== currentPass) throw new Error('Current password is incorrect');
    
    users[index].password = newPass;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  setCurrentUser: (user: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  saveActivity: async (userId: string, type: LearningMode, title: string, score?: number, details?: any) => {
    const activities: Activity[] = JSON.parse(localStorage.getItem(ACTIVITIES_KEY) || '[]');
    const act: Activity = { 
      id: `act_${Date.now()}`, 
      userId, 
      type, 
      title, 
      timestamp: Date.now(), 
      score, 
      details 
    };
    activities.unshift(act);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
    return act;
  },

  getActivities: async (userId: string): Promise<Activity[]> => {
    const data = localStorage.getItem(ACTIVITIES_KEY);
    const all: Activity[] = data ? JSON.parse(data) : [];
    return all.filter(a => a.userId === userId);
  },

  getAllUsers: async (): Promise<User[]> => {
    await delay(300);
    const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.map(({ password, ...u }) => u as User);
  },

  // StoryBook Persistence
  getUserBooks: (userId: string): StoryBook[] => {
    const data = localStorage.getItem(CUSTOM_BOOKS_KEY);
    if (!data) return [];
    const all: Record<string, StoryBook[]> = JSON.parse(data);
    return all[userId] || [];
  },

  saveUserBook: (userId: string, book: StoryBook) => {
    const data = localStorage.getItem(CUSTOM_BOOKS_KEY);
    const all: Record<string, StoryBook[]> = data ? JSON.parse(data) : {};
    if (!all[userId]) all[userId] = [];
    all[userId].unshift(book);
    localStorage.setItem(CUSTOM_BOOKS_KEY, JSON.stringify(all));
  },

  getDbInfo: () => ({
    cluster: 'LocalEngine',
    project: 'star-ai-offline',
    database: 'star-storage',
    status: 'Active'
  })
};
