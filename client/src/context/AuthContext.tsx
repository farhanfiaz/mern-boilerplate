import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
import { useAppEvents } from "@/hooks/useAppEvents";
import { persistTenantChange } from "@/utils/tenant-sync";
import type { AppEvent } from "@/types/appEvents";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const { toast } = useToast();

  const handleAppEvent = useCallback(async (event: AppEvent) => {
    if (event.type === "USER_UPDATED") {
      const storedUser = await getStoredAuth();

      setUser((prev) => {
        if (
          JSON.stringify(prev) === JSON.stringify(storedUser)
        ) {
          return prev;
        }

        return storedUser;
      });
    }
  }, []);

  useAppEvents(handleAppEvent);

  useEffect(() => {
    const initialize = async () => {
      try {
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

  const login = useCallback(
    async (userData: User) => {
      try {
        const resp = await authLogin(userData);

        if (resp.user?.role?.length === 1) {
          setSelectedRole(resp.user.role[0].id);
        }

        setUser(resp);

        await saveStoredAuth(resp);

        publishEvent({
          type: "LOGIN",
          userId: resp.user.userId,
        });
      } catch (err: any) {
        toast({
          title: "Invalid credentials",
          description: err?.message ?? "Login failed",
          variant: "destructive",
        });

        logger.error(err);
        throw err;
      }
    },
    [toast]
  );

  const register = useCallback(
    async (userData: RegisterUser) => {
      try {
        const resp = await authRegister(userData);

        if (resp.user?.role?.length === 1) {
          setSelectedRole(resp.user.role[0].id);
        }
        
        setUser(resp);

        await saveStoredAuth(resp);

        publishEvent({
          type: "LOGIN",
          userId: resp.user.userId,
        });
      } catch (err: any) {
        toast({
          title: "Registration failed",
          description: err?.message ?? "Registration failed",
          variant: "destructive",
        });

        logger.error(err);
      }
    },
    [toast]
  );

  const logout = useCallback(() => {
    setUser(null);
    
    clearStoredAuth();

    publishEvent({
      type: "LOGOUT",
    });
  }, []);

  const updateTenant = useCallback(
    async (tenantId: string) => {
      if (!user) return;

      const updated = await persistTenantChange(user, tenantId, {
        saveStoredAuth,
        publishEvent,
      });

      setUser(updated);
    },
    [user]
  );

  const contextValue = useMemo(
    () => ({
      user,
      login,
      logout,
      register,
      updateTenant,
    }),
    [user, login, logout, register, updateTenant]
  );

  return (
    <AuthContext.Provider value={contextValue}>
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