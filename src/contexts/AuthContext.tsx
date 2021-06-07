import { useState, createContext, ReactNode, useEffect } from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import Router from 'next/router';

import { api } from 'services/apiClient';

type User = {
  id: string;
  login: string;
  email: string;
  name: string;
  enabled: boolean;
  role: string;
};

type LoginResponse = {
  user: User;
  token: string;
  refreshToken: string;
};

type SignInCredentials = {
  login: string;
  password: string;
};

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, 'ienvironment.token');
  destroyCookie(undefined, 'ienvironment.refreshToken');

  authChannel.postMessage('signOut');

  Router.push('/');
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          signOut();
          break;
        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    const { 'ienvironment.token': token } = parseCookies();

    if (token) {
      api
        .get('user/me')
        .then((response) => {
          console.log(response.data);
          const { id, name, login, email, role, enabled } = response.data.user;

          setUser({ id, name, login, email, role, enabled });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  async function signIn({ login, password }: SignInCredentials) {
    try {
      const response = await api.post<LoginResponse>('user/login', {
        login,
        password,
      });

      const { token, refreshToken, user } = response.data;
      console.log(response);

      setCookie(undefined, 'ienvironment.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
      setCookie(undefined, 'ienvironment.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setUser({
        id: user.id,
        name: user.name,
        login: user.login,
        email: user.email,
        enabled: user.enabled,
        role: user.role,
      });

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push('/dashboard');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
