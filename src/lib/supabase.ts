import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      travelers: {
        Row: Traveler;
        Insert: Omit<Traveler, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Traveler, 'id' | 'created_at' | 'updated_at'>>;
      };
      ai_conversations: {
        Row: AIConversation;
        Insert: Omit<AIConversation, 'id' | 'created_at' | 'updated_at' | 'last_message_at'>;
        Update: Partial<Omit<AIConversation, 'id' | 'created_at' | 'updated_at'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'>;
        Update: Partial<Omit<Message, 'id' | 'created_at'>>;
      };
      feedback: {
        Row: Feedback;
        Insert: Omit<Feedback, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Feedback, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Enums: {
      user_role: 'admin' | 'agent';
      traveler_status: 'pre_departure' | 'traveling' | 'completed';
      conversation_status: 'active' | 'escalated' | 'resolved';
      conversation_priority: 'low' | 'medium' | 'high' | 'urgent';
      message_sender_type: 'ai' | 'traveler' | 'agent';
      feedback_type: 'complaint' | 'suggestion' | 'ticket' | 'compliment';
      feedback_priority: 'low' | 'medium' | 'high' | 'urgent';
      feedback_status: 'open' | 'in_progress' | 'resolved' | 'closed';
    };
  };
}

// Type definitions
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'agent';
  created_at: string;
  updated_at: string;
}

export interface Traveler {
  id: string;
  name: string;
  email: string;
  phone?: string;
  booking_id: string;
  destination: string;
  travel_dates: {
    departure: string;
    return: string;
  };
  status: 'pre_departure' | 'traveling' | 'completed';
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AIConversation {
  id: string;
  traveler_id: string;
  agent_id?: string;
  status: 'active' | 'escalated' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sentiment_score: number;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender_type: 'ai' | 'traveler' | 'agent';
  sender_id: string;
  confidence_score?: number;
  requires_attention: boolean;
  created_at: string;
}

export interface Feedback {
  id: string;
  traveler_id: string;
  type: 'complaint' | 'suggestion' | 'ticket' | 'compliment';
  subject: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  sentiment_score: number;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface AIMetrics {
  active_conversations: number;
  avg_response_time: number;
  satisfaction_score: number;
  issue_resolution_rate: number;
  today_interactions: number;
  escalation_rate: number;
}

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    role?: string;
  };
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  role?: 'admin' | 'agent';
}

export interface SignInData {
  email: string;
  password: string;
}