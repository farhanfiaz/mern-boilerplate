import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type DesktopSidebarContextValue = {
  isDesktopCollapsed: boolean;
  setDesktopCollapsed: (value: boolean) => void;
  toggleDesktopSidebar: () => void;
};

const DesktopSidebarContext =
  createContext<DesktopSidebarContextValue | null>(null);

export function DesktopSidebarProvider({ children }: { children: ReactNode }) {
  const [isDesktopCollapsed, setDesktopCollapsed] = useState(false);
  const toggleDesktopSidebar = useCallback(() => {
    setDesktopCollapsed((prev) => !prev);
  }, []);

  const value = useMemo<DesktopSidebarContextValue>(
    () => ({
      isDesktopCollapsed,
      setDesktopCollapsed,
      toggleDesktopSidebar,
    }),
    [isDesktopCollapsed, toggleDesktopSidebar]
  );

  return (
    <DesktopSidebarContext.Provider value={value}>
      {children}
    </DesktopSidebarContext.Provider>
  );
}

export function useDesktopSidebarOptional() {
  return useContext(DesktopSidebarContext);
}
