import { supabase, Traveler, AIConversation, Message, Feedback, AIMetrics } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Database service class
 * Handles all database operations with proper error handling and type safety
 */
export class DatabaseService {
  // Travelers
  static async getTravelers(): Promise<{ data: Traveler[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('travelers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  static async getTravelerById(id: string): Promise<{ data: Traveler | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('travelers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  static async createTraveler(traveler: Omit<Traveler, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Traveler | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('travelers')
        .insert(traveler)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  static async updateTraveler(id: string, updates: Partial<Traveler>): Promise<{ data: Traveler | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('travelers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  // Conversations
  static async getConversations(): Promise<{ data: AIConversation[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select(`
          *,
          travelers (
            id,
            name,
            email,
            destination
          )
        `)
        .order('last_message_at', { ascending: false });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  static async getConversationById(id: string): Promise<{ data: AIConversation | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select(`
          *,
          travelers (
            id,
            name,
            email,
            destination
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  static async createConversation(conversation: Omit<AIConversation, 'id' | 'created_at' | 'updated_at' | 'last_message_at'>): Promise<{ data: AIConversation | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert(conversation)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  static async updateConversation(id: string, updates: Partial<AIConversation>): Promise<{ data: AIConversation | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  // Messages
  static async getMessages(conversationId: string): Promise<{ data: Message[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  static async createMessage(message: Omit<Message, 'id' | 'created_at'>): Promise<{ data: Message | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  // Feedback
  static async getFeedback(): Promise<{ data: Feedback[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          travelers (
            id,
            name,
            email,
            destination
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  static async createFeedback(feedback: Omit<Feedback, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Feedback | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .insert(feedback)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  static async updateFeedback(id: string, updates: Partial<Feedback>): Promise<{ data: Feedback | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  // Analytics and Metrics
  static async getMetrics(): Promise<{ data: AIMetrics | null; error: Error | null }> {
    try {
      // Get active conversations count
      const { count: activeConversations } = await supabase
        .from('ai_conversations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get today's interactions
      const today = new Date().toISOString().split('T')[0];
      const { count: todayInteractions } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`);

      // Get escalation rate
      const { count: totalConversations } = await supabase
        .from('ai_conversations')
        .select('*', { count: 'exact', head: true });

      const { count: escalatedConversations } = await supabase
        .from('ai_conversations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'escalated');

      // Calculate metrics
      const metrics: AIMetrics = {
        active_conversations: activeConversations || 0,
        avg_response_time: 2.3, // This would be calculated from actual response times
        satisfaction_score: 4.7, // This would come from feedback ratings
        issue_resolution_rate: 94.2, // This would be calculated from resolved vs total issues
        today_interactions: todayInteractions || 0,
        escalation_rate: totalConversations ? ((escalatedConversations || 0) / totalConversations) * 100 : 0
      };

      return { data: metrics, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  // Real-time subscriptions
  static subscribeToConversations(callback: (payload: any) => void): RealtimeChannel {
    return supabase
      .channel('conversations')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ai_conversations'
      }, callback)
      .subscribe();
  }

  static subscribeToMessages(conversationId: string, callback: (payload: any) => void): RealtimeChannel {
    return supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, callback)
      .subscribe();
  }

  static subscribeToFeedback(callback: (payload: any) => void): RealtimeChannel {
    return supabase
      .channel('feedback')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'feedback'
      }, callback)
      .subscribe();
  }

  // Utility functions
  static async searchTravelers(query: string): Promise<{ data: Traveler[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('travelers')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,destination.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }

  static async getTravelersByDestination(destination: string): Promise<{ data: Traveler[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('travelers')
        .select('*')
        .eq('destination', destination)
        .order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as Error };
    }
  }
}