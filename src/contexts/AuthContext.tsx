import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

interface Profile {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  user_type?: string;
  org_name?: string;
  reg_number?: string;
  vehicle_type?: string;
  license_number?: string;
  // Add other profile fields as needed
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getActiveSession = async () => {
      const { data: { session: activeSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error.message);
      }
      setSession(activeSession);
      setUser(activeSession?.user ?? null);
      setLoading(false);
    };

    getActiveSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error.message);
            setProfile(null);
          } else if (data) {
            setProfile(data as Profile);
          }
        } catch (e: any) {
          console.error('Exception when fetching profile:', e.message);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null); // Clear profile if no user
      }
    };

    fetchProfile();
  }, [user]);

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      // Potentially show a toast message for logout error
    } else {
      setSession(null);
      setUser(null);
      setProfile(null);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
