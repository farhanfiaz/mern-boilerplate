import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthContextType, AuthResponse, RegisterUser, User } from "../types/auth.types";
import { authLogin, authRegister } from "@/services/user.service";
import logger from "@/utils/logger";
import { ENDPOINTS } from "@/api/endpoints";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem(ENDPOINTS.SYSTEM.LOCALSTORAGEKEY);
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (userData: User) => {
    authLogin(userData).then((resp: AuthResponse) => {
      setUser(resp);
      localStorage.setItem(ENDPOINTS.SYSTEM.LOCALSTORAGEKEY, JSON.stringify(resp));
    }).catch((err) => {
      toast({
        title: "Invalid credentials",
        description: err.message,
        variant: "destructive"
      });
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
        toast({
          title: "Invalid credentials",
          description: err.message,
          variant: "destructive"
        });
        logger.error(err);
      });
  }

  const updateTenant = (tenantId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        user: {
          ...prev.user,
          tenantId,
        },
      };
      localStorage.setItem(ENDPOINTS.SYSTEM.LOCALSTORAGEKEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateTenant }}>
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