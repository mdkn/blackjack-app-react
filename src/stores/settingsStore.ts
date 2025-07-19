import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GameSettings {
  // Game Rules
  dealerHitsOnSoft17: boolean;
  blackjackPayout: number; // 1.5 for 3:2, 1.2 for 6:5
  insuranceEnabled: boolean;
  surrenderEnabled: boolean;

  // UI/UX Settings
  animationSpeed: "slow" | "normal" | "fast" | "instant";
  cardSize: "small" | "medium" | "large";
  soundEnabled: boolean;
  soundVolume: number; // 0-100

  // Betting Settings
  defaultBet: number;
  maxBet: number;
  betIncrements: number[];

  // Accessibility
  highContrast: boolean;
  reducedMotion: boolean;

  // Deck Settings
  numberOfDecks: 1 | 4 | 6 | 8;
  shufflePoint: number; // Percentage of deck when to shuffle (75% = shuffle when 25% cards left)
}

export interface SettingsStore {
  settings: GameSettings;
  updateSetting: <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) => void;
  resetToDefaults: () => void;
  getAnimationDuration: () => number;
}

const defaultSettings: GameSettings = {
  // Game Rules (standard Las Vegas rules)
  dealerHitsOnSoft17: true,
  blackjackPayout: 1.5, // 3:2 payout
  insuranceEnabled: true,
  surrenderEnabled: false,

  // UI/UX Settings
  animationSpeed: "normal",
  cardSize: "medium",
  soundEnabled: true,
  soundVolume: 70,

  // Betting Settings
  defaultBet: 25,
  maxBet: 500,
  betIncrements: [5, 10, 25, 50, 100],

  // Accessibility
  highContrast: false,
  reducedMotion: false,

  // Deck Settings
  numberOfDecks: 6,
  shufflePoint: 75, // Shuffle when 25% cards remain
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: defaultSettings,

      updateSetting: <K extends keyof GameSettings>(
        key: K,
        value: GameSettings[K]
      ) => {
        set(state => ({
          settings: {
            ...state.settings,
            [key]: value,
          },
        }));
      },

      resetToDefaults: () => {
        set({ settings: { ...defaultSettings } });
      },

      getAnimationDuration: () => {
        const { animationSpeed } = get().settings;
        switch (animationSpeed) {
          case "instant":
            return 0;
          case "fast":
            return 200;
          case "normal":
            return 400;
          case "slow":
            return 800;
          default:
            return 400;
        }
      },
    }),
    {
      name: "blackjack-settings",
      version: 1,
    }
  )
);
