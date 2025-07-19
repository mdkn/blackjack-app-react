import { motion } from "framer-motion";
import { useGameStore } from "../stores";
import { GameStats } from "../components";

export const StatsPage = () => {
  const { gameHistory } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GameStats history={gameHistory} />
    </motion.div>
  );
};
