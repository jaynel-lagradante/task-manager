import { create } from 'zustand';

interface Auth {
    isAuthenticated: boolean;
    setAuth: (loading: boolean) => void;
}

export const useAuthState = create<Auth>((set) => ({
    isAuthenticated: false,
    setAuth: (status) => set({ isAuthenticated: status }),
}));

export const selectIsAuthenticated = (state: Auth) => state.isAuthenticated;
