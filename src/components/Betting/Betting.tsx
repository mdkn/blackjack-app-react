import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Plus, Minus } from "lucide-react";

interface BettingProps {
  playerChips: number;
  currentBet: number;
  onPlaceBet: (amount: number) => void;
  disabled?: boolean;
  presetBets?: number[];
  defaultBet?: number;
  maxBet?: number;
  className?: string;
}

const DEFAULT_PRESET_BETS = [5, 10, 25, 50, 100];
const MIN_BET = 5;

export const Betting = ({
  playerChips,
  currentBet,
  onPlaceBet,
  disabled = false,
  presetBets = DEFAULT_PRESET_BETS,
  defaultBet = MIN_BET,
  maxBet = 500,
  className = "",
}: BettingProps) => {
  const [customBet, setCustomBet] = useState(defaultBet);

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

  const effectiveMaxBet = Math.min(playerChips, maxBet);

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
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
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
            const canAfford = amount <= playerChips;
            return (
              <motion.button
                key={amount}
                onClick={() => handlePresetBet(amount)}
                disabled={disabled || !canAfford}
                className={`
                  py-2 px-3 rounded-lg font-semibold transition-all
                  ${
                    canAfford && !disabled
                      ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }
                `}
                whileHover={canAfford && !disabled ? { scale: 1.05 } : {}}
                whileTap={canAfford && !disabled ? { scale: 0.95 } : {}}
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
            disabled={disabled || customBet <= MIN_BET}
            className={`
              p-2 rounded-lg transition-colors
              ${
                !disabled && customBet > MIN_BET
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
              onChange={e => {
                const value = Math.max(
                  MIN_BET,
                  Math.min(effectiveMaxBet, parseInt(e.target.value) || MIN_BET)
                );
                setCustomBet(value);
              }}
              disabled={disabled}
              min={MIN_BET}
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
          disabled={disabled || customBet < MIN_BET || customBet > playerChips}
          className={`
            flex-1 py-3 px-4 rounded-lg font-semibold transition-all
            ${
              !disabled && customBet >= MIN_BET && customBet <= playerChips
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }
          `}
          whileHover={
            !disabled && customBet >= MIN_BET && customBet <= playerChips
              ? { scale: 1.02 }
              : {}
          }
          whileTap={
            !disabled && customBet >= MIN_BET && customBet <= playerChips
              ? { scale: 0.98 }
              : {}
          }
        >
          Bet ${customBet}
        </motion.button>

        <motion.button
          onClick={() => handlePresetBet(playerChips)}
          disabled={disabled || playerChips < MIN_BET}
          className={`
            py-3 px-4 rounded-lg font-semibold transition-all border-2
            ${
              !disabled && playerChips >= MIN_BET
                ? "border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                : "border-gray-600 text-gray-500 cursor-not-allowed"
            }
          `}
          whileHover={
            !disabled && playerChips >= MIN_BET ? { scale: 1.02 } : {}
          }
          whileTap={!disabled && playerChips >= MIN_BET ? { scale: 0.98 } : {}}
        >
          All In
        </motion.button>
      </div>

      {/* Betting Rules */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Minimum bet: ${MIN_BET} • Blackjack pays 3:2
      </div>
    </motion.div>
  );
};
