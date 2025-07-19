import React from "react";
import { motion } from "framer-motion";
import { Coins, Plus, Minus } from "lucide-react";
import { useAnimations } from "../../hooks";

const DEFAULT_PRESET_BETS = [5, 10, 25, 50, 100];

export interface BettingPresentationProps {
  // Display data
  playerChips: number;
  currentBet: number;
  customBet: number;
  minBet: number;
  effectiveMaxBet: number;
  presetBets?: number[];
  disabled?: boolean;
  className?: string;

  // State management
  setCustomBet: (value: number) => void;

  // Actions
  handlePresetBet: (amount: number) => void;
  handleCustomBet: () => void;
  incrementCustomBet: () => void;
  decrementCustomBet: () => void;

  // Computed states
  canPlaceCustomBet: boolean;
  canAffordAmount: (amount: number) => boolean;
}

export const BettingPresentation = ({
  playerChips,
  currentBet,
  customBet,
  minBet,
  effectiveMaxBet,
  presetBets = DEFAULT_PRESET_BETS,
  disabled = false,
  className = "",
  setCustomBet,
  handlePresetBet,
  handleCustomBet,
  incrementCustomBet,
  decrementCustomBet,
  canPlaceCustomBet,
  canAffordAmount,
}: BettingPresentationProps) => {
  const { button, chipBet } = useAnimations();

  const handleCustomBetInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = Math.max(
      minBet,
      Math.min(effectiveMaxBet, parseInt(e.target.value) || minBet)
    );
    setCustomBet(value);
  };

  return (
    <motion.div
      className={`${className} bg-gray-800 rounded-lg p-6 border border-gray-700`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Coins className="w-6 h-6 text-yellow-400" />
          Place Your Bet
        </h3>
        <div className="text-right">
          <div className="text-sm text-gray-400">Your Chips</div>
          <div className="text-lg font-semibold text-yellow-400">
            ${playerChips}
          </div>
        </div>
      </div>

      {/* Current Bet Display */}
      {currentBet > 0 && (
        <motion.div
          className="mb-4 p-3 bg-green-900 rounded-lg border border-green-600"
          variants={chipBet}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center">
            <div className="text-sm text-green-300">Current Bet</div>
            <div className="text-xl font-bold text-green-400">
              ${currentBet}
            </div>
          </div>
        </motion.div>
      )}

      {/* Preset Bet Buttons */}
      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-3">Quick Bets</div>
        <div className="grid grid-cols-5 gap-2">
          {presetBets.map(amount => {
            const canAfford = canAffordAmount(amount);
            return (
              <motion.button
                key={amount}
                onClick={() => handlePresetBet(amount)}
                disabled={disabled || !canAfford}
                className={`
                  py-2 px-3 rounded-lg font-semibold transition-all
                  ${
                    canAfford && !disabled
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }
                `}
                variants={button}
                initial="idle"
                whileHover={canAfford && !disabled ? "hover" : "idle"}
                whileTap={canAfford && !disabled ? "pressed" : "idle"}
              >
                ${amount}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Custom Bet Input */}
      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-3">Custom Amount</div>
        <div className="flex items-center gap-2">
          <button
            onClick={decrementCustomBet}
            disabled={disabled || customBet <= minBet}
            className={`
              p-2 rounded-lg transition-colors
              ${
                !disabled && customBet > minBet
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-800 text-gray-600 cursor-not-allowed"
              }
            `}
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              $
            </span>
            <input
              type="number"
              value={customBet}
              onChange={handleCustomBetInputChange}
              disabled={disabled}
              min={minBet}
              max={effectiveMaxBet}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-8 pr-3 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>

          <button
            onClick={incrementCustomBet}
            disabled={disabled || customBet >= playerChips}
            className={`
              p-2 rounded-lg transition-colors
              ${
                !disabled && customBet < playerChips
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-800 text-gray-600 cursor-not-allowed"
              }
            `}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          onClick={handleCustomBet}
          disabled={!canPlaceCustomBet}
          className={`
            flex-1 py-3 px-4 rounded-lg font-semibold transition-all
            ${
              canPlaceCustomBet
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }
          `}
          whileHover={canPlaceCustomBet ? { scale: 1.02 } : {}}
          whileTap={canPlaceCustomBet ? { scale: 0.98 } : {}}
        >
          Bet ${customBet}
        </motion.button>

        <motion.button
          onClick={() => handlePresetBet(playerChips)}
          disabled={disabled || playerChips < minBet}
          className={`
            py-3 px-4 rounded-lg font-semibold transition-all border-2
            ${
              !disabled && playerChips >= minBet
                ? "border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                : "border-gray-600 text-gray-500 cursor-not-allowed"
            }
          `}
          whileHover={!disabled && playerChips >= minBet ? { scale: 1.02 } : {}}
          whileTap={!disabled && playerChips >= minBet ? { scale: 0.98 } : {}}
        >
          All In
        </motion.button>
      </div>

      {/* Betting Rules */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Minimum bet: ${minBet} • Blackjack pays 3:2
      </div>
    </motion.div>
  );
};
