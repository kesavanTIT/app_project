import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

const AUTH_TOKEN_KEY = '@foodrush_token';
const USER_DATA_KEY  = '@foodrush_user';

export function AuthProvider({ children }) {
  const [token, setToken]     = useState(null);
  const [user, setUser]       = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Load persisted auth on app start ─────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
          AsyncStorage.getItem(USER_DATA_KEY),
        ]);
        if (storedToken) setToken(storedToken);
        if (storedUser)  setUser(JSON.parse(storedUser));
      } catch (err) {
        console.warn('[AuthContext] Failed to load stored auth:', err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ── Sign in ───────────────────────────────────────────────────────────────────
  const signIn = async (authToken, userData) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, authToken),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData)),
      ]);
      setToken(authToken);
      setUser(userData);
    } catch (err) {
      console.warn('[AuthContext] Failed to persist auth:', err.message);
      throw err;
    }
  };

  // ── Sign out ──────────────────────────────────────────────────────────────────
  const signOut = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_DATA_KEY),
      ]);
    } catch (err) {
      console.warn('[AuthContext] Failed to clear auth:', err.message);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  // ── Update user profile locally ───────────────────────────────────────────────
  const updateUser = async (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    setUser(merged);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(merged));
  };

  const value = {
    token,
    user,
    isLoading,
    isAuthenticated: !!token,
    signIn,
    signOut,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

export default AuthContext;
