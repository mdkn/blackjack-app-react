import { motion } from "framer-motion";
import { Coins, Plus, Minus } from "lucide-react";
import { useAnimations } from "../../hooks";
import { UseBettingPropsReturn } from "../../hooks/useBettingProps";

export interface BettingPresentationProps extends UseBettingPropsReturn {}

export const BettingPresentation = (props: BettingPresentationProps) => {
  const {
    playerChips,
    currentBet,
    customBet,
    minBet,
    presetBets,
    className,
    getPresetButtonProps,
    getCustomBetInputProps,
    getDecrementButtonProps,
    getIncrementButtonProps,
    getCustomBetButtonProps,
    getAllInButtonProps,
  } = props;

  const { button, chipBet } = useAnimations();

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
            const buttonProps = getPresetButtonProps(amount);
            const canAfford = !buttonProps.disabled;
            return (
              <motion.button
                key={amount}
                {...buttonProps}
                variants={button}
                initial="idle"
                whileHover={canAfford ? "hover" : "idle"}
                whileTap={canAfford ? "pressed" : "idle"}
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
          <button {...getDecrementButtonProps()}>
            <Minus className="w-4 h-4" />
          </button>

          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              $
            </span>
            <input {...getCustomBetInputProps()} />
          </div>

          <button {...getIncrementButtonProps()}>
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          {...getCustomBetButtonProps()}
          whileHover={
            !getCustomBetButtonProps().disabled ? { scale: 1.02 } : {}
          }
          whileTap={!getCustomBetButtonProps().disabled ? { scale: 0.98 } : {}}
        >
          Bet ${customBet}
        </motion.button>

        <motion.button
          {...getAllInButtonProps()}
          whileHover={!getAllInButtonProps().disabled ? { scale: 1.02 } : {}}
          whileTap={!getAllInButtonProps().disabled ? { scale: 0.98 } : {}}
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
