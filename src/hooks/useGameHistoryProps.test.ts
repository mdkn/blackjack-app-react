import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useGameHistoryProps } from "./useGameHistoryProps";
import { GameResult } from "../types";

// Mock React.createElement for testing
const mockReactElement = { type: "mock", props: {} };
vi.mock("react", async () => {
  const actual = await vi.importActual("react");
  return {
    ...actual,
    createElement: vi.fn(() => mockReactElement),
  };
});

describe("useGameHistoryProps", () => {
  const mockPlayerWinResult: GameResult = {
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
  };

  const mockDealerWinResult: GameResult = {
    id: "2",
    timestamp: new Date("2023-01-01T11:00:00Z"),
    result: "dealer-wins",
    playerHand: {
      cards: [
        { suit: "hearts", rank: "10", value: 10 },
        { suit: "spades", rank: "8", value: 8 },
      ],
      value: 18,
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
  };

  const mockTieResult: GameResult = {
    id: "3",
    timestamp: new Date("2023-01-01T12:00:00Z"),
    result: "tie",
    playerHand: {
      cards: [
        { suit: "hearts", rank: "10", value: 10 },
        { suit: "spades", rank: "8", value: 8 },
      ],
      value: 18,
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
    betAmount: 75,
    payout: 75,
  };

  it("should format timestamp correctly", () => {
    const { result } = renderHook(() =>
      useGameHistoryProps({ history: [mockPlayerWinResult] })
    );

    expect(result.current.formatTimestamp).toBeDefined();
    const formatted = result.current.formatTimestamp(
      mockPlayerWinResult.timestamp
    );
    expect(formatted).toMatch(/\d{1,2}:\d{2}:\d{2} [AP]M/);
  });

  it("should return result color green for player wins", () => {
    const { result } = renderHook(() =>
      useGameHistoryProps({ history: [mockPlayerWinResult] })
    );

    expect(result.current.getResultColor).toBeDefined();
    const color = result.current.getResultColor("player-wins");
    expect(color).toBe("text-green-500");
  });

  it("should return result color red for dealer wins", () => {
    const { result } = renderHook(() =>
      useGameHistoryProps({ history: [mockDealerWinResult] })
    );

    expect(result.current.getResultColor).toBeDefined();
    const color = result.current.getResultColor("dealer-wins");
    expect(color).toBe("text-red-500");
  });

  it("should return result color yellow for tie", () => {
    const { result } = renderHook(() =>
      useGameHistoryProps({ history: [mockTieResult] })
    );

    expect(result.current.getResultColor).toBeDefined();
    const color = result.current.getResultColor("tie");
    expect(color).toBe("text-yellow-500");
  });

  it("should return result text WIN for player wins", () => {
    const { result } = renderHook(() =>
      useGameHistoryProps({ history: [mockPlayerWinResult] })
    );

    expect(result.current.getResultText).toBeDefined();
    const text = result.current.getResultText("player-wins");
    expect(text).toBe("WIN");
  });

  it("should return result text LOSS for dealer wins", () => {
    const { result } = renderHook(() =>
      useGameHistoryProps({ history: [mockDealerWinResult] })
    );

    expect(result.current.getResultText).toBeDefined();
    const text = result.current.getResultText("dealer-wins");
    expect(text).toBe("LOSS");
  });

  it("should return result text TIE for tie", () => {
    const { result } = renderHook(() =>
      useGameHistoryProps({ history: [mockTieResult] })
    );

    expect(result.current.getResultText).toBeDefined();
    const text = result.current.getResultText("tie");
    expect(text).toBe("TIE");
  });

  it("should return getResultIcon function", () => {
    const { result } = renderHook(() =>
      useGameHistoryProps({ history: [mockPlayerWinResult] })
    );

    expect(result.current.getResultIcon).toBeDefined();
    expect(typeof result.current.getResultIcon).toBe("function");
  });

  it("should pass through history prop", () => {
    const history = [mockPlayerWinResult, mockDealerWinResult, mockTieResult];
    const { result } = renderHook(() => useGameHistoryProps({ history }));

    expect(result.current.history).toBe(history);
  });

  it("should memoize functions", () => {
    const { result, rerender } = renderHook(
      props => useGameHistoryProps(props),
      {
        initialProps: { history: [mockPlayerWinResult] },
      }
    );

    const firstFormatTimestamp = result.current.formatTimestamp;
    const firstGetResultColor = result.current.getResultColor;
    const firstGetResultText = result.current.getResultText;
    const firstGetResultIcon = result.current.getResultIcon;

    rerender({ history: [mockPlayerWinResult] });

    expect(result.current.formatTimestamp).toBe(firstFormatTimestamp);
    expect(result.current.getResultColor).toBe(firstGetResultColor);
    expect(result.current.getResultText).toBe(firstGetResultText);
    expect(result.current.getResultIcon).toBe(firstGetResultIcon);
  });
});
