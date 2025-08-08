import { create } from 'zustand';

interface AppState {
  isLoading: boolean;
  sessionId: string;
  setLoading: (loading: boolean) => void;
  setSessionId: (id: string) => void;
}

export const useAppStore = create<AppState>((set: any) => ({
  isLoading: true,
  sessionId: '',
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setSessionId: (id: string) => set({ sessionId: id }),
}));