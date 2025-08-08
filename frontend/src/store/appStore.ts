import { create } from 'zustand';

interface AppState {
  isLoading: boolean;
  sessionId: string;
  setLoading: (loading: boolean) => void;
  setSessionId: (id: string) => void;
  demoActive: boolean;
  demoExpiresAt: number | null;
  activateDemo: (days?: number) => void;
  deactivateDemo: () => void;
  refreshDemoFromStorage: () => void;
}

const DEMO_KEY = 'demo_subscription';

function readDemo(): { active: boolean; expiresAt: number | null } {
  try {
    const raw = localStorage.getItem(DEMO_KEY);
    if (!raw) return { active: false, expiresAt: null };
    const parsed = JSON.parse(raw);
    const now = Date.now();
    if (parsed.expiresAt && now > parsed.expiresAt) {
      localStorage.removeItem(DEMO_KEY);
      return { active: false, expiresAt: null };
    }
    return { active: !!parsed.active, expiresAt: parsed.expiresAt ?? null };
  } catch {
    return { active: false, expiresAt: null };
  }
}

export const useAppStore = create<AppState>((set: any) => ({
  isLoading: true,
  sessionId: '',
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setSessionId: (id: string) => set({ sessionId: id }),
  demoActive: false,
  demoExpiresAt: null,
  activateDemo: (days: number = 7) => {
    const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(DEMO_KEY, JSON.stringify({ active: true, expiresAt }));
    set({ demoActive: true, demoExpiresAt: expiresAt });
    window.dispatchEvent(new Event('demoChanged'));
  },
  deactivateDemo: () => {
    localStorage.removeItem(DEMO_KEY);
    set({ demoActive: false, demoExpiresAt: null });
    window.dispatchEvent(new Event('demoChanged'));
  },
  refreshDemoFromStorage: () => {
    const { active, expiresAt } = readDemo();
    set({ demoActive: active, demoExpiresAt: expiresAt });
  },
}));