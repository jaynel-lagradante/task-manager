import { create } from 'zustand';

interface Loading {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useLoadingState = create<Loading>((set) => ({
    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading }),
}));

export const selectIsLoading = (state: Loading) => state.isLoading;
