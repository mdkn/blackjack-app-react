import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BettingPresentation } from "./BettingPresentation";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
}));

// Mock useAnimations hook
vi.mock("../../hooks", () => ({
  useAnimations: () => ({
    button: {},
    chipBet: {},
  }),
}));

describe("BettingPresentation", () => {
  const defaultProps = {
    playerChips: 1000,
    currentBet: 50,
    customBet: 25,
    minBet: 5,
    effectiveMaxBet: 500,
    presetBets: [5, 10, 25, 50],
    disabled: false,
    setCustomBet: vi.fn(),
    handlePresetBet: vi.fn(),
    handleCustomBet: vi.fn(),
    incrementCustomBet: vi.fn(),
    decrementCustomBet: vi.fn(),
    canPlaceCustomBet: true,
    canAffordAmount: vi.fn((amount: number) => amount <= 1000),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display current chips", () => {
    render(<BettingPresentation {...defaultProps} />);

    expect(screen.getByText(/1000/)).toBeInTheDocument();
  });

  it("should display current bet", () => {
    render(<BettingPresentation {...defaultProps} />);

    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it("should render preset bet buttons", () => {
    render(<BettingPresentation {...defaultProps} />);

    expect(screen.getByText("$5")).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();
    expect(screen.getByText("$25")).toBeInTheDocument();
    expect(screen.getByText("$50")).toBeInTheDocument();
  });

  it("should call handlePresetBet when preset bet button is clicked", () => {
    render(<BettingPresentation {...defaultProps} />);

    const bet25Button = screen.getByText("$25");
    fireEvent.click(bet25Button);

    expect(defaultProps.handlePresetBet).toHaveBeenCalledWith(25);
  });

  it("should call handlePresetBet with all preset bet amounts", () => {
    render(<BettingPresentation {...defaultProps} />);

    const bet5Button = screen.getByText("$5");
    const bet10Button = screen.getByText("$10");
    const bet25Button = screen.getByText("$25");
    const bet50Button = screen.getByText("$50");

    fireEvent.click(bet5Button);
    expect(defaultProps.handlePresetBet).toHaveBeenCalledWith(5);

    fireEvent.click(bet10Button);
    expect(defaultProps.handlePresetBet).toHaveBeenCalledWith(10);

    fireEvent.click(bet25Button);
    expect(defaultProps.handlePresetBet).toHaveBeenCalledWith(25);

    fireEvent.click(bet50Button);
    expect(defaultProps.handlePresetBet).toHaveBeenCalledWith(50);
  });

  it("should disable bet buttons when bet amount exceeds player chips", () => {
    const canAffordAmount = vi.fn((amount: number) => amount <= 20);
    render(
      <BettingPresentation
        {...defaultProps}
        playerChips={20}
        canAffordAmount={canAffordAmount}
      />
    );

    const bet25Button = screen.getByText("$25");
    const bet50Button = screen.getByText("$50");

    expect(bet25Button).toBeDisabled();
    expect(bet50Button).toBeDisabled();
  });

  it("should enable bet buttons when bet amount is within player chips", () => {
    const canAffordAmount = vi.fn((amount: number) => amount <= 100);
    render(
      <BettingPresentation
        {...defaultProps}
        playerChips={100}
        canAffordAmount={canAffordAmount}
      />
    );

    const bet5Button = screen.getByText("$5");
    const bet10Button = screen.getByText("$10");
    const bet25Button = screen.getByText("$25");
    const bet50Button = screen.getByText("$50");

    expect(bet5Button).not.toBeDisabled();
    expect(bet10Button).not.toBeDisabled();
    expect(bet25Button).not.toBeDisabled();
    expect(bet50Button).not.toBeDisabled();
  });

  it("should handle zero chips", () => {
    const canAffordAmount = vi.fn(() => false);
    render(
      <BettingPresentation
        {...defaultProps}
        playerChips={0}
        canAffordAmount={canAffordAmount}
      />
    );

    expect(screen.getByText(/0/)).toBeInTheDocument();

    // All bet buttons should be disabled
    const bet5Button = screen.getByText("$5");
    const bet10Button = screen.getByText("$10");
    const bet25Button = screen.getByText("$25");
    const bet50Button = screen.getByText("$50");

    expect(bet5Button).toBeDisabled();
    expect(bet10Button).toBeDisabled();
    expect(bet25Button).toBeDisabled();
    expect(bet50Button).toBeDisabled();
  });

  it("should handle zero current bet", () => {
    render(<BettingPresentation {...defaultProps} currentBet={0} />);

    expect(screen.getByText(/0/)).toBeInTheDocument();
  });

  it("should render with different preset bet amounts", () => {
    const customPresetBets = [1, 5, 20, 100];
    render(
      <BettingPresentation {...defaultProps} presetBets={customPresetBets} />
    );

    expect(screen.getByText("$1")).toBeInTheDocument();
    expect(screen.getByText("$5")).toBeInTheDocument();
    expect(screen.getByText("$20")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
  });

  it("should handle large chip amounts", () => {
    render(
      <BettingPresentation
        {...defaultProps}
        playerChips={999999}
        currentBet={1000}
      />
    );

    expect(screen.getByText(/999999/)).toBeInTheDocument();
    expect(screen.getByText(/1000/)).toBeInTheDocument();
  });

  it("should maintain button accessibility", () => {
    render(<BettingPresentation {...defaultProps} />);

    const bet5Button = screen.getByText("$5");
    const bet10Button = screen.getByText("$10");
    const bet25Button = screen.getByText("$25");
    const bet50Button = screen.getByText("$50");

    expect(bet5Button).toHaveAttribute("type", "button");
    expect(bet10Button).toHaveAttribute("type", "button");
    expect(bet25Button).toHaveAttribute("type", "button");
    expect(bet50Button).toHaveAttribute("type", "button");
  });

  it("should handle empty preset bets array", () => {
    render(<BettingPresentation {...defaultProps} presetBets={[]} />);

    // Should still render chips and current bet
    expect(screen.getByText(/1000/)).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });
});
