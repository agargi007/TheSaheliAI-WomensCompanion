import { create } from 'zustand';

export type Language = 'en' | 'hi' | 'mr';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  
  isDisguiseMode: boolean;
  setDisguiseMode: (active: boolean) => void;
  
  isEmergencySOS: boolean;
  triggerEmergencySOS: () => void;
  cancelEmergencySOS: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE as Language) || 'hi',
  setLanguage: (language) => set({ language }),

  isDisguiseMode: false,
  setDisguiseMode: (isDisguiseMode) => set({ isDisguiseMode }),

  isEmergencySOS: false,
  triggerEmergencySOS: () => set({ isEmergencySOS: true }),
  cancelEmergencySOS: () => set({ isEmergencySOS: false }),
}));
