import { motion } from "framer-motion";
import { Play, RotateCcw, Hand as HandIcon, Square } from "lucide-react";
import { useAnimations } from "../../hooks";

interface GameControlsPresentationProps {
  onHit: () => void;
  onStand: () => void;
  onNewRound: () => void;
  onNewGame: () => void;
  className?: string;
  isPlayerTurn: boolean;
  isGameOver: boolean;
  statusMessage: string;
  statusMessageColor: string;
  showLoadingSpinner: boolean;
  canHit: boolean;
  canStand: boolean;
  canNextRound: boolean;
  canNewGame: boolean;
}

export const GameControlsPresentation = ({
  onHit,
  onStand,
  onNewRound,
  onNewGame,
  className = "",
  isPlayerTurn,
  isGameOver,
  statusMessage,
  statusMessageColor,
  showLoadingSpinner,
  canHit,
  canStand,
  canNextRound,
  canNewGame,
}: GameControlsPresentationProps) => {
  const { button } = useAnimations();

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
          disabled={!canHit}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg
            transition-all duration-200
            ${
              canHit
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }
          `}
          variants={button}
          initial="idle"
          whileHover={canHit ? "hover" : "idle"}
          whileTap={canHit ? "pressed" : "idle"}
        >
          <HandIcon className="w-5 h-5" />
          Hit
        </motion.button>

        <motion.button
          onClick={onStand}
          disabled={!canStand}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg
            transition-all duration-200
            ${
              canStand
                ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }
          `}
          variants={button}
          initial="idle"
          whileHover={canStand ? "hover" : "idle"}
          whileTap={canStand ? "pressed" : "idle"}
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
          disabled={!canNextRound}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-lg
            transition-all duration-200
            ${
              canNextRound
                ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }
          `}
          variants={button}
          initial="idle"
          whileHover={canNextRound ? "hover" : "idle"}
          whileTap={canNextRound ? "pressed" : "idle"}
        >
          <Play className="w-5 h-5" />
          Next Round
        </motion.button>

        <motion.button
          onClick={onNewGame}
          disabled={!canNewGame}
          className={`
            flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-lg
            transition-all duration-200 border-2
            ${
              canNewGame
                ? "border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                : "border-gray-600 text-gray-500 cursor-not-allowed"
            }
          `}
          variants={button}
          initial="idle"
          whileHover={canNewGame ? "hover" : "idle"}
          whileTap={canNewGame ? "pressed" : "idle"}
        >
          <RotateCcw className="w-5 h-5" />
          New Game
        </motion.button>
      </motion.div>
    );
  };

  const renderStatusMessage = () => {
    return (
      <motion.div
        className={`text-center text-lg font-medium ${statusMessageColor} mb-6`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {statusMessage}
      </motion.div>
    );
  };

  const renderLoadingSpinner = () => {
    return (
      showLoadingSpinner && (
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
        {renderLoadingSpinner()}
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
