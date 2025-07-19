import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useStatsPageProps } from "./useStatsPageProps";
import { useGameStore } from "../stores";

// Mock the dependencies
vi.mock("../stores");

const mockUseGameStore = vi.mocked(useGameStore);

describe("useStatsPageProps", () => {
  const mockGameHistory = [
    {
      id: "1",
      timestamp: new Date(),
      result: "player-wins" as const,
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
      betAmount: 50,
      payout: 50,
    },
  ];

  beforeEach(() => {
    mockUseGameStore.mockReturnValue({
      gameHistory: mockGameHistory,
      player: {
        name: "Player",
        chips: 1000,
        hand: { cards: [], value: 0, isBlackjack: false, isBust: false },
        currentBet: 0,
      },
      dealer: {
        hand: { cards: [], value: 0, isBlackjack: false, isBust: false },
      },
      phase: "betting",
      deck: { cards: [], remaining: 0 },
      hit: vi.fn(),
      stand: vi.fn(),
      resetRound: vi.fn(),
      newGame: vi.fn(),
      placeBet: vi.fn(),
      dealInitialCards: vi.fn(),
      dealerPlay: vi.fn(),
    });
    vi.clearAllMocks();
  });

  it("should return game history from store", () => {
    const { result } = renderHook(() => useStatsPageProps());

    expect(result.current.gameHistory).toBe(mockGameHistory);
  });

  it("should return animation props with correct initial values", () => {
    const { result } = renderHook(() => useStatsPageProps());

    expect(result.current.animationProps).toEqual({
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
    });
  });

  it("should memoize animation props", () => {
    const { result, rerender } = renderHook(() => useStatsPageProps());

    const firstAnimationProps = result.current.animationProps;
    rerender();

    expect(result.current.animationProps).toBe(firstAnimationProps);
  });

  it("should call useGameStore to get game history", () => {
    renderHook(() => useStatsPageProps());

    expect(mockUseGameStore).toHaveBeenCalled();
  });

  it("should return consistent shape across renders", () => {
    const { result, rerender } = renderHook(() => useStatsPageProps());

    const firstResult = result.current;
    rerender();

    expect(Object.keys(result.current)).toEqual(Object.keys(firstResult));
    expect(typeof result.current.gameHistory).toBe(
      typeof firstResult.gameHistory
    );
    expect(typeof result.current.animationProps).toBe(
      typeof firstResult.animationProps
    );
  });

  it("should handle empty game history", () => {
    mockUseGameStore.mockReturnValue({
      gameHistory: [],
      player: {
        name: "Player",
        chips: 1000,
        hand: { cards: [], value: 0, isBlackjack: false, isBust: false },
        currentBet: 0,
      },
      dealer: {
        hand: { cards: [], value: 0, isBlackjack: false, isBust: false },
      },
      phase: "betting",
      deck: { cards: [], remaining: 0 },
      hit: vi.fn(),
      stand: vi.fn(),
      resetRound: vi.fn(),
      newGame: vi.fn(),
      placeBet: vi.fn(),
      dealInitialCards: vi.fn(),
      dealerPlay: vi.fn(),
    });

    const { result } = renderHook(() => useStatsPageProps());

    expect(result.current.gameHistory).toEqual([]);
    expect(Array.isArray(result.current.gameHistory)).toBe(true);
  });
});
