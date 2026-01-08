
import { User, Activity, LearningMode } from '../types';

const ADMIN_EMAIL = 'balainfilabs@gmail.com';

const DB_METADATA = {
  cluster: 'Cluster0',
  project: 'ai',
  database: 'test',
  collections: {
    users: 'users',
    conversations: 'conversations'
  }
};

const SESSION_KEY = 'linguist_ai_session';
const LOCAL_USERS_DB = 'linguist_ai_users_db';
const LOCAL_HISTORY_DB = 'linguist_ai_activities_db';

export const PersistenceService = {
  getDbInfo: () => ({
    ...DB_METADATA,
    status: 'Connected',
    host: 'cluster0.ubahopq.mongodb.net'
  }),

  getUserByEmail: async (email: string): Promise<User | null> => {
    console.log(`[Atlas] findOne user: ${email}`);
    await new Promise(r => setTimeout(r, 600));
    const users: User[] = JSON.parse(localStorage.getItem(LOCAL_USERS_DB) || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    // Auto-patch admin role for the specific email if it exists
    if (user && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      user.role = 'admin';
    } else if (user) {
      user.role = user.role || 'user';
    }
    
    return user || null;
  },

  getAllUsers: async (): Promise<User[]> => {
    console.log(`[Atlas] find many documents from test.users`);
    await new Promise(r => setTimeout(r, 800));
    const users: User[] = JSON.parse(localStorage.getItem(LOCAL_USERS_DB) || '[]');
    return users.map(u => ({
      ...u,
      role: u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : (u.role || 'user')
    }));
  },

  createUser: async (name: string, email: string, password: string, level: User['englishLevel']): Promise<User> => {
    console.log(`[Atlas] insertOne user...`);
    await new Promise(r => setTimeout(r, 1000));
    
    const users: User[] = JSON.parse(localStorage.getItem(LOCAL_USERS_DB) || '[]');
    
    const newUser: User = {
      id: `obj_${Math.random().toString(36).substr(2, 12)}`,
      name,
      email: email.toLowerCase(),
      password, 
      englishLevel: level,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      role: email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user'
    };
    
    users.push(newUser);
    localStorage.setItem(LOCAL_USERS_DB, JSON.stringify(users));
    return newUser;
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
    console.log(`[Atlas] insertOne activity...`);
    const newActivity: Activity = {
      id: `doc_${Math.random().toString(36).substr(2, 12)}`,
      userId,
      type,
      title,
      score,
      details,
      timestamp: Date.now()
    };
    await new Promise(r => setTimeout(r, 1200));
    const allActivities: Activity[] = JSON.parse(localStorage.getItem(LOCAL_HISTORY_DB) || '[]');
    allActivities.unshift(newActivity);
    localStorage.setItem(LOCAL_HISTORY_DB, JSON.stringify(allActivities));
    return newActivity;
  },

  getActivities: async (userId: string): Promise<Activity[]> => {
    console.log(`[Atlas] find activities for ${userId}`);
    await new Promise(r => setTimeout(r, 800));
    const data = localStorage.getItem(LOCAL_HISTORY_DB);
    const all: Activity[] = data ? JSON.parse(data) : [];
    return all.filter(a => a.userId === userId);
  }
};
