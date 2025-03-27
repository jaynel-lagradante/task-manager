import { create } from 'zustand';

interface Auth {
    isAuthenticated: boolean;
    setAuth: (status: boolean) => void;
}

export const useAuthState = create<Auth>((set) => ({
    isAuthenticated: true,
    setAuth: (status) => set({ isAuthenticated: status }),
}));

export const selectIsAuthenticated = (state: Auth) => state.isAuthenticated;
