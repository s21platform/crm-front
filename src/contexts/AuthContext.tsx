import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { ApiRoutes } from '../lib/routes';

interface AuthContextType {
  isAuthenticated: boolean;
  user: Staff | null;
  login: (login: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface Staff {
  id: string;
  login: string;
  role_id: number;
  role_name: string;
  permissions: {
    access: string[];
  };
  created_at: number;
  updated_at: number;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  staff: Staff;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем токен при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const expiresAt = localStorage.getItem('expires_at');
        const savedUser = localStorage.getItem('user');

        if (accessToken && refreshToken && expiresAt && savedUser) {
          const now = new Date();
          const expires = new Date(parseInt(expiresAt) * 1000);
          
          const timeLeftMinutes = Math.floor((expires.getTime() - now.getTime()) / (1000 * 60));
          
          console.log({
            now: now.toISOString(),
            expires: expires.toISOString(),
            timeLeft: `${timeLeftMinutes} минут`
          });

          if (now < expires) {
            setIsAuthenticated(true);
            setUser(JSON.parse(savedUser));
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          } else {
            console.log('Токен истек:', {
              now: now.toISOString(),
              expires: expires.toISOString(),
              difference: (expires.getTime() - now.getTime()) / 1000 / 60
            });
            logout();
          }
        } else {
          console.log('Отсутствуют данные авторизации:', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            hasExpiresAt: !!expiresAt,
            hasUser: !!savedUser
          });
          logout();
        }
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (login: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await axios.post<LoginResponse>(
        ApiRoutes.auth.login(),
        { login, password }
      );

      const { access_token, refresh_token, expires_at, staff } = response.data;
      
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('expires_at', expires_at.toString());
      localStorage.setItem('user', JSON.stringify(staff));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setIsAuthenticated(true);
      setUser(staff);
      
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Ошибка авторизации:', {
          status: error.response?.status,
          data: error.response?.data
        });
      } else {
        console.error('Неизвестная ошибка:', error);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
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