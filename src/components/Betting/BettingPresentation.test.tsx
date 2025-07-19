import { render, screen } from "@testing-library/react";
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
  const mockProps = {
    playerChips: 1000,
    currentBet: 50,
    customBet: 25,
    minBet: 5,
    effectiveMaxBet: 500,
    presetBets: [5, 10, 25, 50],
    disabled: false,
    className: "",
    getPresetButtonProps: vi.fn((amount: number) => ({
      onClick: vi.fn(),
      disabled: false,
      className: "mock-preset-button-class",
      key: amount,
    })),
    getCustomBetInputProps: vi.fn(() => ({
      type: "number" as const,
      value: 25,
      onChange: vi.fn(),
      disabled: false,
      min: 5,
      max: 500,
      className: "mock-input-class",
    })),
    getDecrementButtonProps: vi.fn(() => ({
      onClick: vi.fn(),
      disabled: false,
      className: "mock-decrement-class",
    })),
    getIncrementButtonProps: vi.fn(() => ({
      onClick: vi.fn(),
      disabled: false,
      className: "mock-increment-class",
    })),
    getCustomBetButtonProps: vi.fn(() => ({
      onClick: vi.fn(),
      disabled: false,
      className: "mock-custom-bet-class",
    })),
    getAllInButtonProps: vi.fn(() => ({
      onClick: vi.fn(),
      disabled: false,
      className: "mock-all-in-class",
    })),
    setCustomBet: vi.fn(),
    canPlaceCustomBet: true,
    canAffordAmount: vi.fn((amount: number) => amount <= 1000),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display betting interface", () => {
    render(<BettingPresentation {...mockProps} />);

    expect(screen.getByText("Place Your Bet")).toBeInTheDocument();
    expect(screen.getByText("Your Chips")).toBeInTheDocument();
    expect(screen.getByText("$1000")).toBeInTheDocument();
  });

  it("should display current bet when greater than 0", () => {
    render(<BettingPresentation {...mockProps} />);

    expect(screen.getByText("Current Bet")).toBeInTheDocument();
    expect(screen.getByText("$50")).toBeInTheDocument();
  });

  it("should render preset bet buttons", () => {
    render(<BettingPresentation {...mockProps} />);

    expect(screen.getByText("$5")).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();
    expect(screen.getByText("$25")).toBeInTheDocument();
    expect(screen.getByText("$50")).toBeInTheDocument();
  });

  it("should render custom bet controls", () => {
    render(<BettingPresentation {...mockProps} />);

    expect(screen.getByText("Custom Amount")).toBeInTheDocument();
    expect(screen.getByDisplayValue("25")).toBeInTheDocument();
    expect(screen.getByText("Bet $25")).toBeInTheDocument();
    expect(screen.getByText("All In")).toBeInTheDocument();
  });

  it("should display betting rules", () => {
    render(<BettingPresentation {...mockProps} />);

    expect(screen.getByText(/Minimum bet: \$5/)).toBeInTheDocument();
    expect(screen.getByText(/Blackjack pays 3:2/)).toBeInTheDocument();
  });

  it("should call props getter functions", () => {
    render(<BettingPresentation {...mockProps} />);

    // Check that all props getter functions are called
    expect(mockProps.getPresetButtonProps).toHaveBeenCalledWith(5);
    expect(mockProps.getPresetButtonProps).toHaveBeenCalledWith(10);
    expect(mockProps.getPresetButtonProps).toHaveBeenCalledWith(25);
    expect(mockProps.getPresetButtonProps).toHaveBeenCalledWith(50);
    expect(mockProps.getCustomBetInputProps).toHaveBeenCalled();
    expect(mockProps.getDecrementButtonProps).toHaveBeenCalled();
    expect(mockProps.getIncrementButtonProps).toHaveBeenCalled();
    expect(mockProps.getCustomBetButtonProps).toHaveBeenCalled();
    expect(mockProps.getAllInButtonProps).toHaveBeenCalled();
  });

  it("should pass correct props to motion buttons", () => {
    render(<BettingPresentation {...mockProps} />);

    // Verify that button props are properly spread
    const presetButtons = screen.getAllByText(/^\$\d+$/);
    expect(presetButtons).toHaveLength(4);

    // Check custom bet button
    const customBetButton = screen.getByText("Bet $25");
    expect(customBetButton).toBeInTheDocument();

    // Check all in button
    const allInButton = screen.getByText("All In");
    expect(allInButton).toBeInTheDocument();
  });

  it("should handle button interactions correctly", () => {
    render(<BettingPresentation {...mockProps} />);

    // Test preset button click
    const fiveButton = screen.getByText("$5");
    fiveButton.click();
    expect(mockProps.getPresetButtonProps(5).onClick).toHaveBeenCalled();

    // Test custom bet button click
    const customBetButton = screen.getByText("Bet $25");
    customBetButton.click();
    expect(mockProps.getCustomBetButtonProps().onClick).toHaveBeenCalled();

    // Test all in button click
    const allInButton = screen.getByText("All In");
    allInButton.click();
    expect(mockProps.getAllInButtonProps().onClick).toHaveBeenCalled();
  });

  it("should handle input changes correctly", () => {
    render(<BettingPresentation {...mockProps} />);

    const input = screen.getByDisplayValue("25");
    expect(input).toBeInTheDocument();

    // The input props should be properly applied
    expect(mockProps.getCustomBetInputProps).toHaveBeenCalled();
  });
});
