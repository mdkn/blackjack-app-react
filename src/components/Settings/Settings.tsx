import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Volume2,
  VolumeX,
  Eye,
  DollarSign,
  Shuffle,
  RotateCcw,
  Save,
  X,
} from "lucide-react";
import { useSettingsStore, GameSettings } from "../../stores/settingsStore";
import { useAnimations } from "../../hooks";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

interface SettingSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SettingSection = ({ title, icon, children }: SettingSectionProps) => (
  <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Toggle = ({ label, description, checked, onChange }: ToggleProps) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="text-white font-medium">{label}</div>
      {description && (
        <div className="text-gray-400 text-sm">{description}</div>
      )}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        checked ? "bg-blue-600" : "bg-gray-600"
      }`}
    >
      <div
        className={`absolute w-5 h-5 bg-white rounded-full transition-transform top-0.5 ${
          checked ? "translate-x-6" : "translate-x-0.5"
        }`}
      />
    </button>
  </div>
);

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

const Slider = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: SliderProps) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <span className="text-white font-medium">{label}</span>
      <span className="text-gray-400">
        {value}
        {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
    />
  </div>
);

interface SelectProps {
  label: string;
  value: string | number;
  options: Array<{ value: string | number; label: string }>;
  onChange: (value: string | number) => void;
}

const Select = ({ label, value, options, onChange }: SelectProps) => (
  <div>
    <label className="block text-white font-medium mb-2">{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-gray-600 text-white border border-gray-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export const Settings = ({
  isOpen,
  onClose,
  className = "",
}: SettingsProps) => {
  const { settings, updateSetting, resetToDefaults } = useSettingsStore();
  const [hasChanges, setHasChanges] = useState(false);
  const { modal } = useAnimations();

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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className={`bg-gray-800 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden ${className}`}
        variants={modal}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <SettingsIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Game Settings</h2>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Game Rules */}
            <SettingSection
              title="Game Rules"
              icon={<Shuffle className="w-5 h-5 text-purple-400" />}
            >
              <Toggle
                label="Dealer Hits on Soft 17"
                description="Standard rule in most casinos"
                checked={settings.dealerHitsOnSoft17}
                onChange={value =>
                  handleSettingChange("dealerHitsOnSoft17", value)
                }
              />

              <Select
                label="Blackjack Payout"
                value={settings.blackjackPayout}
                options={[
                  { value: 1.5, label: "3:2 (Traditional)" },
                  { value: 1.2, label: "6:5 (Modern)" },
                ]}
                onChange={value =>
                  handleSettingChange("blackjackPayout", Number(value))
                }
              />

              <Toggle
                label="Insurance Available"
                description="Allow insurance bets when dealer shows Ace"
                checked={settings.insuranceEnabled}
                onChange={value =>
                  handleSettingChange("insuranceEnabled", value)
                }
              />

              <Toggle
                label="Surrender Allowed"
                description="Allow early surrender option"
                checked={settings.surrenderEnabled}
                onChange={value =>
                  handleSettingChange("surrenderEnabled", value)
                }
              />
            </SettingSection>

            {/* Deck Settings */}
            <SettingSection
              title="Deck Configuration"
              icon={<Shuffle className="w-5 h-5 text-green-400" />}
            >
              <Select
                label="Number of Decks"
                value={settings.numberOfDecks}
                options={[
                  { value: 1, label: "Single Deck" },
                  { value: 4, label: "4 Decks" },
                  { value: 6, label: "6 Decks (Standard)" },
                  { value: 8, label: "8 Decks" },
                ]}
                onChange={value =>
                  handleSettingChange(
                    "numberOfDecks",
                    Number(value) as 1 | 4 | 6 | 8
                  )
                }
              />

              <Slider
                label="Shuffle Point"
                value={settings.shufflePoint}
                min={50}
                max={90}
                step={5}
                unit="%"
                onChange={value => handleSettingChange("shufflePoint", value)}
              />
            </SettingSection>

            {/* UI/UX Settings */}
            <SettingSection
              title="Interface"
              icon={<Eye className="w-5 h-5 text-blue-400" />}
            >
              <Select
                label="Animation Speed"
                value={settings.animationSpeed}
                options={[
                  { value: "instant", label: "Instant" },
                  { value: "fast", label: "Fast" },
                  { value: "normal", label: "Normal" },
                  { value: "slow", label: "Slow" },
                ]}
                onChange={value =>
                  handleSettingChange(
                    "animationSpeed",
                    value as "slow" | "normal" | "fast" | "instant"
                  )
                }
              />

              <Select
                label="Card Size"
                value={settings.cardSize}
                options={[
                  { value: "small", label: "Small" },
                  { value: "medium", label: "Medium" },
                  { value: "large", label: "Large" },
                ]}
                onChange={value =>
                  handleSettingChange(
                    "cardSize",
                    value as "small" | "medium" | "large"
                  )
                }
              />

              <Toggle
                label="High Contrast Mode"
                description="Enhanced visibility for better accessibility"
                checked={settings.highContrast}
                onChange={value => handleSettingChange("highContrast", value)}
              />

              <Toggle
                label="Reduced Motion"
                description="Minimize animations for motion sensitivity"
                checked={settings.reducedMotion}
                onChange={value => handleSettingChange("reducedMotion", value)}
              />
            </SettingSection>

            {/* Sound Settings */}
            <SettingSection
              title="Audio"
              icon={
                settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-yellow-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                )
              }
            >
              <Toggle
                label="Sound Effects"
                description="Enable card dealing, chip sounds, and win/loss effects"
                checked={settings.soundEnabled}
                onChange={value => handleSettingChange("soundEnabled", value)}
              />

              {settings.soundEnabled && (
                <Slider
                  label="Volume"
                  value={settings.soundVolume}
                  min={0}
                  max={100}
                  step={5}
                  unit="%"
                  onChange={value => handleSettingChange("soundVolume", value)}
                />
              )}
            </SettingSection>

            {/* Betting Settings */}
            <div className="lg:col-span-2">
              <SettingSection
                title="Betting"
                icon={<DollarSign className="w-5 h-5 text-green-400" />}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Slider
                    label="Default Bet"
                    value={settings.defaultBet}
                    min={5}
                    max={100}
                    step={5}
                    unit="$"
                    onChange={value => handleSettingChange("defaultBet", value)}
                  />

                  <Slider
                    label="Maximum Bet"
                    value={settings.maxBet}
                    min={100}
                    max={1000}
                    step={50}
                    unit="$"
                    onChange={value => handleSettingChange("maxBet", value)}
                  />

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Quick Bet Amounts
                    </label>
                    <div className="text-gray-400 text-sm">
                      $5, $10, $25, $50, $100
                    </div>
                  </div>
                </div>
              </SettingSection>
            </div>
          </div>

          {/* Reset Button */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
