import { useEffect } from "react";
import { useSettingsStore } from "../stores";
import { soundManager, SoundEffect } from "../lib/sounds";

export interface UseSoundReturn {
  playSound: (effect: SoundEffect, volume?: number) => Promise<void>;
  isEnabled: boolean;
  volume: number;
}

export const useSound = (): UseSoundReturn => {
  const { settings } = useSettingsStore();

  // Update sound manager when settings change
  useEffect(() => {
    soundManager.setEnabled(settings.soundEnabled);
    soundManager.setVolume(settings.soundVolume);
  }, [settings.soundEnabled, settings.soundVolume]);

  const playSound = async (
    effect: SoundEffect,
    volume?: number
  ): Promise<void> => {
    if (!settings.soundEnabled) return;
    return soundManager.play(effect, volume);
  };

  return {
    playSound,
    isEnabled: settings.soundEnabled,
    volume: settings.soundVolume,
  };
};
