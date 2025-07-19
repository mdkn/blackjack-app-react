import { useState } from "react";
import { ComponentProps } from "react";
import { useGameStore } from "../stores";
import { GameHistory, Settings } from "../components";

export type AppView = "game" | "stats";

export interface UseAppPropsReturn {
  currentView: AppView;
  isHistoryOpen: boolean;
  isSettingsOpen: boolean;
  getNavButtonProps: (view: AppView) => {
    onClick: () => void;
    className: string;
  };
  getHistoryButtonProps: () => {
    onClick: () => void;
    className: string;
  };
  getSettingsButtonProps: () => {
    onClick: () => void;
    className: string;
  };
  getGameHistoryProps: () => ComponentProps<typeof GameHistory>;
  getSettingsProps: () => ComponentProps<typeof Settings>;
  setCurrentView: (view: AppView) => void;
}

export const useAppProps = (): UseAppPropsReturn => {
  const { gameHistory } = useGameStore();
  const [currentView, setCurrentView] = useState<AppView>("game");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Base button classes
  const baseButtonClasses =
    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors";
  const activeClasses = "bg-blue-600 text-white";
  const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";

  // Navigation button props
  const getNavButtonProps = (view: AppView) => ({
    onClick: () => setCurrentView(view),
    className: `${baseButtonClasses} ${
      currentView === view ? activeClasses : inactiveClasses
    }`,
  });

  // History button props
  const getHistoryButtonProps = () => ({
    onClick: () => setIsHistoryOpen(true),
    className: `${baseButtonClasses} ${inactiveClasses}`,
  });

  // Settings button props
  const getSettingsButtonProps = () => ({
    onClick: () => setIsSettingsOpen(true),
    className: `${baseButtonClasses} ${inactiveClasses}`,
  });

  // Game History modal props
  const getGameHistoryProps = () => ({
    history: gameHistory,
    isOpen: isHistoryOpen,
    onClose: () => setIsHistoryOpen(false),
  });

  // Settings modal props
  const getSettingsProps = () => ({
    isOpen: isSettingsOpen,
    onClose: () => setIsSettingsOpen(false),
  });

  return {
    currentView,
    isHistoryOpen,
    isSettingsOpen,
    getNavButtonProps,
    getHistoryButtonProps,
    getSettingsButtonProps,
    getGameHistoryProps,
    getSettingsProps,
    setCurrentView,
  };
};
