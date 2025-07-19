import { motion } from "framer-motion";
import { useGameStore } from "../stores";
import { useGameProps } from "../hooks";
import { Hand, Betting, GameControls } from "../components";

export const GamePage = () => {
  const { phase } = useGameStore();
  const {
    getDealerHandProps,
    getPlayerHandProps,
    getBettingProps,
    getGameControlsProps,
  } = useGameProps();

  const showHands = phase !== "betting";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Dealer Section */}
      <motion.div
        className="lg:col-span-3 bg-gray-800 rounded-lg p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {showHands ? (
          <Hand {...getDealerHandProps()} />
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-semibold text-white">Dealer</h3>
            <div className="flex space-x-2">
              {[1, 2].map(i => (
                <div
                  key={i}
                  className="w-16 h-24 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center bg-gray-700"
                >
                  <span className="text-gray-400 text-xs">?</span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <div className="text-lg text-gray-400">Waiting for bet...</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Player Section */}
      <motion.div
        className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {showHands ? (
          <Hand {...getPlayerHandProps()} />
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <h3 className="text-lg font-semibold text-white">Your Hand</h3>
            <div className="flex space-x-2">
              {[1, 2].map(i => (
                <div
                  key={i}
                  className="w-16 h-24 border-2 border-dashed border-gray-500 rounded-lg flex items-center justify-center bg-gray-700"
                >
                  <span className="text-gray-400 text-xs">?</span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <div className="text-lg text-gray-400">
                Place your bet to start!
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Controls Section */}
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Betting Component */}
        {phase === "betting" && <Betting {...getBettingProps()} />}

        {/* Game Controls */}
        <GameControls {...getGameControlsProps()} />
      </motion.div>
    </div>
  );
};
