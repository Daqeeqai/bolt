import { create } from 'zustand';
import { supabase, Profile, Traveler, AIConversation, AIMetrics, Feedback } from './supabase';
import { AuthService } from './auth';
import { DatabaseService } from './database';
import { User } from '@supabase/supabase-js';

interface AppState {
  // Auth
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  
  // Dashboard data
  metrics: AIMetrics | null;
  conversations: AIConversation[];
  travelers: Traveler[];
  feedback: Feedback[];
  selectedTraveler: Traveler | null;
  
  // UI state
  sidebarOpen: boolean;
  activeView: string;
  
  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setMetrics: (metrics: AIMetrics) => void;
  setConversations: (conversations: AIConversation[]) => void;
  setTravelers: (travelers: Traveler[]) => void;
  setFeedback: (feedback: Feedback[]) => void;
  setSelectedTraveler: (traveler: Traveler | null) => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveView: (view: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Async actions
  signUp: (email: string, password: string, fullName: string, role?: 'admin' | 'agent') => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  loadDashboardData: () => Promise<void>;
  loadTravelers: () => Promise<void>;
  loadConversations: () => Promise<void>;
  loadFeedback: () => Promise<void>;
  loadMetrics: () => Promise<void>;
  
  // Real-time subscriptions
  subscribeToUpdates: () => void;
  unsubscribeFromUpdates: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  error: null,
  metrics: null,
  conversations: [],
  travelers: [],
  feedback: [],
  selectedTraveler: null,
  sidebarOpen: true,
  activeView: 'dashboard',
  
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setMetrics: (metrics) => set({ metrics }),
  setConversations: (conversations) => set({ conversations }),
  setTravelers: (travelers) => set({ travelers }),
  setFeedback: (feedback) => set({ feedback }),
  setSelectedTraveler: (traveler) => set({ selectedTraveler: traveler }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveView: (view) => set({ activeView: view }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  signUp: async (email: string, password: string, fullName: string, role = 'agent') => {
    set({ loading: true, error: null });
    try {
      const { user, profile, error } = await AuthService.signUp({
        email,
        password,
        full_name: fullName,
        role
      });
      
      if (error) {
        set({ error: error.message });
        return false;
      }
      
      set({ user, profile });
      return true;
    } catch (error) {
      set({ error: (error as Error).message });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  
  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { user, profile, error } = await AuthService.signIn({
        email,
        password
      });
      
      if (error) {
        set({ error: error.message });
        return false;
      }
      
      set({ user, profile });
      
      // Load dashboard data after successful sign in
      await get().loadDashboardData();
      
      return true;
    } catch (error) {
      set({ error: (error as Error).message });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  
  signOut: async () => {
    set({ loading: true });
    try {
      await AuthService.signOut();
      
      // Clear all data
      set({ 
        user: null,
        profile: null,
        metrics: null,
        conversations: [],
        travelers: [],
        feedback: [],
        selectedTraveler: null,
        error: null
      });
      
      // Unsubscribe from real-time updates
      get().unsubscribeFromUpdates();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  
  loadDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      await Promise.all([
        get().loadTravelers(),
        get().loadConversations(),
        get().loadFeedback(),
        get().loadMetrics()
      ]);
      
      // Subscribe to real-time updates
      get().subscribeToUpdates();
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
  
  loadTravelers: async () => {
    try {
      const { data, error } = await DatabaseService.getTravelers();
      
      if (error) {
        set({ error: error.message });
        return;
      }
      
      set({ travelers: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  loadConversations: async () => {
    try {
      const { data, error } = await DatabaseService.getConversations();
      
      if (error) {
        set({ error: error.message });
        return;
      }
      
      set({ conversations: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  loadFeedback: async () => {
    try {
      const { data, error } = await DatabaseService.getFeedback();
      
      if (error) {
        set({ error: error.message });
        return;
      }
      
      set({ feedback: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  loadMetrics: async () => {
    try {
      const { data, error } = await DatabaseService.getMetrics();
      
      if (error) {
        set({ error: error.message });
        return;
      }
      
      set({ metrics: data });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  subscribeToUpdates: () => {
    // Subscribe to conversations updates
    DatabaseService.subscribeToConversations((payload) => {
      const { conversations } = get();
      
      if (payload.eventType === 'INSERT') {
        set({ conversations: [payload.new, ...conversations] });
      } else if (payload.eventType === 'UPDATE') {
        set({
          conversations: conversations.map(conv =>
            conv.id === payload.new.id ? payload.new : conv
          )
        });
      } else if (payload.eventType === 'DELETE') {
        set({
          conversations: conversations.filter(conv => conv.id !== payload.old.id)
        });
      }
    });
    
    // Subscribe to feedback updates
    DatabaseService.subscribeToFeedback((payload) => {
      const { feedback } = get();
      
      if (payload.eventType === 'INSERT') {
        set({ feedback: [payload.new, ...feedback] });
      } else if (payload.eventType === 'UPDATE') {
        set({
          feedback: feedback.map(item =>
            item.id === payload.new.id ? payload.new : item
          )
        });
      } else if (payload.eventType === 'DELETE') {
        set({
          feedback: feedback.filter(item => item.id !== payload.old.id)
        });
      }
    });
  },
  
  unsubscribeFromUpdates: () => {
    // Supabase automatically handles cleanup when channels are removed
    supabase.removeAllChannels();
  }
}));

// Initialize auth state on app load
const initializeAuth = async () => {
  const { session } = await AuthService.getSession();
  
  if (session?.user) {
    const { profile } = await AuthService.getProfile(session.user.id);
    useAppStore.getState().setUser(session.user);
    useAppStore.getState().setProfile(profile);
    
    // Load dashboard data if user is authenticated
    await useAppStore.getState().loadDashboardData();
  }
};

// Listen to auth changes
AuthService.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    const { profile } = await AuthService.getProfile(session.user.id);
    useAppStore.getState().setUser(session.user);
    useAppStore.getState().setProfile(profile);
    await useAppStore.getState().loadDashboardData();
  } else if (event === 'SIGNED_OUT') {
    useAppStore.getState().setUser(null);
    useAppStore.getState().setProfile(null);
    useAppStore.getState().unsubscribeFromUpdates();
  }
});

// Initialize on module load
initializeAuth();