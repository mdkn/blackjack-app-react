import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useGameStatsProps } from "./useGameStatsProps";
import { GameResult } from "../types";
import * as statisticsModule from "../lib/statistics/statistics";

// Mock the statistics module
vi.mock("../lib/statistics/statistics");

const mockCalculateStatistics = vi.mocked(statisticsModule.calculateStatistics);

describe("useGameStatsProps", () => {
  const mockHistory: GameResult[] = [
    {
      timestamp: new Date(),
      result: "player-wins",
      playerHand: {
        cards: [],
        value: 20,
        isBlackjack: false,
        isBust: false,
      },
      dealerHand: {
        cards: [],
        value: 19,
        isBlackjack: false,
        isBust: false,
      },
      winnings: 50,
    },
    {
      timestamp: new Date(),
      result: "dealer-wins",
      playerHand: {
        cards: [],
        value: 18,
        isBlackjack: false,
        isBust: false,
      },
      dealerHand: {
        cards: [],
        value: 20,
        isBlackjack: false,
        isBust: false,
      },
      winnings: 0,
    },
  ];

  const mockStats = {
    totalGames: 2,
    gamesWon: 1,
    gamesLost: 1,
    gamesPushed: 0,
    winRate: 50,
    totalWinnings: 50,
    biggestWin: 50,
    biggestLoss: -25,
    averageWinnings: 25,
    blackjacksHit: 0,
    timesPlayerBusted: 0,
    timesDealerBusted: 0,
    currentStreak: { type: "loss" as const, count: 1 },
    longestWinStreak: 1,
    longestLossStreak: 1,
  };

  beforeEach(() => {
    mockCalculateStatistics.mockReturnValue(mockStats);
    vi.clearAllMocks();
  });

  it("should call calculateStatistics with provided history", () => {
    renderHook(() => useGameStatsProps({ history: mockHistory }));

    expect(mockCalculateStatistics).toHaveBeenCalledWith(mockHistory);
  });

  it("should return calculated stats", () => {
    const { result } = renderHook(() =>
      useGameStatsProps({ history: mockHistory })
    );

    expect(result.current.stats).toEqual(mockStats);
  });

  it("should return getWinRateColor function that returns green for high win rate", () => {
    const { result } = renderHook(() =>
      useGameStatsProps({ history: mockHistory })
    );

    const color = result.current.getWinRateColor(75);
    expect(color).toBe("green");
  });

  it("should return getWinRateColor function that returns yellow for medium win rate", () => {
    const { result } = renderHook(() =>
      useGameStatsProps({ history: mockHistory })
    );

    const color = result.current.getWinRateColor(50);
    expect(color).toBe("yellow");
  });

  it("should return getWinRateColor function that returns red for low win rate", () => {
    const { result } = renderHook(() =>
      useGameStatsProps({ history: mockHistory })
    );

    const color = result.current.getWinRateColor(30);
    expect(color).toBe("red");
  });

  it("should return getProfitColor function that returns green for positive profit", () => {
    const { result } = renderHook(() =>
      useGameStatsProps({ history: mockHistory })
    );

    const color = result.current.getWinRateColor(70);
    expect(color).toBe("green");
  });

  it("should return getWinRateColor function that returns red for low win rate", () => {
    const { result } = renderHook(() =>
      useGameStatsProps({ history: mockHistory })
    );

    const color = result.current.getWinRateColor(30);
    expect(color).toBe("red");
  });

  it("should return getWinRateColor function that returns yellow for medium win rate", () => {
    const { result } = renderHook(() =>
      useGameStatsProps({ history: mockHistory })
    );

    const color = result.current.getWinRateColor(50);
    expect(color).toBe("yellow");
  });

  it("should return getStreakColor function that returns green for win streak", () => {
    const { result } = renderHook(() =>
      useGameStatsProps({ history: mockHistory })
    );

    const color = result.current.getStreakColor({ type: "win", count: 3 });
    expect(color).toBe("green");
  });

  it("should return getStreakColor function that returns red for loss streak", () => {
    const { result } = renderHook(() =>
      useGameStatsProps({ history: mockHistory })
    );

    const color = result.current.getStreakColor({ type: "loss", count: 2 });
    expect(color).toBe("red");
  });

  it("should return getStreakColor function that returns yellow for tie streak", () => {
    const { result } = renderHook(() =>
      useGameStatsProps({ history: mockHistory })
    );

    const color = result.current.getStreakColor({ type: "none", count: 0 });
    expect(color).toBe("gray");
  });

  it("should memoize stats calculation", () => {
    const { result, rerender } = renderHook(props => useGameStatsProps(props), {
      initialProps: { history: mockHistory },
    });

    const firstStats = result.current.stats;

    rerender({ history: mockHistory });

    expect(result.current.stats).toBe(firstStats);
    expect(mockCalculateStatistics).toHaveBeenCalledTimes(1);
  });

  it("should recalculate stats when history changes", () => {
    const { rerender } = renderHook(props => useGameStatsProps(props), {
      initialProps: { history: mockHistory },
    });

    const newHistory = [
      ...mockHistory,
      {
        timestamp: new Date(),
        result: "push" as const,
        playerHand: {
          cards: [],
          value: 20,
          isBlackjack: false,
          isBust: false,
        },
        dealerHand: {
          cards: [],
          value: 20,
          isBlackjack: false,
          isBust: false,
        },
        winnings: 10,
      },
    ];

    rerender({ history: newHistory });

    expect(mockCalculateStatistics).toHaveBeenCalledTimes(2);
    expect(mockCalculateStatistics).toHaveBeenLastCalledWith(newHistory);
  });

  it("should memoize color functions", () => {
    const { result, rerender } = renderHook(props => useGameStatsProps(props), {
      initialProps: { history: mockHistory },
    });

    const firstGetWinRateColor = result.current.getWinRateColor;
    const firstGetStreakColor = result.current.getStreakColor;

    rerender({ history: mockHistory });

    expect(result.current.getWinRateColor).toBe(firstGetWinRateColor);
    expect(result.current.getStreakColor).toBe(firstGetStreakColor);
  });
});
