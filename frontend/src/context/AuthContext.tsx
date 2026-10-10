import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { authService } from "../services/auth.service";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("codementor_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("codementor_token") || null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          setUser(res.user);
          localStorage.setItem("codementor_user", JSON.stringify(res.user));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email: string, pass: string) => {
    const res = await authService.login({ email, password: pass });
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem("codementor_token", res.token);
    localStorage.setItem("codementor_user", JSON.stringify(res.user));
  };

  const register = async (name: string, email: string, pass: string) => {
    const res = await authService.register({ name, email, password: pass });
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem("codementor_token", res.token);
    localStorage.setItem("codementor_user", JSON.stringify(res.user));
  };

  const demoLogin = async () => {
    await login("demo@codementor.ai", "Password123!");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("codementor_token");
    localStorage.removeItem("codementor_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
