import secureLocalStorage from "react-secure-storage";
import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  isChecking: boolean;
  checkAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isChecking: true,
  checkAuth: () => {
    const token = secureLocalStorage.getItem("access_token");
    set({ isAuthenticated: !!token, isChecking: false });
  },
}));

export default useAuthStore;
