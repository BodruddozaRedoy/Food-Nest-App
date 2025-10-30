import { getCurrentUser } from "@/lib/appwrite";
import { User } from "@/type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  hasHydrated: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;

  fetchAuthenticatedUser: () => Promise<void>;
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      isLoading: true,
      hasHydrated: false,

      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      setUser: (user) => set({ user }),
      setLoading: (value) => set({ isLoading: value }),

      fetchAuthenticatedUser: async () => {
        set({ isLoading: true });
        try {
          const user = (await getCurrentUser()) as unknown as User | null;
          if (user) {
            set({ isAuthenticated: true, user });
          } else {
            set({ isAuthenticated: false, user: null });
          }
        } catch (error: any) {
          if (error?.message?.includes("missing scopes")) {
            // not logged in → expected
            set({ isAuthenticated: false, user: null });
          } else {
            console.error("Appwrite error:", error);
          }
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      // ✅ closure captures `set` correctly here
      onRehydrateStorage: () => {
        console.log("🔄 Zustand store is rehydrating...");
        return () => {
          console.log("✅ Zustand rehydrated!");
          set<any>({ hasHydrated: true });
        };
      },
    }
  )
);

export default useAuthStore;
