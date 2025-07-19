import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CardPresentation } from "./CardPresentation";
import { Card } from "../../types";

describe("CardPresentation", () => {
  const mockCard: Card = {
    suit: "hearts",
    rank: "A",
  };

  const defaultProps = {
    card: mockCard,
    sizeClasses: "w-16 h-24 text-sm",
    isRed: true,
    cardType: "face-up" as const,
    isFaceCard: false,
  };

  it("should render card rank when not hidden", () => {
    render(<CardPresentation {...defaultProps} />);
    const rankElements = screen.getAllByText("A");
    expect(rankElements.length).toBeGreaterThan(0);
  });

  it("should render suit symbol when not hidden", () => {
    render(<CardPresentation {...defaultProps} />);
    const suitElements = screen.getAllByText("♥");
    expect(suitElements.length).toBeGreaterThan(0);
  });

  it("should apply suit color class", () => {
    render(<CardPresentation {...defaultProps} />);
    const suitElements = screen.getAllByText("♥");
    expect(suitElements[0].closest(".text-red-600")).toBeTruthy();
  });

  it("should render back of card when hidden", () => {
    render(<CardPresentation {...defaultProps} cardType="face-down" />);

    // Should not show rank or suit when hidden
    expect(screen.queryByText("A")).not.toBeInTheDocument();
    expect(screen.queryByText("♥")).not.toBeInTheDocument();
  });

  it("should handle different suits", () => {
    const spadeCard: Card = {
      suit: "spades",
      rank: "K",
    };

    render(
      <CardPresentation
        {...defaultProps}
        card={spadeCard}
        isRed={false}
        isFaceCard={true}
      />
    );

    const rankElements = screen.getAllByText("K");
    expect(rankElements.length).toBeGreaterThan(0);
    const suitElements = screen.getAllByText("♠");
    expect(suitElements.length).toBeGreaterThan(0);
  });

  it("should handle different card sizes", () => {
    render(
      <CardPresentation {...defaultProps} sizeClasses="w-20 h-32 text-lg" />
    );

    const cardElements = screen.getAllByText("A");
    const cardElement = cardElements[0].closest("div");
    expect(cardElement).toBeInTheDocument();
  });

  it("should handle small card size", () => {
    render(
      <CardPresentation {...defaultProps} sizeClasses="w-12 h-18 text-xs" />
    );

    const cardElements = screen.getAllByText("A");
    const cardElement = cardElements[0].closest("div");
    expect(cardElement).toBeInTheDocument();
  });

  it("should render different ranks correctly", () => {
    const numberCard: Card = {
      suit: "diamonds",
      rank: "10",
    };

    render(
      <CardPresentation {...defaultProps} card={numberCard} isRed={true} />
    );

    const rankElements = screen.getAllByText("10");
    expect(rankElements.length).toBeGreaterThan(0);
    const suitElements = screen.getAllByText("♦");
    expect(suitElements.length).toBeGreaterThan(0);
  });

  it("should handle face cards", () => {
    const queenCard: Card = {
      suit: "clubs",
      rank: "Q",
    };

    render(
      <CardPresentation
        {...defaultProps}
        card={queenCard}
        isRed={false}
        isFaceCard={true}
      />
    );

    const rankElements = screen.getAllByText("Q");
    expect(rankElements.length).toBeGreaterThan(0);
    const suitElements = screen.getAllByText("♣");
    expect(suitElements.length).toBeGreaterThan(0);
  });

  it("should render card structure with proper elements", () => {
    render(<CardPresentation {...defaultProps} />);

    // Check that card has the proper structure
    const cardElements = screen.getAllByText("A");
    const cardElement = cardElements[0].closest("div");
    expect(cardElement).toBeTruthy();

    // Both rank and suit should be present
    expect(cardElements.length).toBeGreaterThan(0);
    const suitElements = screen.getAllByText("♥");
    expect(suitElements.length).toBeGreaterThan(0);
  });

  it("should handle ace card specifically", () => {
    render(<CardPresentation {...defaultProps} />);

    const rankElements = screen.getAllByText("A");
    expect(rankElements.length).toBeGreaterThan(0);
    const suitElements = screen.getAllByText("♥");
    expect(suitElements.length).toBeGreaterThan(0);
  });

  it("should apply correct styling classes for red suits", () => {
    render(<CardPresentation {...defaultProps} />);

    const suitElements = screen.getAllByText("♥");
    expect(suitElements[0].closest(".text-red-600")).toBeTruthy();
  });

  it("should apply correct styling classes for black suits", () => {
    const spadeCard: Card = {
      suit: "spades",
      rank: "7",
    };

    render(
      <CardPresentation {...defaultProps} card={spadeCard} isRed={false} />
    );

    const suitElements = screen.getAllByText("♠");
    expect(suitElements[0].closest(".text-gray-900")).toBeTruthy();
  });
});
