import { supabase, Profile, SignUpData, SignInData } from './supabase';
import { AuthError, User } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  profile: Profile | null;
  error: AuthError | Error | null;
}

/**
 * Authentication service class
 * Handles all authentication operations with Supabase
 */
export class AuthService {
  /**
   * Sign up a new user with email and password
   */
  static async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: data.role || 'agent'
          }
        }
      });

      if (authError) {
        return { user: null, profile: null, error: authError };
      }

      if (!authData.user) {
        return { 
          user: null, 
          profile: null, 
          error: new Error('User creation failed') 
        };
      }

      // Get the created profile
      const profile = await this.getProfile(authData.user.id);

      return {
        user: authData.user,
        profile: profile.profile,
        error: profile.error
      };
    } catch (error) {
      return {
        user: null,
        profile: null,
        error: error as Error
      };
    }
  }

  /**
   * Sign in with email and password
   */
  static async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError) {
        return { user: null, profile: null, error: authError };
      }

      if (!authData.user) {
        return { 
          user: null, 
          profile: null, 
          error: new Error('Sign in failed') 
        };
      }

      // Get the user profile
      const profile = await this.getProfile(authData.user.id);

      return {
        user: authData.user,
        profile: profile.profile,
        error: profile.error
      };
    } catch (error) {
      return {
        user: null,
        profile: null,
        error: error as Error
      };
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  /**
   * Get current session
   */
  static async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  }

  /**
   * Get user profile by ID
   */
  static async getProfile(userId: string): Promise<{ profile: Profile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { profile: null, error: new Error(error.message) };
      }

      return { profile: data, error: null };
    } catch (error) {
      return { profile: null, error: error as Error };
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, updates: Partial<Profile>): Promise<{ profile: Profile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { profile: null, error: new Error(error.message) };
      }

      return { profile: data, error: null };
    } catch (error) {
      return { profile: null, error: error as Error };
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { error };
  }

  /**
   * Update password
   */
  static async updatePassword(password: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}