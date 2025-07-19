import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { StatsPagePresentation } from "./StatsPagePresentation";
import { GameResult } from "../types";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock GameStats component
vi.mock("../components", () => ({
  GameStats: ({ history }: { history: GameResult[] }) => (
    <div data-testid="game-stats">GameStats with {history.length} games</div>
  ),
}));

describe("StatsPagePresentation", () => {
  const mockGameHistory: GameResult[] = [
    {
      id: "1",
      timestamp: new Date("2023-01-01T10:00:00Z"),
      result: "player-wins",
      playerHand: {
        cards: [
          { suit: "hearts", rank: "10", value: 10 },
          { suit: "spades", rank: "9", value: 9 },
        ],
        value: 19,
        isBlackjack: false,
        isBust: false,
      },
      dealerHand: {
        cards: [
          { suit: "clubs", rank: "10", value: 10 },
          { suit: "diamonds", rank: "8", value: 8 },
        ],
        value: 18,
        isBlackjack: false,
        isBust: false,
      },
      betAmount: 50,
      payout: 50,
    },
    {
      id: "2",
      timestamp: new Date("2023-01-01T11:00:00Z"),
      result: "dealer-wins",
      playerHand: {
        cards: [
          { suit: "hearts", rank: "10", value: 10 },
          { suit: "spades", rank: "6", value: 6 },
        ],
        value: 16,
        isBlackjack: false,
        isBust: false,
      },
      dealerHand: {
        cards: [
          { suit: "clubs", rank: "10", value: 10 },
          { suit: "diamonds", rank: "9", value: 9 },
        ],
        value: 19,
        isBlackjack: false,
        isBust: false,
      },
      betAmount: 25,
      payout: 0,
    },
  ];

  const defaultAnimationProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const defaultProps = {
    gameHistory: mockGameHistory,
    animationProps: defaultAnimationProps,
  };

  it("should render GameStats component", () => {
    const { getByTestId } = render(<StatsPagePresentation {...defaultProps} />);

    const gameStats = getByTestId("game-stats");
    expect(gameStats).toBeInTheDocument();
  });

  it("should pass game history to GameStats component", () => {
    const { getByTestId } = render(<StatsPagePresentation {...defaultProps} />);

    const gameStats = getByTestId("game-stats");
    expect(gameStats).toHaveTextContent("GameStats with 2 games");
  });

  it("should handle empty game history", () => {
    const { getByTestId } = render(
      <StatsPagePresentation {...defaultProps} gameHistory={[]} />
    );

    const gameStats = getByTestId("game-stats");
    expect(gameStats).toHaveTextContent("GameStats with 0 games");
  });

  it("should apply animation props to motion div", () => {
    const { container } = render(<StatsPagePresentation {...defaultProps} />);

    const motionDiv = container.firstChild as HTMLElement;
    expect(motionDiv).toBeInTheDocument();

    // Check that motion.div received the animation props
    expect(motionDiv).toHaveAttribute("initial");
    expect(motionDiv).toHaveAttribute("animate");
    expect(motionDiv).toHaveAttribute("transition");
  });

  it("should handle different animation props", () => {
    const customAnimationProps = {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.8, ease: "easeOut" },
    };

    const { container } = render(
      <StatsPagePresentation
        {...defaultProps}
        animationProps={customAnimationProps}
      />
    );

    const motionDiv = container.firstChild as HTMLElement;
    expect(motionDiv).toBeInTheDocument();
  });

  it("should render with single game in history", () => {
    const singleGameHistory = [mockGameHistory[0]];

    const { getByTestId } = render(
      <StatsPagePresentation
        {...defaultProps}
        gameHistory={singleGameHistory}
      />
    );

    const gameStats = getByTestId("game-stats");
    expect(gameStats).toHaveTextContent("GameStats with 1 games");
  });

  it("should render with large game history", () => {
    const largeGameHistory = Array(100)
      .fill(mockGameHistory[0])
      .map((game, index) => ({
        ...game,
        id: `game-${index}`,
      }));

    const { getByTestId } = render(
      <StatsPagePresentation {...defaultProps} gameHistory={largeGameHistory} />
    );

    const gameStats = getByTestId("game-stats");
    expect(gameStats).toHaveTextContent("GameStats with 100 games");
  });

  it("should have correct component structure", () => {
    const { container } = render(<StatsPagePresentation {...defaultProps} />);

    // Should have motion.div as root
    expect(container.firstChild).toBeInTheDocument();

    // Should contain GameStats
    const gameStats = container.querySelector('[data-testid="game-stats"]');
    expect(gameStats).toBeInTheDocument();
  });

  it("should maintain props interface", () => {
    // Test that all required props are accepted
    const props = {
      gameHistory: mockGameHistory,
      animationProps: defaultAnimationProps,
    };

    expect(() => {
      render(<StatsPagePresentation {...props} />);
    }).not.toThrow();
  });

  it("should handle animation props with different structure", () => {
    const minimalAnimationProps = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3 },
    };

    const { container } = render(
      <StatsPagePresentation
        {...defaultProps}
        animationProps={minimalAnimationProps}
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
