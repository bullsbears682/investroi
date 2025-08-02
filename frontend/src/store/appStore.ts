import { create } from 'zustand';

interface AppState {
  isLoading: boolean;
  sessionId: string;
  setLoading: (loading: boolean) => void;
  setSessionId: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: true,
  sessionId: '',
  setLoading: (loading) => set({ isLoading: loading }),
  setSessionId: (id) => set({ sessionId: id }),
}));