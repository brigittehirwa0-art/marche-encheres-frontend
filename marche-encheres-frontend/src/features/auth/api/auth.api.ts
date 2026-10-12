import { api, setToken, getToken } from '@/core/api-client';
import type { User } from '@/core/types';

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    setToken(response.data.token);
    return response.data.user;
  },
  register: async (name: string, email: string, password: string, city: string) => {
    const response = await api.post<AuthResponse>('/auth/register', { name, email, password, city });
    setToken(response.data.token);
    return response.data.user;
  },
  logout: async () => {
    setToken(null);
  },
  currentUser: async (): Promise<User | null> => {
    const token = getToken();
    if (!token) return null;
    try {
      // For now, decode token to get user info
      // In production, you might want a /me endpoint
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        avatar: '',
        city: '',
      };
    } catch {
      return null;
    }
  },
};
