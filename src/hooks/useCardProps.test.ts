import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useCardProps } from "./useCardProps";
import { Card } from "../types";

describe("useCardProps", () => {
  const mockCard: Card = {
    suit: "hearts",
    rank: "A",
  };

  const mockSpadeCard: Card = {
    suit: "spades",
    rank: "K",
  };

  const mockClubCard: Card = {
    suit: "clubs",
    rank: "Q",
  };

  const mockDiamondCard: Card = {
    suit: "diamonds",
    rank: "J",
  };

  it("should return red color for hearts", () => {
    const { result } = renderHook(() => useCardProps({ card: mockCard }));

    expect(result.current.isRed).toBe(true);
  });

  it("should return red color for diamonds", () => {
    const { result } = renderHook(() =>
      useCardProps({ card: mockDiamondCard })
    );

    expect(result.current.isRed).toBe(true);
  });

  it("should return black color for spades", () => {
    const { result } = renderHook(() => useCardProps({ card: mockSpadeCard }));

    expect(result.current.isRed).toBe(false);
  });

  it("should return black color for clubs", () => {
    const { result } = renderHook(() => useCardProps({ card: mockClubCard }));

    expect(result.current.isRed).toBe(false);
  });

  it("should handle faceDown prop", () => {
    const { result } = renderHook(() =>
      useCardProps({ card: mockCard, faceDown: true })
    );

    expect(result.current.cardType).toBe("face-down");
  });

  it("should default to face-up when not faceDown", () => {
    const { result } = renderHook(() => useCardProps({ card: mockCard }));

    expect(result.current.cardType).toBe("face-up");
  });

  it("should handle size prop", () => {
    const { result } = renderHook(() =>
      useCardProps({ card: mockCard, size: "large" })
    );

    expect(result.current.sizeClasses).toContain("w-20");
  });

  it("should default size to medium", () => {
    const { result } = renderHook(() => useCardProps({ card: mockCard }));

    expect(result.current.sizeClasses).toContain("w-16");
  });

  it("should detect face cards correctly", () => {
    const { result } = renderHook(
      () => useCardProps({ card: mockSpadeCard }) // King
    );

    expect(result.current.isFaceCard).toBe(true);
  });

  it("should detect non-face cards correctly", () => {
    const { result } = renderHook(
      () => useCardProps({ card: mockCard }) // Ace
    );

    expect(result.current.isFaceCard).toBe(false);
  });

  it("should handle empty card", () => {
    const { result } = renderHook(() => useCardProps({ card: undefined }));

    expect(result.current.cardType).toBe("empty");
    expect(result.current.isRed).toBe(false);
    expect(result.current.isFaceCard).toBe(false);
  });

  it("should memoize computed values", () => {
    const { result, rerender } = renderHook(props => useCardProps(props), {
      initialProps: { card: mockCard },
    });

    const firstIsRed = result.current.isRed;
    const firstCardType = result.current.cardType;

    rerender({ card: mockCard });

    expect(result.current.isRed).toBe(firstIsRed);
    expect(result.current.cardType).toBe(firstCardType);
  });

  it("should update when card changes", () => {
    const { result, rerender } = renderHook(props => useCardProps(props), {
      initialProps: { card: mockCard },
    });

    expect(result.current.isRed).toBe(true);

    rerender({ card: mockSpadeCard });

    expect(result.current.isRed).toBe(false);
  });
});
