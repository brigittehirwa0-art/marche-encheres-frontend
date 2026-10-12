import { useState, useEffect } from 'react';
import { authApi } from '../api';
import type { User } from '../../../core/types';

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

export function useAuthStore(): AuthStore {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await authApi.currentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  return { user, setUser, isLoading };
}