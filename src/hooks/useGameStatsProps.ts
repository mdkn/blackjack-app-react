import { useMemo } from "react";
import { GameResult } from "../types";
import { calculateStatistics, GameStatistics } from "../lib/statistics";

interface UseGameStatsPropsParams {
  history: GameResult[];
}

interface UseGameStatsPropsReturn {
  stats: GameStatistics;
  getWinRateColor: (winRate: number) => "green" | "red" | "yellow";
  getStreakColor: (
    streak: GameStatistics["currentStreak"]
  ) => "green" | "red" | "gray";
  hasNoStats: boolean;
}

export const useGameStatsProps = ({
  history,
}: UseGameStatsPropsParams): UseGameStatsPropsReturn => {
  const stats = useMemo(() => {
    return calculateStatistics(history);
  }, [history]);

  const getWinRateColor = useMemo(() => {
    return (winRate: number): "green" | "red" | "yellow" => {
      if (winRate >= 60) return "green";
      if (winRate >= 40) return "yellow";
      return "red";
    };
  }, []);

  const getStreakColor = useMemo(() => {
    return (
      streak: GameStatistics["currentStreak"]
    ): "green" | "red" | "gray" => {
      if (streak.type === "win") return "green";
      if (streak.type === "loss") return "red";
      return "gray";
    };
  }, []);

  const hasNoStats = useMemo(() => {
    return history.length === 0;
  }, [history.length]);

  return {
    stats,
    getWinRateColor,
    getStreakColor,
    hasNoStats,
  };
};
