import { useState } from "react";

const MIN_BET = 5;

export interface UseBettingContainerProps {
  playerChips: number;
  onPlaceBet: (amount: number) => void;
  disabled?: boolean;
  defaultBet?: number;
  maxBet?: number;
}

export interface UseBettingContainerReturn {
  customBet: number;
  setCustomBet: (value: number) => void;
  handlePresetBet: (amount: number) => void;
  handleCustomBet: () => void;
  incrementCustomBet: () => void;
  decrementCustomBet: () => void;
  canPlaceCustomBet: boolean;
  canAffordAmount: (amount: number) => boolean;
  effectiveMaxBet: number;
  minBet: number;
}

export const useBettingContainer = ({
  playerChips,
  onPlaceBet,
  disabled = false,
  defaultBet = MIN_BET,
  maxBet = 500,
}: UseBettingContainerProps): UseBettingContainerReturn => {
  const [customBet, setCustomBet] = useState(defaultBet);

  const effectiveMaxBet = Math.min(playerChips, maxBet);

  const handlePresetBet = (amount: number) => {
    if (amount <= playerChips && !disabled) {
      onPlaceBet(amount);
    }
  };

  const handleCustomBet = () => {
    if (customBet >= MIN_BET && customBet <= playerChips && !disabled) {
      onPlaceBet(customBet);
    }
  };

  const incrementCustomBet = () => {
    const newAmount = Math.min(customBet + 5, playerChips);
    setCustomBet(newAmount);
  };

  const decrementCustomBet = () => {
    const newAmount = Math.max(customBet - 5, MIN_BET);
    setCustomBet(newAmount);
  };

  const canPlaceCustomBet =
    !disabled && customBet >= MIN_BET && customBet <= playerChips;

  const canAffordAmount = (amount: number) =>
    amount <= playerChips && !disabled;

  return {
    customBet,
    setCustomBet,
    handlePresetBet,
    handleCustomBet,
    incrementCustomBet,
    decrementCustomBet,
    canPlaceCustomBet,
    canAffordAmount,
    effectiveMaxBet,
    minBet: MIN_BET,
  };
};
