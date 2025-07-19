import { useMemo } from "react";
import { useGameStore } from "../stores";
import { GameResult } from "../types";

interface UseStatsPagePropsReturn {
  gameHistory: GameResult[];
  animationProps: {
    initial: { opacity: number; y: number };
    animate: { opacity: number; y: number };
    transition: { duration: number };
  };
}

export const useStatsPageProps = (): UseStatsPagePropsReturn => {
  const { gameHistory } = useGameStore();

  const animationProps = useMemo(
    () => ({
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
    }),
    []
  );

  return {
    gameHistory,
    animationProps,
  };
};
