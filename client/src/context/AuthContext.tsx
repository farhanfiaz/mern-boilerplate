import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthContextType, AuthResponse, RegisterUser, User } from "../types/auth.types";
import { authLogin, authRegister } from "@/services/user.service";
import logger from "@/utils/logger";
import { showError } from "@/utils/toast";
import { ENDPOINTS } from "@/api/endpoints";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthResponse | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(ENDPOINTS.SYSTEM.LOCALSTORAGEKEY);
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (userData: User) => {
    authLogin(userData).then((resp: AuthResponse) => {
      setUser(resp);
      localStorage.setItem(ENDPOINTS.SYSTEM.LOCALSTORAGEKEY, JSON.stringify(resp));
    }).catch((err) => {
      showError(err.message);
      logger.error(err);
      throw err;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(ENDPOINTS.SYSTEM.LOCALSTORAGEKEY);
  };

  const register = (userData: RegisterUser) => {
    authRegister(userData)
      .then((resp: AuthResponse) => {
        setUser(resp);
        localStorage.setItem(ENDPOINTS.SYSTEM.LOCALSTORAGEKEY, JSON.stringify(resp));
      })
      .catch((err) => {
        showError(err.message);
        logger.error(err);
      });
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};