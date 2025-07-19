import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HandPresentation } from "./HandPresentation";
import { Hand } from "../../types";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock useAnimations hook
vi.mock("../../hooks", () => ({
  useAnimations: () => ({
    staggerContainer: {},
    staggerItem: {},
    result: {},
  }),
}));

// Mock Card component
vi.mock("../Card", () => ({
  Card: ({ card, faceDown, size }: any) => (
    <div data-testid="card" data-face-down={faceDown} data-size={size}>
      {card ? `${card.rank} of ${card.suit}` : "Empty Card"}
    </div>
  ),
}));

describe("HandPresentation", () => {
  const mockHand: Hand = {
    cards: [
      { suit: "hearts", rank: "A", value: 11 },
      { suit: "spades", rank: "K", value: 10 },
    ],
    value: 21,
    isBlackjack: true,
    isBust: false,
  };

  const defaultProps = {
    hand: mockHand,
    label: "Test Hand",
    statusText: "21",
    statusColor: "text-green-400",
    cardCount: "2 cards",
    hasSpecialAnimation: true,
    shouldHideCard: vi.fn(() => false),
    cardSize: "medium" as const,
    className: "test-class",
  };

  it("should render hand label", () => {
    render(<HandPresentation {...defaultProps} />);
    expect(screen.getByText("Test Hand")).toBeInTheDocument();
  });

  it("should render status text with correct color", () => {
    render(<HandPresentation {...defaultProps} />);
    const statusElement = screen.getByText("21");
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass("text-green-400");
  });

  it("should render cards when not hidden", () => {
    render(<HandPresentation {...defaultProps} />);
    const cards = screen.getAllByTestId("card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("A of hearts");
    expect(cards[1]).toHaveTextContent("K of spades");
  });

  it("should call shouldHideCard for each card", () => {
    const shouldHideCard = vi.fn(() => false);
    render(
      <HandPresentation {...defaultProps} shouldHideCard={shouldHideCard} />
    );

    expect(shouldHideCard).toHaveBeenCalledWith(0, 2);
    expect(shouldHideCard).toHaveBeenCalledWith(1, 2);
  });

  it("should render with different status colors", () => {
    render(
      <HandPresentation
        {...defaultProps}
        statusText="BUST!"
        statusColor="text-red-500"
      />
    );
    const statusElement = screen.getByText("BUST!");
    expect(statusElement).toHaveClass("text-red-500");
  });

  it("should render with different status text", () => {
    render(
      <HandPresentation
        {...defaultProps}
        statusText="BLACKJACK!"
        statusColor="text-yellow-400"
      />
    );
    expect(screen.getByText("BLACKJACK!")).toBeInTheDocument();
  });

  it("should handle empty hand", () => {
    const emptyHand: Hand = {
      cards: [],
      value: 0,
      isBlackjack: false,
      isBust: false,
    };

    render(
      <HandPresentation {...defaultProps} hand={emptyHand} statusText="0" />
    );

    expect(screen.getByText("Test Hand")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("should render with different card sizes", () => {
    render(<HandPresentation {...defaultProps} cardSize="large" />);

    const handElement = screen.getByText("Test Hand").closest("div");
    expect(handElement).toBeInTheDocument();
  });

  it("should hide cards when shouldHideCard returns true", () => {
    const shouldHideCard = vi.fn(index => index === 1); // Hide second card
    render(
      <HandPresentation {...defaultProps} shouldHideCard={shouldHideCard} />
    );

    const cards = screen.getAllByTestId("card");
    expect(cards[0]).toHaveAttribute("data-face-down", "false");
    expect(cards[1]).toHaveAttribute("data-face-down", "true");
  });

  it("should render card count", () => {
    render(<HandPresentation {...defaultProps} />);
    expect(screen.getByText("2 cards")).toBeInTheDocument();
  });

  it("should handle empty card count", () => {
    render(<HandPresentation {...defaultProps} cardCount="" />);

    expect(screen.queryByText("2 cards")).not.toBeInTheDocument();
  });

  it("should render multiple cards", () => {
    const multiCardHand: Hand = {
      cards: [
        { suit: "hearts", rank: "5", value: 5 },
        { suit: "spades", rank: "6", value: 6 },
        { suit: "clubs", rank: "4", value: 4 },
      ],
      value: 15,
      isBlackjack: false,
      isBust: false,
    };

    render(
      <HandPresentation
        {...defaultProps}
        hand={multiCardHand}
        statusText="15"
      />
    );

    expect(screen.getByText("Test Hand")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });
});
