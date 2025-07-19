import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useHandProps } from "./useHandProps";
import { Hand } from "../types";

describe("useHandProps", () => {
  const mockBlackjackHand: Hand = {
    cards: [
      { suit: "hearts", rank: "A" },
      { suit: "spades", rank: "K" },
    ],
    value: 21,
    isBlackjack: true,
    isBust: false,
  };

  const mockBustHand: Hand = {
    cards: [
      { suit: "hearts", rank: "10" },
      { suit: "spades", rank: "9" },
      { suit: "clubs", rank: "7" },
    ],
    value: 26,
    isBlackjack: false,
    isBust: true,
  };

  const mockTwentyOneHand: Hand = {
    cards: [
      { suit: "hearts", rank: "10" },
      { suit: "spades", rank: "5" },
      { suit: "clubs", rank: "6" },
    ],
    value: 21,
    isBlackjack: false,
    isBust: false,
  };

  const mockNormalHand: Hand = {
    cards: [
      { suit: "hearts", rank: "8" },
      { suit: "spades", rank: "7" },
    ],
    value: 15,
    isBlackjack: false,
    isBust: false,
  };

  it("should return red color for bust hand", () => {
    const { result } = renderHook(() => useHandProps({ hand: mockBustHand }));

    expect(result.current.statusColor).toBe("text-red-500");
    expect(result.current.statusText).toBe("BUST!");
  });

  it("should return yellow color for blackjack hand", () => {
    const { result } = renderHook(() =>
      useHandProps({ hand: mockBlackjackHand })
    );

    expect(result.current.statusColor).toBe("text-yellow-400");
    expect(result.current.statusText).toBe("BLACKJACK!");
  });

  it("should return green color for 21 (non-blackjack) hand", () => {
    const { result } = renderHook(() =>
      useHandProps({ hand: mockTwentyOneHand })
    );

    expect(result.current.statusColor).toBe("text-green-400");
    expect(result.current.statusText).toBe("21");
  });

  it("should return white color for normal hand", () => {
    const { result } = renderHook(() => useHandProps({ hand: mockNormalHand }));

    expect(result.current.statusColor).toBe("text-white");
    expect(result.current.statusText).toBe("15");
  });

  it("should return shouldHideCard function", () => {
    const { result } = renderHook(() =>
      useHandProps({ hand: mockNormalHand, hideCards: true })
    );

    expect(typeof result.current.shouldHideCard).toBe("function");
    expect(result.current.shouldHideCard(0, 2)).toBe(true);
  });

  it("should hide last card when hideLastCard is true", () => {
    const { result } = renderHook(() =>
      useHandProps({ hand: mockNormalHand, hideLastCard: true })
    );

    expect(result.current.shouldHideCard(1, 2)).toBe(true); // last card
    expect(result.current.shouldHideCard(0, 2)).toBe(false); // not last card
  });

  it("should not hide cards by default", () => {
    const { result } = renderHook(() => useHandProps({ hand: mockNormalHand }));

    expect(result.current.shouldHideCard(0, 2)).toBe(false);
    expect(result.current.shouldHideCard(1, 2)).toBe(false);
  });

  it("should return card count for hands with cards", () => {
    const { result } = renderHook(() => useHandProps({ hand: mockNormalHand }));

    expect(result.current.cardCount).toBe("2 cards");
  });

  it("should return hasSpecialAnimation for blackjack", () => {
    const { result } = renderHook(() =>
      useHandProps({ hand: mockBlackjackHand })
    );

    expect(result.current.hasSpecialAnimation).toBe(true);
  });

  it("should return hasSpecialAnimation for bust", () => {
    const { result } = renderHook(() => useHandProps({ hand: mockBustHand }));

    expect(result.current.hasSpecialAnimation).toBe(true);
  });

  it("should memoize status color and text", () => {
    const { result, rerender } = renderHook(props => useHandProps(props), {
      initialProps: { hand: mockBlackjackHand },
    });

    const firstStatusColor = result.current.statusColor;
    const firstStatusText = result.current.statusText;

    rerender({ hand: mockBlackjackHand });

    expect(result.current.statusColor).toBe(firstStatusColor);
    expect(result.current.statusText).toBe(firstStatusText);
  });
});
