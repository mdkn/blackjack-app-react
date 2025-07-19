import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useGameProps } from "./useGameProps";
import { useGameStore, useSettingsStore } from "../stores";
import { useSound } from "./useSound";

// Mock the dependencies
vi.mock("../stores");
vi.mock("./useSound");

const mockUseGameStore = vi.mocked(useGameStore);
const mockUseSettingsStore = vi.mocked(useSettingsStore);
const mockUseSound = vi.mocked(useSound);

describe("useGameProps", () => {
  const mockPlaySound = vi.fn();
  const mockPlaceBet = vi.fn();
  const mockHit = vi.fn();
  const mockStand = vi.fn();
  const mockResetRound = vi.fn();
  const mockNewGame = vi.fn();

  const mockPlayer = {
    name: "Player",
    chips: 1000,
    hand: {
      cards: [],
      value: 0,
      isBlackjack: false,
      isBust: false,
    },
    currentBet: 50,
  };

  const mockDealer = {
    hand: {
      cards: [],
      value: 0,
      isBlackjack: false,
      isBust: false,
    },
  };

  const mockSettings = {
    cardSize: "medium" as const,
    betIncrements: [5, 10, 25, 50],
    defaultBet: 10,
    maxBet: 500,
    soundEnabled: true,
    soundVolume: 0.7,
    animationSpeed: "normal" as const,
    reducedMotion: false,
  };

  const mockGameStoreReturn = {
    player: mockPlayer,
    dealer: mockDealer,
    phase: "betting" as const,
    deck: { cards: [], remaining: 0 },
    gameHistory: [],
    hit: mockHit,
    stand: mockStand,
    resetRound: mockResetRound,
    newGame: mockNewGame,
    placeBet: mockPlaceBet,
    dealInitialCards: vi.fn(),
    dealerPlay: vi.fn(),
  };

  beforeEach(() => {
    mockUseGameStore.mockReturnValue(mockGameStoreReturn);

    mockUseSettingsStore.mockReturnValue({
      settings: mockSettings,
      updateSettings: vi.fn(),
      resetSettings: vi.fn(),
      getAnimationDuration: vi.fn(() => 0.3),
    });

    mockUseSound.mockReturnValue({
      playSound: mockPlaySound,
      isEnabled: true,
      volume: 0.7,
    });

    vi.clearAllMocks();
  });

  it("should return proper dealer hand props", () => {
    const { result } = renderHook(() => useGameProps());
    const dealerProps = result.current.getDealerHandProps();

    expect(dealerProps).toEqual({
      hand: mockDealer.hand,
      label: "Dealer",
      hideLastCard: false, // phase is "betting", not "player-turn" or "dealing"
      cardSize: "medium",
      className: "mb-4",
    });
  });

  it("should return proper player hand props", () => {
    const { result } = renderHook(() => useGameProps());
    const playerProps = result.current.getPlayerHandProps();

    expect(playerProps).toEqual({
      hand: mockPlayer.hand,
      label: "Your Hand",
      cardSize: "medium",
      className: "mb-4",
    });
  });

  it("should return proper betting props with sound wrapper", () => {
    const { result } = renderHook(() => useGameProps());
    const bettingProps = result.current.getBettingProps();

    expect(bettingProps.playerChips).toBe(1000);
    expect(bettingProps.currentBet).toBe(50);
    expect(bettingProps.presetBets).toEqual([5, 10, 25, 50]);
    expect(bettingProps.defaultBet).toBe(10);
    expect(bettingProps.maxBet).toBe(500);

    // Test the sound wrapper function
    bettingProps.onPlaceBet(100);
    expect(mockPlaySound).toHaveBeenCalledWith("chipPlace");
    expect(mockPlaceBet).toHaveBeenCalledWith(100);
  });

  it("should return proper game controls props with sound wrappers", () => {
    mockUseGameStore.mockReturnValue({
      ...mockGameStoreReturn,
      phase: "player-turn" as const,
    });

    const { result } = renderHook(() => useGameProps());
    const controlsProps = result.current.getGameControlsProps();

    expect(controlsProps.phase).toBe("player-turn");
    expect(controlsProps.playerCanHit).toBe(true);
    expect(controlsProps.onNewGame).toBe(mockNewGame);

    // Test sound wrapper functions
    controlsProps.onHit();
    expect(mockPlaySound).toHaveBeenCalledWith("cardDeal");
    expect(mockHit).toHaveBeenCalled();

    controlsProps.onStand();
    expect(mockPlaySound).toHaveBeenCalledWith("cardFlip");
    expect(mockStand).toHaveBeenCalled();

    controlsProps.onNewRound();
    expect(mockPlaySound).toHaveBeenCalledWith("chipPlace");
    expect(mockResetRound).toHaveBeenCalled();
  });

  it("should hide dealer last card during player turn", () => {
    mockUseGameStore.mockReturnValue({
      ...mockGameStoreReturn,
      phase: "player-turn" as const,
    });

    const { result } = renderHook(() => useGameProps());
    const dealerProps = result.current.getDealerHandProps();

    expect(dealerProps.hideLastCard).toBe(true);
  });

  it("should hide dealer last card during dealing", () => {
    mockUseGameStore.mockReturnValue({
      ...mockGameStoreReturn,
      phase: "dealing" as const,
    });

    const { result } = renderHook(() => useGameProps());
    const dealerProps = result.current.getDealerHandProps();

    expect(dealerProps.hideLastCard).toBe(true);
  });

  it("should calculate playerCanHit correctly", () => {
    const bustPlayer = {
      ...mockPlayer,
      hand: {
        ...mockPlayer.hand,
        isBust: true,
        value: 25,
      },
    };

    mockUseGameStore.mockReturnValue({
      ...mockGameStoreReturn,
      player: bustPlayer,
      phase: "player-turn" as const,
    });

    const { result } = renderHook(() => useGameProps());
    const controlsProps = result.current.getGameControlsProps();

    expect(controlsProps.playerCanHit).toBe(false);
  });
});
