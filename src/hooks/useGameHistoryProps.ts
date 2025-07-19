import React, { useMemo } from "react";
import { GameResult } from "../types";

interface UseGameHistoryPropsParams {
  history: GameResult[];
}

interface UseGameHistoryPropsReturn {
  totalWinnings: number;
  gamesWon: number;
  winRate: number;
  getResultIcon: (result: GameResult["result"]) => React.ReactElement;
  getResultText: (result: GameResult["result"]) => string;
  getResultColor: (result: GameResult["result"]) => string;
  formatTime: (timestamp: Date) => string;
}

export const useGameHistoryProps = ({
  history,
}: UseGameHistoryPropsParams): UseGameHistoryPropsReturn => {
  const totalWinnings = useMemo(() => {
    return history.reduce((sum, game) => sum + game.winnings, 0);
  }, [history]);

  const gamesWon = useMemo(() => {
    return history.filter(game => game.result === "player-wins").length;
  }, [history]);

  const winRate = useMemo(() => {
    return history.length > 0 ? (gamesWon / history.length) * 100 : 0;
  }, [history.length, gamesWon]);

  const getResultIcon = useMemo(() => {
    const ResultIcon = (result: GameResult["result"]): React.ReactElement => {
      const { TrendingUp, TrendingDown, Minus } = require("lucide-react");

      switch (result) {
        case "player-wins":
          return React.createElement(TrendingUp, {
            className: "w-4 h-4 text-green-500",
          });
        case "dealer-wins":
          return React.createElement(TrendingDown, {
            className: "w-4 h-4 text-red-500",
          });
        case "push":
          return React.createElement(Minus, {
            className: "w-4 h-4 text-yellow-500",
          });
      }
    };
    ResultIcon.displayName = "ResultIcon";
    return ResultIcon;
  }, []);

  const getResultText = useMemo(() => {
    return (result: GameResult["result"]) => {
      switch (result) {
        case "player-wins":
          return "Win";
        case "dealer-wins":
          return "Loss";
        case "push":
          return "Push";
      }
    };
  }, []);

  const getResultColor = useMemo(() => {
    return (result: GameResult["result"]) => {
      switch (result) {
        case "player-wins":
          return "text-green-500 bg-green-100";
        case "dealer-wins":
          return "text-red-500 bg-red-100";
        case "push":
          return "text-yellow-600 bg-yellow-100";
      }
    };
  }, []);

  const formatTime = useMemo(() => {
    return (timestamp: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(timestamp);
    };
  }, []);

  return {
    totalWinnings,
    gamesWon,
    winRate,
    getResultIcon,
    getResultText,
    getResultColor,
    formatTime,
  };
};
