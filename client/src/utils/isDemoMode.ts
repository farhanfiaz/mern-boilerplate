export const isDemoMode = (): boolean => {
  return (
    import.meta.env.VITE_DEMO_MODE === "true" ||
    (typeof window !== "undefined" && !window.crypto?.subtle)
  );
};