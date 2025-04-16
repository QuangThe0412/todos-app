import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  checkAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  checkAuth: () => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        if (parsedUser && parsedUser.id) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        set({ isAuthenticated: false });
      }
    } else {
      set({ isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
