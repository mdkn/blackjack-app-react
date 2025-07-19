import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { GameStatsPresentation } from "./GameStatsPresentation";
import { Statistics } from "../../lib/statistics/statistics";

describe("GameStatsPresentation", () => {
  const mockStats: Statistics = {
    totalGames: 10,
    gamesWon: 6,
    gamesLost: 3,
    gamesTied: 1,
    winRate: 60,
    totalWagered: 500,
    totalWinnings: 350,
    netProfit: -150,
    averageBet: 50,
    biggestWin: 100,
    biggestLoss: 75,
    longestWinStreak: 3,
    longestLossStreak: 2,
    currentStreak: { type: "win", count: 2 },
    blackjacks: 2,
    busts: 1,
  };

  const mockGetWinRateColor = (winRate: number) => {
    if (winRate >= 60) return "green";
    if (winRate >= 40) return "yellow";
    return "red";
  };

  const mockGetProfitColor = (profit: number) => {
    if (profit > 0) return "green";
    if (profit < 0) return "red";
    return "gray";
  };

  const mockGetStreakColor = (type: "win" | "loss" | "tie") => {
    if (type === "win") return "green";
    if (type === "loss") return "red";
    return "yellow";
  };

  const defaultProps = {
    stats: mockStats,
    getWinRateColor: mockGetWinRateColor,
    getProfitColor: mockGetProfitColor,
    getStreakColor: mockGetStreakColor,
  };

  it("should render total games", () => {
    render(<GameStatsPresentation {...defaultProps} />);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("should render games won", () => {
    render(<GameStatsPresentation {...defaultProps} />);
    expect(screen.getByText("6")).toBeInTheDocument();
  });

  it("should render games lost", () => {
    render(<GameStatsPresentation {...defaultProps} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should render games tied", () => {
    render(<GameStatsPresentation {...defaultProps} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should render win rate with percentage", () => {
    render(<GameStatsPresentation {...defaultProps} />);
    expect(screen.getByText("60%")).toBeInTheDocument();
  });

  it("should render total wagered", () => {
    render(<GameStatsPresentation {...defaultProps} />);
    expect(screen.getByText("$500")).toBeInTheDocument();
  });

  it("should render total winnings", () => {
    render(<GameStatsPresentation {...defaultProps} />);
    expect(screen.getByText("$350")).toBeInTheDocument();
  });

  it("should render net profit with correct sign", () => {
    render(<GameStatsPresentation {...defaultProps} />);
    expect(screen.getByText("-$150")).toBeInTheDocument();
  });

  it("should render positive net profit correctly", () => {
    const positiveStats = { ...mockStats, netProfit: 250 };
    render(<GameStatsPresentation {...defaultProps} stats={positiveStats} />);
    expect(screen.getByText("+$250")).toBeInTheDocument();
  });

  it("should render zero net profit correctly", () => {
    const zeroStats = { ...mockStats, netProfit: 0 };
    render(<GameStatsPresentation {...defaultProps} stats={zeroStats} />);
    expect(screen.getByText("$0")).toBeInTheDocument();
  });

  it("should render average bet", () => {
    render(<GameStatsPresentation {...defaultProps} />);
    expect(screen.getByText("$50")).toBeInTheDocument();
  });

  it("should render biggest win", () => {
    render(<GameStatsPresentation {...defaultProps} />);
    expect(screen.getByText("$100")).toBeInTheDocument();
  });

  it("should render biggest loss", () => {
    render(<GameStatsPresentation {...defaultProps} />);
    expect(screen.getByText("$75")).toBeInTheDocument();
  });

  it("should render longest win streak", () => {
    render(<GameStatsPresentation {...defaultProps} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should render longest loss streak", () => {
    render(<GameStatsPresentation {...defaultProps} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should render current streak count", () => {
    render(<GameStatsPresentation {...defaultProps} />);
    // Current streak count should be displayed
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should render blackjacks count", () => {
    render(<GameStatsPresentation {...defaultProps} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should render busts count", () => {
    render(<GameStatsPresentation {...defaultProps} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should handle zero stats", () => {
    const zeroStats: Statistics = {
      totalGames: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesTied: 0,
      winRate: 0,
      totalWagered: 0,
      totalWinnings: 0,
      netProfit: 0,
      averageBet: 0,
      biggestWin: 0,
      biggestLoss: 0,
      longestWinStreak: 0,
      longestLossStreak: 0,
      currentStreak: { type: "win", count: 0 },
      blackjacks: 0,
      busts: 0,
    };

    render(<GameStatsPresentation {...defaultProps} stats={zeroStats} />);

    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
  });

  it("should handle loss streak type", () => {
    const lossStreakStats = {
      ...mockStats,
      currentStreak: { type: "loss" as const, count: 3 },
    };

    render(<GameStatsPresentation {...defaultProps} stats={lossStreakStats} />);

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should handle tie streak type", () => {
    const tieStreakStats = {
      ...mockStats,
      currentStreak: { type: "tie" as const, count: 1 },
    };

    render(<GameStatsPresentation {...defaultProps} stats={tieStreakStats} />);

    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should render all statistical labels", () => {
    render(<GameStatsPresentation {...defaultProps} />);

    // Check for common statistical labels
    expect(screen.getByText(/Total Games/i)).toBeInTheDocument();
    expect(screen.getByText(/Win Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Net Profit/i)).toBeInTheDocument();
  });

  it("should handle large numbers", () => {
    const largeStats = {
      ...mockStats,
      totalWagered: 999999,
      totalWinnings: 888888,
      netProfit: 777777,
    };

    render(<GameStatsPresentation {...defaultProps} stats={largeStats} />);

    expect(screen.getByText("$999999")).toBeInTheDocument();
    expect(screen.getByText("$888888")).toBeInTheDocument();
    expect(screen.getByText("+$777777")).toBeInTheDocument();
  });
});
