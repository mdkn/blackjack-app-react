import { motion } from "framer-motion";
import { Play, RotateCcw, Hand as HandIcon, Square } from "lucide-react";
import { GamePhase } from "../../types";

interface GameControlsProps {
  phase: GamePhase;
  onHit: () => void;
  onStand: () => void;
  onNewRound: () => void;
  onNewGame: () => void;
  playerCanHit: boolean;
  disabled?: boolean;
  className?: string;
}

export const GameControls = ({
  phase,
  onHit,
  onStand,
  onNewRound,
  onNewGame,
  playerCanHit,
  disabled = false,
  className = "",
}: GameControlsProps) => {
  const isPlayerTurn = phase === "player-turn";
  const isGameOver = phase === "game-over";
  const isDealing = phase === "dealing" || phase === "dealer-turn";

  const renderPlayerActions = () => {
    if (!isPlayerTurn) return null;

    return (
      <motion.div
        className="flex gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={onHit}
          disabled={disabled || !playerCanHit}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg
            transition-all duration-200
            ${
              !disabled && playerCanHit
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }
          `}
          whileHover={!disabled && playerCanHit ? { scale: 1.05 } : {}}
          whileTap={!disabled && playerCanHit ? { scale: 0.95 } : {}}
        >
          <HandIcon className="w-5 h-5" />
          Hit
        </motion.button>

        <motion.button
          onClick={onStand}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg
            transition-all duration-200
            ${
              !disabled
                ? "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }
          `}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <Square className="w-5 h-5" />
          Stand
        </motion.button>
      </motion.div>
    );
  };

  const renderGameOverActions = () => {
    if (!isGameOver) return null;

    return (
      <motion.div
        className="flex gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <motion.button
          onClick={onNewRound}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg
            transition-all duration-200
            ${
              !disabled
                ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }
          `}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <Play className="w-5 h-5" />
          Next Round
        </motion.button>

        <motion.button
          onClick={onNewGame}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-lg
            transition-all duration-200 border-2
            ${
              !disabled
                ? "border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                : "border-gray-600 text-gray-500 cursor-not-allowed"
            }
          `}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <RotateCcw className="w-5 h-5" />
          New Game
        </motion.button>
      </motion.div>
    );
  };

  const renderStatusMessage = () => {
    let message = "";
    let messageColor = "text-gray-300";

    switch (phase) {
      case "betting":
        message = "Place your bet to start the round";
        messageColor = "text-blue-400";
        break;
      case "dealing":
        message = "Dealing cards...";
        messageColor = "text-yellow-400";
        break;
      case "player-turn":
        message = playerCanHit
          ? "Your turn - Hit or Stand?"
          : "You cannot hit (hand value too high)";
        messageColor = playerCanHit ? "text-green-400" : "text-orange-400";
        break;
      case "dealer-turn":
        message = "Dealer is playing...";
        messageColor = "text-purple-400";
        break;
      case "game-over":
        message = "Round complete!";
        messageColor = "text-gray-300";
        break;
    }

    return (
      <motion.div
        className={`text-center text-lg font-medium ${messageColor} mb-6`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {message}
      </motion.div>
    );
  };

  const showLoadingSpinner = () => {
    return (
      isDealing && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </motion.div>
      )
    );
  };

  return (
    <div
      className={`${className} bg-gray-800 rounded-lg p-6 border border-gray-700`}
    >
      {/* Status Message */}
      {renderStatusMessage()}

      {/* Controls */}
      <div className="min-h-[80px] flex items-center justify-center">
        {showLoadingSpinner()}
        {renderPlayerActions()}
        {renderGameOverActions()}
      </div>

      {/* Help Text */}
      {isPlayerTurn && (
        <motion.div
          className="mt-6 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div>Hit: Take another card</div>
          <div>Stand: Keep your current hand and end your turn</div>
        </motion.div>
      )}

      {isGameOver && (
        <motion.div
          className="mt-6 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          Start a new round or begin a fresh game with reset chips
        </motion.div>
      )}
    </div>
  );
};
