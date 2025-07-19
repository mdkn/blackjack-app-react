import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useAppProps } from "./useAppProps";
import { useGameStore } from "../stores";

// Mock the dependencies
vi.mock("../stores");

const mockUseGameStore = vi.mocked(useGameStore);

describe("useAppProps", () => {
  beforeEach(() => {
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
  });

  it("should return navigation prop getters", () => {
    const { result } = renderHook(() => useAppProps());

    expect(typeof result.current.getNavButtonProps).toBe("function");
    expect(typeof result.current.getHistoryButtonProps).toBe("function");
    expect(typeof result.current.getSettingsButtonProps).toBe("function");
  });

  it("should initialize with game view", () => {
    const { result } = renderHook(() => useAppProps());
    expect(result.current.currentView).toBe("game");
  });

  it("should change view when setCurrentView is called", () => {
    const { result, rerender } = renderHook(() => useAppProps());

    expect(result.current.currentView).toBe("game");

    result.current.setCurrentView("stats");
    rerender();
    expect(result.current.currentView).toBe("stats");

    result.current.setCurrentView("game");
    rerender();
    expect(result.current.currentView).toBe("game");
  });

  it("should return correct nav button props for active view", () => {
    const { result } = renderHook(() => useAppProps());

    const gameButtonProps = result.current.getNavButtonProps("game");
    expect(gameButtonProps.className).toContain("bg-blue-600");
    expect(gameButtonProps.className).toContain("text-white");

    const statsButtonProps = result.current.getNavButtonProps("stats");
    expect(statsButtonProps.className).toContain("bg-gray-700");
    expect(statsButtonProps.className).toContain("text-gray-300");
  });

  it("should update nav button classes when view changes", () => {
    const { result, rerender } = renderHook(() => useAppProps());

    result.current.setCurrentView("stats");
    rerender();

    const gameButtonProps = result.current.getNavButtonProps("game");
    expect(gameButtonProps.className).toContain("bg-gray-700");

    const statsButtonProps = result.current.getNavButtonProps("stats");
    expect(statsButtonProps.className).toContain("bg-blue-600");
  });

  it("should handle history modal state", () => {
    const { result, rerender } = renderHook(() => useAppProps());

    expect(result.current.isHistoryOpen).toBe(false);

    const historyButtonProps = result.current.getHistoryButtonProps();
    historyButtonProps.onClick();
    rerender();

    expect(result.current.isHistoryOpen).toBe(true);
  });

  it("should handle settings modal state", () => {
    const { result, rerender } = renderHook(() => useAppProps());

    expect(result.current.isSettingsOpen).toBe(false);

    const settingsButtonProps = result.current.getSettingsButtonProps();
    settingsButtonProps.onClick();
    rerender();

    expect(result.current.isSettingsOpen).toBe(true);
  });

  it("should return game history props", () => {
    const { result } = renderHook(() => useAppProps());

    const gameHistoryProps = result.current.getGameHistoryProps();
    expect(gameHistoryProps).toEqual({
      history: [],
      isOpen: false,
      onClose: expect.any(Function),
    });
  });

  it("should return settings props", () => {
    const { result } = renderHook(() => useAppProps());

    const settingsProps = result.current.getSettingsProps();
    expect(settingsProps).toEqual({
      isOpen: false,
      onClose: expect.any(Function),
    });
  });
});
