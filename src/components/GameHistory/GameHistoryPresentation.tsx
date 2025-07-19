import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import { GameResult } from "../../types";
import { getHandDisplayValue } from "../../lib/game-logic";

interface GameHistoryPresentationProps {
  history: GameResult[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  totalWinnings: number;
  gamesWon: number;
  winRate: number;
  getResultIcon: (result: GameResult["result"]) => React.ReactElement;
  getResultText: (result: GameResult["result"]) => string;
  getResultColor: (result: GameResult["result"]) => string;
  formatTime: (timestamp: Date) => string;
}

export const GameHistoryPresentation = ({
  history,
  isOpen,
  onClose,
  className = "",
  totalWinnings,
  winRate,
  getResultIcon,
  getResultText,
  getResultColor,
  formatTime,
}: GameHistoryPresentationProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={`fixed inset-4 md:inset-8 bg-gray-800 rounded-lg shadow-2xl z-50 flex flex-col ${className}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Game History</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Stats Summary */}
            <div className="p-6 border-b border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">
                    {history.length}
                  </div>
                  <div className="text-gray-400 text-sm">Total Games</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div
                    className={`text-2xl font-bold ${totalWinnings >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {totalWinnings >= 0 ? "+" : ""}${totalWinnings}
                  </div>
                  <div className="text-gray-400 text-sm">Net Winnings</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <div
                    className={`text-2xl font-bold ${winRate >= 50 ? "text-green-400" : "text-red-400"}`}
                  >
                    {winRate.toFixed(1)}%
                  </div>
                  <div className="text-gray-400 text-sm">Win Rate</div>
                </div>
              </div>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto p-6">
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No games played yet</p>
                  <p className="text-gray-500 text-sm">
                    Start playing to see your game history here
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history
                    .slice()
                    .reverse()
                    .map((game, index) => (
                      <motion.div
                        key={history.length - index - 1}
                        className="bg-gray-700 rounded-lg p-4 border border-gray-600"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getResultIcon(game.result)}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getResultColor(game.result)}`}
                            >
                              {getResultText(game.result)}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {formatTime(game.timestamp)}
                            </span>
                          </div>
                          <div
                            className={`text-lg font-bold ${game.winnings >= 0 ? "text-green-400" : "text-red-400"}`}
                          >
                            {game.winnings >= 0 ? "+" : ""}${game.winnings}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-400 mb-1">Your Hand</div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">
                                {getHandDisplayValue(game.playerHand)}
                              </span>
                              {game.playerHand.isBlackjack && (
                                <span className="text-yellow-400 text-xs font-bold">
                                  BLACKJACK
                                </span>
                              )}
                              {game.playerHand.isBust && (
                                <span className="text-red-400 text-xs font-bold">
                                  BUST
                                </span>
                              )}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {game.playerHand.cards
                                .map(
                                  card =>
                                    `${card.rank}${card.suit[0].toUpperCase()}`
                                )
                                .join(", ")}
                            </div>
                          </div>

                          <div>
                            <div className="text-gray-400 mb-1">
                              Dealer Hand
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">
                                {getHandDisplayValue(game.dealerHand)}
                              </span>
                              {game.dealerHand.isBlackjack && (
                                <span className="text-yellow-400 text-xs font-bold">
                                  BLACKJACK
                                </span>
                              )}
                              {game.dealerHand.isBust && (
                                <span className="text-red-400 text-xs font-bold">
                                  BUST
                                </span>
                              )}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {game.dealerHand.cards
                                .map(
                                  card =>
                                    `${card.rank}${card.suit[0].toUpperCase()}`
                                )
                                .join(", ")}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
