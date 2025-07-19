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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Dealer Section */}
      <motion.div
        className="lg:col-span-3 bg-gray-800 rounded-lg p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Hand {...getDealerHandProps()} />
      </motion.div>

      {/* Player Section */}
      <motion.div
        className="lg:col-span-2 bg-gray-800 rounded-lg p-6 border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Hand {...getPlayerHandProps()} />
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
