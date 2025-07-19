import { useMemo } from "react";
import type { ChangeEvent } from "react";
import { useGameStore } from "../stores";
import { useSound } from "./useSound";

const DEFAULT_PRESET_BETS = [5, 10, 25, 50, 100];

export interface UseBettingPropsParams {
  presetBets?: number[];
  disabled?: boolean;
  className?: string;
}

export interface UseBettingPropsReturn {
  // Display data
  playerChips: number;
  currentBet: number;
  customBet: number;
  minBet: number;
  effectiveMaxBet: number;
  presetBets: number[];
  disabled: boolean;
  className: string;

  // Props getters
  getPresetButtonProps: (amount: number) => {
    onClick: () => void;
    disabled: boolean;
    className: string;
  };
  getCustomBetInputProps: () => {
    type: "number";
    value: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
    min: number;
    max: number;
    className: string;
  };
  getDecrementButtonProps: () => {
    onClick: () => void;
    disabled: boolean;
    className: string;
  };
  getIncrementButtonProps: () => {
    onClick: () => void;
    disabled: boolean;
    className: string;
  };
  getCustomBetButtonProps: () => {
    onClick: () => void;
    disabled: boolean;
    className: string;
  };
  getAllInButtonProps: () => {
    onClick: () => void;
    disabled: boolean;
    className: string;
  };

  // State management
  setCustomBet: (value: number) => void;

  // Computed states
  canPlaceCustomBet: boolean;
  canAffordAmount: (amount: number) => boolean;
}

export const useBettingProps = ({
  presetBets = DEFAULT_PRESET_BETS,
  disabled = false,
  className = "",
}: UseBettingPropsParams = {}): UseBettingPropsReturn => {
  const { player, customBet, minBet, setCustomBet, placeBet } = useGameStore();

  const playerChips = player.chips;
  const currentBet = player.currentBet;

  const { playSound } = useSound();

  const effectiveMaxBet = useMemo(() => {
    return Math.min(playerChips, 1000); // Assume max bet limit of 1000
  }, [playerChips]);

  const canAffordAmount = useMemo(() => {
    return (amount: number) => amount <= playerChips && amount >= minBet;
  }, [playerChips, minBet]);

  const canPlaceCustomBet = useMemo(() => {
    return (
      !disabled &&
      customBet >= minBet &&
      customBet <= playerChips &&
      customBet !== currentBet
    );
  }, [disabled, customBet, minBet, playerChips, currentBet]);

  const handlePresetBet = useMemo(() => {
    return (amount: number) => {
      if (!disabled && canAffordAmount(amount)) {
        playSound("chipPlace");
        placeBet(amount);
      }
    };
  }, [disabled, canAffordAmount, placeBet, playSound]);

  const handleCustomBet = useMemo(() => {
    return () => {
      if (canPlaceCustomBet) {
        playSound("chipPlace");
        placeBet(customBet);
      }
    };
  }, [canPlaceCustomBet, placeBet, customBet, playSound]);

  const incrementCustomBet = useMemo(() => {
    return () => {
      if (customBet < playerChips) {
        setCustomBet(Math.min(customBet + 5, playerChips));
      }
    };
  }, [customBet, playerChips, setCustomBet]);

  const decrementCustomBet = useMemo(() => {
    return () => {
      if (customBet > minBet) {
        setCustomBet(Math.max(customBet - 5, minBet));
      }
    };
  }, [customBet, minBet, setCustomBet]);

  const handleCustomBetInputChange = useMemo(() => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = Math.max(
        minBet,
        Math.min(effectiveMaxBet, parseInt(e.target.value) || minBet)
      );
      setCustomBet(value);
    };
  }, [minBet, effectiveMaxBet, setCustomBet]);

  // Props getters
  const getPresetButtonProps = useMemo(() => {
    return (amount: number) => {
      const canAfford = canAffordAmount(amount);
      return {
        onClick: () => handlePresetBet(amount),
        disabled: disabled || !canAfford,
        className: `
          py-2 px-3 rounded-lg font-semibold transition-all
          ${
            canAfford && !disabled
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }
        `,
      };
    };
  }, [disabled, canAffordAmount, handlePresetBet]);

  const getCustomBetInputProps = useMemo(() => {
    return () => ({
      type: "number" as const,
      value: customBet,
      onChange: handleCustomBetInputChange,
      disabled,
      min: minBet,
      max: effectiveMaxBet,
      className:
        "w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-8 pr-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50",
    });
  }, [
    customBet,
    handleCustomBetInputChange,
    disabled,
    minBet,
    effectiveMaxBet,
  ]);

  const getDecrementButtonProps = useMemo(() => {
    return () => ({
      onClick: decrementCustomBet,
      disabled: disabled || customBet <= minBet,
      className: `
        p-2 rounded-lg transition-colors
        ${
          !disabled && customBet > minBet
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-gray-800 text-gray-600 cursor-not-allowed"
        }
      `,
    });
  }, [disabled, customBet, minBet, decrementCustomBet]);

  const getIncrementButtonProps = useMemo(() => {
    return () => ({
      onClick: incrementCustomBet,
      disabled: disabled || customBet >= playerChips,
      className: `
        p-2 rounded-lg transition-colors
        ${
          !disabled && customBet < playerChips
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-gray-800 text-gray-600 cursor-not-allowed"
        }
      `,
    });
  }, [disabled, customBet, playerChips, incrementCustomBet]);

  const getCustomBetButtonProps = useMemo(() => {
    return () => ({
      onClick: handleCustomBet,
      disabled: !canPlaceCustomBet,
      className: `
        flex-1 py-3 px-4 rounded-lg font-semibold transition-all
        ${
          canPlaceCustomBet
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gray-700 text-gray-500 cursor-not-allowed"
        }
      `,
    });
  }, [handleCustomBet, canPlaceCustomBet]);

  const getAllInButtonProps = useMemo(() => {
    return () => ({
      onClick: () => handlePresetBet(playerChips),
      disabled: disabled || playerChips < minBet,
      className: `
        py-3 px-4 rounded-lg font-semibold transition-all border-2
        ${
          !disabled && playerChips >= minBet
            ? "border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
            : "border-gray-600 text-gray-500 cursor-not-allowed"
        }
      `,
    });
  }, [disabled, playerChips, minBet, handlePresetBet]);

  return {
    // Display data
    playerChips,
    currentBet,
    customBet,
    minBet,
    effectiveMaxBet,
    presetBets,
    disabled,
    className,

    // Props getters
    getPresetButtonProps,
    getCustomBetInputProps,
    getDecrementButtonProps,
    getIncrementButtonProps,
    getCustomBetButtonProps,
    getAllInButtonProps,

    // State management
    setCustomBet,

    // Computed states
    canPlaceCustomBet,
    canAffordAmount,
  };
};
