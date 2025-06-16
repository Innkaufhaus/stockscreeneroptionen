import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  full_name: string | null;
  is_superuser: boolean;
  subscription_tier: string;
  subscription_status: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const formData = new FormData();
          formData.append('username', email);
          formData.append('password', password);

          const response = await axios.post('/api/v1/auth/login', formData);
          const { access_token } = response.data;

          // Get user data
          const userResponse = await axios.get('/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${access_token}` },
          });

          set({
            user: userResponse.data,
            token: access_token,
            isAuthenticated: true,
          });

          // Set default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        }
      },

      register: async (email: string, password: string, full_name: string) => {
        try {
          const response = await axios.post('/api/v1/auth/register', {
            email,
            password,
            full_name,
          });

          // After registration, log the user in
          await useAuth.getState().login(email, password);
        } catch (error) {
          console.error('Registration error:', error);
          throw error;
        }
      },

      logout: async () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        delete axios.defaults.headers.common['Authorization'];
      },

      checkAuth: async () => {
        const token = useAuth.getState().token;
        if (!token) return;

        try {
          const response = await axios.get('/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({
            user: response.data,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Auth check error:', error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          delete axios.defaults.headers.common['Authorization'];
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export { useAuth }; 