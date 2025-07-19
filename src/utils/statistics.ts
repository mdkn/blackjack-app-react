import { GameResult } from "../types";

export interface GameStatistics {
  totalGames: number;
  gamesWon: number;
  gamesLost: number;
  gamesPushed: number;
  winRate: number;
  totalWinnings: number;
  biggestWin: number;
  biggestLoss: number;
  averageWinnings: number;
  blackjacksHit: number;
  timesPlayerBusted: number;
  timesDealerBusted: number;
  currentStreak: {
    type: "win" | "loss" | "none";
    count: number;
  };
  longestWinStreak: number;
  longestLossStreak: number;
}

export const calculateStatistics = (history: GameResult[]): GameStatistics => {
  if (history.length === 0) {
    return {
      totalGames: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesPushed: 0,
      winRate: 0,
      totalWinnings: 0,
      biggestWin: 0,
      biggestLoss: 0,
      averageWinnings: 0,
      blackjacksHit: 0,
      timesPlayerBusted: 0,
      timesDealerBusted: 0,
      currentStreak: { type: "none", count: 0 },
      longestWinStreak: 0,
      longestLossStreak: 0,
    };
  }

  const totalGames = history.length;
  const gamesWon = history.filter(game => game.result === "player-wins").length;
  const gamesLost = history.filter(
    game => game.result === "dealer-wins"
  ).length;
  const gamesPushed = history.filter(game => game.result === "push").length;

  const winRate = (gamesWon / totalGames) * 100;
  const totalWinnings = history.reduce((sum, game) => sum + game.winnings, 0);

  const winnings = history.map(game => game.winnings);
  const biggestWin = Math.max(...winnings, 0);
  const biggestLoss = Math.min(...winnings, 0);
  const averageWinnings = totalWinnings / totalGames;

  const blackjacksHit = history.filter(
    game => game.playerHand.isBlackjack
  ).length;
  const timesPlayerBusted = history.filter(
    game => game.playerHand.isBust
  ).length;
  const timesDealerBusted = history.filter(
    game => game.dealerHand.isBust
  ).length;

  // Calculate streaks
  let currentStreak: { type: "win" | "loss" | "none"; count: number } = {
    type: "none",
    count: 0,
  };
  let longestWinStreak = 0;
  let longestLossStreak = 0;
  let currentWinStreak = 0;
  let currentLossStreak = 0;

  // Iterate through history to find streaks
  for (let i = 0; i < history.length; i++) {
    const game = history[i];

    if (game.result === "player-wins") {
      currentWinStreak++;
      currentLossStreak = 0;
      longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
    } else if (game.result === "dealer-wins") {
      currentLossStreak++;
      currentWinStreak = 0;
      longestLossStreak = Math.max(longestLossStreak, currentLossStreak);
    } else {
      // Push breaks streaks
      currentWinStreak = 0;
      currentLossStreak = 0;
    }
  }

  // Set current streak based on the last game
  if (history.length > 0) {
    const lastGame = history[history.length - 1];
    if (lastGame.result === "player-wins") {
      currentStreak = { type: "win", count: currentWinStreak };
    } else if (lastGame.result === "dealer-wins") {
      currentStreak = { type: "loss", count: currentLossStreak };
    }
  }

  return {
    totalGames,
    gamesWon,
    gamesLost,
    gamesPushed,
    winRate,
    totalWinnings,
    biggestWin,
    biggestLoss,
    averageWinnings,
    blackjacksHit,
    timesPlayerBusted,
    timesDealerBusted,
    currentStreak,
    longestWinStreak,
    longestLossStreak,
  };
};

export const formatCurrency = (amount: number): string => {
  const sign = amount >= 0 ? "+" : "";
  return `${sign}$${amount}`;
};

export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return `${value.toFixed(decimals)}%`;
};

export const getStreakText = (
  streak: GameStatistics["currentStreak"]
): string => {
  if (streak.type === "none" || streak.count === 0) {
    return "No active streak";
  }

  const streakType = streak.type === "win" ? "Win" : "Loss";
  const games = streak.count === 1 ? "game" : "games";
  return `${streak.count} ${games} ${streakType.toLowerCase()} streak`;
};
