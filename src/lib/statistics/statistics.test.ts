import { describe, it, expect } from "vitest";
import {
  calculateStatistics,
  formatCurrency,
  formatPercentage,
  getStreakText,
} from "./statistics";
import { createEmptyHand, addCardToHand } from "../game-logic";
import { GameResult } from "../../types";

// Helper function to create a mock game result
const createMockGameResult = (
  playerCards: Array<{ suit: any; rank: any }>,
  dealerCards: Array<{ suit: any; rank: any }>,
  result: "player-wins" | "dealer-wins" | "push",
  winnings: number
): GameResult => {
  let playerHand = createEmptyHand();
  playerCards.forEach(card => {
    playerHand = addCardToHand(playerHand, card);
  });

  let dealerHand = createEmptyHand();
  dealerCards.forEach(card => {
    dealerHand = addCardToHand(dealerHand, card);
  });

  return {
    playerHand,
    dealerHand,
    result,
    winnings,
    timestamp: new Date(),
  };
};

describe("calculateStatistics", () => {
  it("should return zero stats for empty history", () => {
    const stats = calculateStatistics([]);

    expect(stats.totalGames).toBe(0);
    expect(stats.gamesWon).toBe(0);
    expect(stats.gamesLost).toBe(0);
    expect(stats.gamesPushed).toBe(0);
    expect(stats.winRate).toBe(0);
    expect(stats.totalWinnings).toBe(0);
    expect(stats.currentStreak.type).toBe("none");
    expect(stats.currentStreak.count).toBe(0);
  });

  it("should calculate basic statistics correctly", () => {
    const history = [
      createMockGameResult(
        [
          { suit: "spades", rank: "A" },
          { suit: "hearts", rank: "K" },
        ],
        [
          { suit: "clubs", rank: "10" },
          { suit: "diamonds", rank: "9" },
        ],
        "player-wins",
        100
      ),
      createMockGameResult(
        [
          { suit: "hearts", rank: "10" },
          { suit: "spades", rank: "8" },
        ],
        [
          { suit: "clubs", rank: "A" },
          { suit: "diamonds", rank: "K" },
        ],
        "dealer-wins",
        -50
      ),
      createMockGameResult(
        [
          { suit: "spades", rank: "K" },
          { suit: "hearts", rank: "Q" },
        ],
        [
          { suit: "clubs", rank: "J" },
          { suit: "diamonds", rank: "10" },
        ],
        "push",
        0
      ),
    ];

    const stats = calculateStatistics(history);

    expect(stats.totalGames).toBe(3);
    expect(stats.gamesWon).toBe(1);
    expect(stats.gamesLost).toBe(1);
    expect(stats.gamesPushed).toBe(1);
    expect(stats.winRate).toBeCloseTo(33.33, 2);
    expect(stats.totalWinnings).toBe(50);
    expect(stats.biggestWin).toBe(100);
    expect(stats.biggestLoss).toBe(-50);
    expect(stats.averageWinnings).toBeCloseTo(16.67, 2);
  });

  it("should detect blackjacks correctly", () => {
    const history = [
      createMockGameResult(
        [
          { suit: "spades", rank: "A" },
          { suit: "hearts", rank: "K" },
        ], // Blackjack
        [
          { suit: "clubs", rank: "10" },
          { suit: "diamonds", rank: "9" },
        ],
        "player-wins",
        150
      ),
      createMockGameResult(
        [
          { suit: "hearts", rank: "10" },
          { suit: "spades", rank: "9" },
        ], // Not blackjack
        [
          { suit: "clubs", rank: "8" },
          { suit: "diamonds", rank: "7" },
        ],
        "player-wins",
        50
      ),
    ];

    const stats = calculateStatistics(history);
    expect(stats.blackjacksHit).toBe(1);
  });

  it("should count busts correctly", () => {
    const history = [
      createMockGameResult(
        [
          { suit: "spades", rank: "10" },
          { suit: "hearts", rank: "5" },
          { suit: "clubs", rank: "8" },
        ], // Player bust
        [
          { suit: "diamonds", rank: "K" },
          { suit: "hearts", rank: "7" },
        ],
        "dealer-wins",
        -50
      ),
      createMockGameResult(
        [
          { suit: "hearts", rank: "10" },
          { suit: "spades", rank: "9" },
        ],
        [
          { suit: "clubs", rank: "8" },
          { suit: "diamonds", rank: "7" },
          { suit: "hearts", rank: "8" },
        ], // Dealer bust
        "player-wins",
        50
      ),
    ];

    const stats = calculateStatistics(history);
    expect(stats.timesPlayerBusted).toBe(1);
    expect(stats.timesDealerBusted).toBe(1);
  });

  it("should calculate win streaks correctly", () => {
    const history = [
      createMockGameResult(
        [
          { suit: "spades", rank: "10" },
          { suit: "hearts", rank: "9" },
        ],
        [
          { suit: "clubs", rank: "8" },
          { suit: "diamonds", rank: "7" },
        ],
        "player-wins",
        50
      ),
      createMockGameResult(
        [
          { suit: "hearts", rank: "K" },
          { suit: "spades", rank: "Q" },
        ],
        [
          { suit: "clubs", rank: "J" },
          { suit: "diamonds", rank: "10" },
        ],
        "player-wins",
        50
      ),
      createMockGameResult(
        [
          { suit: "spades", rank: "A" },
          { suit: "hearts", rank: "K" },
        ],
        [
          { suit: "clubs", rank: "10" },
          { suit: "diamonds", rank: "9" },
        ],
        "player-wins",
        100
      ),
    ];

    const stats = calculateStatistics(history);
    expect(stats.currentStreak.type).toBe("win");
    expect(stats.currentStreak.count).toBe(3);
    expect(stats.longestWinStreak).toBe(3);
    expect(stats.longestLossStreak).toBe(0);
  });

  it("should calculate loss streaks correctly", () => {
    const history = [
      createMockGameResult(
        [
          { suit: "spades", rank: "10" },
          { suit: "hearts", rank: "6" },
        ],
        [
          { suit: "clubs", rank: "A" },
          { suit: "diamonds", rank: "K" },
        ],
        "dealer-wins",
        -50
      ),
      createMockGameResult(
        [
          { suit: "hearts", rank: "8" },
          { suit: "spades", rank: "7" },
        ],
        [
          { suit: "clubs", rank: "10" },
          { suit: "diamonds", rank: "9" },
        ],
        "dealer-wins",
        -50
      ),
    ];

    const stats = calculateStatistics(history);
    expect(stats.currentStreak.type).toBe("loss");
    expect(stats.currentStreak.count).toBe(2);
    expect(stats.longestLossStreak).toBe(2);
  });

  it("should break streaks on push", () => {
    const history = [
      createMockGameResult(
        [
          { suit: "spades", rank: "10" },
          { suit: "hearts", rank: "9" },
        ],
        [
          { suit: "clubs", rank: "8" },
          { suit: "diamonds", rank: "7" },
        ],
        "player-wins",
        50
      ),
      createMockGameResult(
        [
          { suit: "hearts", rank: "K" },
          { suit: "spades", rank: "Q" },
        ],
        [
          { suit: "clubs", rank: "A" },
          { suit: "diamonds", rank: "9" },
        ],
        "push",
        0
      ),
      createMockGameResult(
        [
          { suit: "spades", rank: "8" },
          { suit: "hearts", rank: "7" },
        ],
        [
          { suit: "clubs", rank: "A" },
          { suit: "diamonds", rank: "K" },
        ],
        "dealer-wins",
        -50
      ),
    ];

    const stats = calculateStatistics(history);
    expect(stats.currentStreak.type).toBe("loss");
    expect(stats.currentStreak.count).toBe(1);
    expect(stats.longestWinStreak).toBe(1);
  });
});

