import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  AuthContextType,
  AuthResponse,
  RegisterUser,
  User,
} from "../types/auth.types";

import { authLogin, authRegister } from "@/services/user.service";
import logger from "@/utils/logger";
import { useToast } from "@/hooks/use-toast";

import {
  getStoredAuth,
  saveStoredAuth,
  clearStoredAuth,
  setSelectedRole,
} from "@/utils/auth-storage";

import { initSessionKey } from "@/crypto/session";
import { publishEvent } from "@/lib/appEvents";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initialize = async () => {
      try {
        // ensure crypto key is ready BEFORE decrypting
        await initSessionKey();

        const storedUser = await getStoredAuth();

        if (storedUser) {
          setUser(storedUser);
        }
      } catch (err) {
        logger.error("Failed to restore session", err);
        clearStoredAuth();
      }
    };

    initialize();
  }, []);

  const login = async (userData: User) => {
    try {
      const resp = await authLogin(userData);

      if (resp.user?.role?.length === 1) {
        setSelectedRole(resp.user?.role?.at(0)?.id!);
      }
      setUser(resp);
      await saveStoredAuth(resp);
      publishEvent({ type: "LOGIN", userId: resp?.user?.userId! });
    } catch (err: any) {
      toast({
        title: "Invalid credentials",
        description: err?.message ?? "Login failed",
        variant: "destructive",
      });

      logger.error(err);
      throw err;
    }
  };

  const register = async (userData: RegisterUser) => {
    try {
      const resp = await authRegister(userData);

      setUser(resp);
      await saveStoredAuth(resp);
      publishEvent({ type: "LOGIN", userId: resp?.user?.userId! });
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err?.message ?? "Registration failed",
        variant: "destructive",
      });

      logger.error(err);
    }
  };

  const logout = () => {
    setUser(null);
    clearStoredAuth();
    publishEvent({ type: "LOGOUT" });
  };

  const updateTenant = async (tenantId: string) => {
    setUser((prev) => {
      if (!prev) return null;

      const updated: AuthResponse = {
        ...prev,
        user: {
          ...prev.user,
          tenantId,
        },
      };
      logger.info("updated tenant: ", updated);
      saveStoredAuth(updated).then(() => {
        publishEvent({ type: "COMPANY_CHANGED", companyId: tenantId });
      }).catch(logger.error);

      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updateTenant,
      }}
    >
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