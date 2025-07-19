import { motion } from "framer-motion";
import { GameStats } from "../components";
import { GameResult } from "../types";

interface StatsPagePresentationProps {
  gameHistory: GameResult[];
  animationProps: {
    initial: { opacity: number; y: number };
    animate: { opacity: number; y: number };
    transition: { duration: number };
  };
}

export const StatsPagePresentation = ({
  gameHistory,
  animationProps,
}: StatsPagePresentationProps) => {
  return (
    <motion.div {...animationProps}>
      <GameStats history={gameHistory} />
    </motion.div>
  );
};
