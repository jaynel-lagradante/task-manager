import { create } from 'zustand';

interface Auth {
    isAuthenticated: boolean;
    token: boolean;
    setAuth: (status: boolean) => void;
    setToken: (token: boolean) => void;
}

export const useAuthState = create<Auth>((set) => ({
    isAuthenticated: false,
    token: true,
    setAuth: (status) => set({ isAuthenticated: status }),
    setToken: (token) => set({ token }),
}));

export const selectIsAuthenticated = (state: Auth) => state.isAuthenticated;
export const selectToken = (statue: Auth) => statue.token;
