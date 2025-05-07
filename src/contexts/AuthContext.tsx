import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('email', email)
        .eq('password', password);

      if (error) {
        console.error('Erreur de connexion:', error);
        toast.error('Erreur lors de la connexion');
        return false;
      }

      if (!data || data.length === 0) {
        toast.error('Email ou mot de passe incorrect');
        return false;
      }

      if (data.length > 1) {
        console.error('Multiple users found with the same email:', email);
        toast.error('Erreur de connexion');
        return false;
      }

      const { password: _, ...userWithoutPassword } = data[0];
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success('Connexion réussie');
      return true;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      toast.error('Erreur lors de la connexion');
      return false;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select()
        .eq('email', email)
        .single();

      if (existingUser) {
        toast.error('Cet email est déjà utilisé');
        return false;
      }

      const { data, error } = await supabase
        .from('users')
        .insert([{ username, email, password, is_admin: false }])
        .select()
        .single();

      if (error) {
        console.error('Erreur d\'inscription:', error);
        return false;
      }

      if (data) {
        const { password: _, ...userWithoutPassword } = data;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};