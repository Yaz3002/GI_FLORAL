import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    // Get initial session with error handling
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // If there's an error or no valid session/user, clear any stale auth data
        if (error || !session || !session.user) {
          await supabase.auth.signOut();
          setAuthState({
            user: null,
            session: null,
            loading: false,
          });
        } else {
          setAuthState({
            user: session.user,
            session,
            loading: false,
          });
        }
      } catch (error) {
        // Handle any unexpected errors by clearing auth state
        console.error('Auth initialization error:', error);
        await supabase.auth.signOut();
        setAuthState({
          user: null,
          session: null,
          loading: false,
        });
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    ...authState,
    signIn,
    signOut,
  };
};