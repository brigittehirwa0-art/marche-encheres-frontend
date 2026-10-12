const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

let token: string | null = localStorage.getItem('token');

export function setToken(newToken: string | null) {
  token = newToken;
  if (newToken) {
    localStorage.setItem('token', newToken);
  } else {
    localStorage.removeItem('token');
  }
}

export function getToken(): string | null {
  return token;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || error.error || 'Request failed');
  }

  return response.json();
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, data?: unknown) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  upload: async <T>(endpoint: string, files: File[]): Promise<T> => {
    const body = new FormData();
    files.forEach((file) => body.append('images', file));
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'POST', headers, body });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload impossible' }));
      throw new Error(error.message || error.error || 'Upload impossible');
    }
    return response.json();
  },
  put: <T>(endpoint: string, data?: unknown) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
