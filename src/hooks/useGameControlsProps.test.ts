import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useGameControlsProps } from "./useGameControlsProps";
import { GamePhase } from "../types";

describe("useGameControlsProps", () => {
  it("should return correct status message and color for betting phase", () => {
    const { result } = renderHook(() =>
      useGameControlsProps({
        phase: "betting" as GamePhase,
        playerCanHit: false,
        playerChips: 1000,
      })
    );

    expect(result.current.statusMessage).toBe(
      "Place your bet to start the round"
    );
    expect(result.current.statusMessageColor).toBe("text-blue-400");
  });

  it("should return correct status message and color for dealing phase", () => {
    const { result } = renderHook(() =>
      useGameControlsProps({
        phase: "dealing" as GamePhase,
        playerCanHit: false,
        playerChips: 1000,
      })
    );

    expect(result.current.statusMessage).toBe("Dealing cards...");
    expect(result.current.statusMessageColor).toBe("text-yellow-400");
  });

  it("should return correct status message and color for player-turn when can hit", () => {
    const { result } = renderHook(() =>
      useGameControlsProps({
        phase: "player-turn" as GamePhase,
        playerCanHit: true,
        playerChips: 1000,
      })
    );

    expect(result.current.statusMessage).toBe("Your turn - Hit or Stand?");
    expect(result.current.statusMessageColor).toBe("text-green-400");
  });

  it("should return correct status message and color for player-turn when cannot hit", () => {
    const { result } = renderHook(() =>
      useGameControlsProps({
        phase: "player-turn" as GamePhase,
        playerCanHit: false,
        playerChips: 1000,
      })
    );

    expect(result.current.statusMessage).toBe(
      "You cannot hit (hand value too high)"
    );
    expect(result.current.statusMessageColor).toBe("text-orange-400");
  });

  it("should return correct status message and color for dealer-turn phase", () => {
    const { result } = renderHook(() =>
      useGameControlsProps({
        phase: "dealer-turn" as GamePhase,
        playerCanHit: false,
        playerChips: 1000,
      })
    );

    expect(result.current.statusMessage).toBe("Dealer is playing...");
    expect(result.current.statusMessageColor).toBe("text-purple-400");
  });

  it("should return correct status message and color for game-over phase", () => {
    const { result } = renderHook(() =>
      useGameControlsProps({
        phase: "game-over" as GamePhase,
        playerCanHit: false,
        playerChips: 1000,
      })
    );

    expect(result.current.statusMessage).toBe("Round complete!");
    expect(result.current.statusMessageColor).toBe("text-gray-300");
  });

  it("should return correct control states", () => {
    const { result } = renderHook(() =>
      useGameControlsProps({
        phase: "player-turn" as GamePhase,
        playerCanHit: true,
        playerChips: 1000,
        disabled: false,
      })
    );

    expect(result.current.canHit).toBe(true);
    expect(result.current.canStand).toBe(true);
    expect(result.current.canNextRound).toBe(true);
    expect(result.current.canNewGame).toBe(true);
  });

  it("should disable controls when disabled prop is true", () => {
    const { result } = renderHook(() =>
      useGameControlsProps({
        phase: "player-turn" as GamePhase,
        playerCanHit: true,
        playerChips: 1000,
        disabled: true,
      })
    );

    expect(result.current.canHit).toBe(false);
    expect(result.current.canStand).toBe(false);
    expect(result.current.canNextRound).toBe(false);
    expect(result.current.canNewGame).toBe(false);
  });

  it("should disable next round button when player has $0", () => {
    const { result } = renderHook(() =>
      useGameControlsProps({
        phase: "game-over" as GamePhase,
        playerCanHit: false,
        playerChips: 0,
      })
    );

    expect(result.current.canNextRound).toBe(false);
    expect(result.current.canNewGame).toBe(true); // New game should still be available
  });

  it("should enable next round button when player has chips", () => {
    const { result } = renderHook(() =>
      useGameControlsProps({
        phase: "game-over" as GamePhase,
        playerCanHit: false,
        playerChips: 100,
      })
    );

    expect(result.current.canNextRound).toBe(true);
    expect(result.current.canNewGame).toBe(true);
  });

  it("should memoize status message and color", () => {
    const { result, rerender } = renderHook(
      props => useGameControlsProps(props),
      {
        initialProps: {
          phase: "betting" as GamePhase,
          playerCanHit: false,
          playerChips: 1000,
        },
      }
    );

    const firstStatusMessage = result.current.statusMessage;
    const firstStatusMessageColor = result.current.statusMessageColor;

    rerender({
      phase: "betting" as GamePhase,
      playerCanHit: false,
      playerChips: 1000,
    });

    expect(result.current.statusMessage).toBe(firstStatusMessage);
    expect(result.current.statusMessageColor).toBe(firstStatusMessageColor);
  });

  it("should update status when phase changes", () => {
    const { result, rerender } = renderHook(
      props => useGameControlsProps(props),
      {
        initialProps: {
          phase: "betting" as GamePhase,
          playerCanHit: false,
          playerChips: 1000,
        },
      }
    );

    expect(result.current.statusMessage).toBe(
      "Place your bet to start the round"
    );

    rerender({
      phase: "player-turn" as GamePhase,
      playerCanHit: true,
      playerChips: 1000,
    });

    expect(result.current.statusMessage).toBe("Your turn - Hit or Stand?");
  });
});