describe("formatCurrency", () => {
  it("should format positive amounts with plus sign", () => {
    expect(formatCurrency(100)).toBe("+$100");
    expect(formatCurrency(50)).toBe("+$50");
  });

  it("should format negative amounts with minus sign", () => {
    expect(formatCurrency(-100)).toBe("$-100");
    expect(formatCurrency(-50)).toBe("$-50");
  });

  it("should format zero correctly", () => {
    expect(formatCurrency(0)).toBe("+$0");
  });
});

describe("formatPercentage", () => {
  it("should format percentages with default decimals", () => {
    expect(formatPercentage(50.5)).toBe("50.5%");
    expect(formatPercentage(33.333)).toBe("33.3%");
  });

  it("should format percentages with custom decimals", () => {
    expect(formatPercentage(50.555, 2)).toBe("50.55%");
    expect(formatPercentage(33.333, 0)).toBe("33%");
  });
});

describe("getStreakText", () => {
  it("should return correct text for no streak", () => {
    expect(getStreakText({ type: "none", count: 0 })).toBe("No active streak");
    expect(getStreakText({ type: "win", count: 0 })).toBe("No active streak");
  });

  it("should return correct text for single game streaks", () => {
    expect(getStreakText({ type: "win", count: 1 })).toBe("1 game win streak");
    expect(getStreakText({ type: "loss", count: 1 })).toBe(
      "1 game loss streak"
    );
  });

  it("should return correct text for multiple game streaks", () => {
    expect(getStreakText({ type: "win", count: 5 })).toBe("5 games win streak");
    expect(getStreakText({ type: "loss", count: 3 })).toBe(
      "3 games loss streak"
    );
  });
});
