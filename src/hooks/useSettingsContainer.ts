import { useState } from "react";
import { useSettingsStore, GameSettings } from "../stores/settingsStore";

export interface UseSettingsContainerReturn {
  settings: GameSettings;
  hasChanges: boolean;
  handleSettingChange: <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) => void;
  handleReset: () => void;
  handleSave: () => void;
}

export const useSettingsContainer = (): UseSettingsContainerReturn => {
  const { settings, updateSetting, resetToDefaults } = useSettingsStore();
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = <K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ) => {
    updateSetting(key, value);
    setHasChanges(true);
  };

  const handleReset = () => {
    resetToDefaults();
    setHasChanges(false);
  };

  const handleSave = () => {
    setHasChanges(false);
  };

  return {
    settings,
    hasChanges,
    handleSettingChange,
    handleReset,
    handleSave,
  };
};
