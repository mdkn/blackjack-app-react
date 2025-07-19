import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CardPresentation } from "./CardPresentation";
import { Card } from "../../types";

describe("CardPresentation", () => {
  const mockCard: Card = {
    suit: "hearts",
    rank: "A",
    value: 11,
  };

  const defaultProps = {
    card: mockCard,
    suitSymbol: "♥",
    suitColor: "text-red-500",
    isHidden: false,
    size: "medium" as const,
  };

  it("should render card rank when not hidden", () => {
    render(<CardPresentation {...defaultProps} />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("should render suit symbol when not hidden", () => {
    render(<CardPresentation {...defaultProps} />);
    expect(screen.getByText("♥")).toBeInTheDocument();
  });

  it("should apply suit color class", () => {
    render(<CardPresentation {...defaultProps} />);
    const suitElement = screen.getByText("♥");
    expect(suitElement).toHaveClass("text-red-500");
  });

  it("should render back of card when hidden", () => {
    render(<CardPresentation {...defaultProps} isHidden={true} />);

    // Should not show rank or suit when hidden
    expect(screen.queryByText("A")).not.toBeInTheDocument();
    expect(screen.queryByText("♥")).not.toBeInTheDocument();
  });

  it("should handle different suits", () => {
    const spadeCard: Card = {
      suit: "spades",
      rank: "K",
      value: 10,
    };

    render(
      <CardPresentation
        {...defaultProps}
        card={spadeCard}
        suitSymbol="♠"
        suitColor="text-black"
      />
    );

    expect(screen.getByText("K")).toBeInTheDocument();
    expect(screen.getByText("♠")).toBeInTheDocument();

    const suitElement = screen.getByText("♠");
    expect(suitElement).toHaveClass("text-black");
  });

  it("should handle different card sizes", () => {
    render(<CardPresentation {...defaultProps} size="large" />);

    const cardElement = screen.getByText("A").closest("div");
    expect(cardElement).toBeInTheDocument();
  });

  it("should handle small card size", () => {
    render(<CardPresentation {...defaultProps} size="small" />);

    const cardElement = screen.getByText("A").closest("div");
    expect(cardElement).toBeInTheDocument();
  });

  it("should render different ranks correctly", () => {
    const numberCard: Card = {
      suit: "diamonds",
      rank: "10",
      value: 10,
    };

    render(
      <CardPresentation
        {...defaultProps}
        card={numberCard}
        suitSymbol="♦"
        suitColor="text-red-500"
      />
    );

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("♦")).toBeInTheDocument();
  });

  it("should handle face cards", () => {
    const queenCard: Card = {
      suit: "clubs",
      rank: "Q",
      value: 10,
    };

    render(
      <CardPresentation
        {...defaultProps}
        card={queenCard}
        suitSymbol="♣"
        suitColor="text-black"
      />
    );

    expect(screen.getByText("Q")).toBeInTheDocument();
    expect(screen.getByText("♣")).toBeInTheDocument();
  });

  it("should render card structure with proper elements", () => {
    render(<CardPresentation {...defaultProps} />);

    // Check that card has the proper structure
    const cardElement = screen.getByText("A").closest("div");
    expect(cardElement).toBeInTheDocument();

    // Both rank and suit should be present
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("♥")).toBeInTheDocument();
  });

  it("should handle ace card specifically", () => {
    render(<CardPresentation {...defaultProps} />);

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("♥")).toBeInTheDocument();
  });

  it("should apply correct styling classes for red suits", () => {
    render(<CardPresentation {...defaultProps} />);

    const suitElement = screen.getByText("♥");
    expect(suitElement).toHaveClass("text-red-500");
  });

  it("should apply correct styling classes for black suits", () => {
    const spadeCard: Card = {
      suit: "spades",
      rank: "7",
      value: 7,
    };

    render(
      <CardPresentation
        {...defaultProps}
        card={spadeCard}
        suitSymbol="♠"
        suitColor="text-black"
      />
    );

    const suitElement = screen.getByText("♠");
    expect(suitElement).toHaveClass("text-black");
  });
});
