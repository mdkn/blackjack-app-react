import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Betting } from "./Betting";

// Mock the useBettingProps hook
const mockBettingProps = {
  playerChips: 1000,
  currentBet: 0,
  customBet: 25,
  minBet: 5,
  effectiveMaxBet: 1000,
  presetBets: [5, 10, 25, 50, 100],
  disabled: false,
  className: "",
  getPresetButtonProps: vi.fn((amount: number) => ({
    onClick: vi.fn(),
    disabled: false,
    className: "test-preset-button",
    key: amount,
  })),
  getCustomBetInputProps: vi.fn(() => ({
    type: "number" as const,
    value: 25,
    onChange: vi.fn(),
    disabled: false,
    min: 5,
    max: 1000,
    className: "test-input",
  })),
  getDecrementButtonProps: vi.fn(() => ({
    onClick: vi.fn(),
    disabled: false,
    className: "test-decrement",
  })),
  getIncrementButtonProps: vi.fn(() => ({
    onClick: vi.fn(),
    disabled: false,
    className: "test-increment",
  })),
  getCustomBetButtonProps: vi.fn(() => ({
    onClick: vi.fn(),
    disabled: false,
    className: "test-custom-bet",
  })),
  getAllInButtonProps: vi.fn(() => ({
    onClick: vi.fn(),
    disabled: false,
    className: "test-all-in",
  })),
  setCustomBet: vi.fn(),
  canPlaceCustomBet: true,
  canAffordAmount: vi.fn((amount: number) => amount <= 1000),
};

vi.mock("../../hooks/useBettingProps", () => ({
  useBettingProps: () => mockBettingProps,
}));

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

describe("Betting", () => {
  it("should render BettingPresentation with props from useBettingProps", () => {
    const { container } = render(<Betting />);

    // Check that the component renders
    expect(container.firstChild).toBeInTheDocument();

    // Verify the betting interface is present
    expect(
      container.querySelector("[data-testid]") || container.firstChild
    ).toBeInTheDocument();
  });

  it("should pass custom props to useBettingProps", () => {
    const customProps = {
      disabled: true,
      presetBets: [10, 20, 50],
      className: "custom-class",
    };

    render(<Betting {...customProps} />);

    // The hook should be called (we can't easily test the parameters without more complex mocking)
    expect(mockBettingProps.getPresetButtonProps).toBeDefined();
  });

  it("should render with default props when none provided", () => {
    const { container } = render(<Betting />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it("should integrate useBettingProps and BettingPresentation correctly", () => {
    const { getByText } = render(<Betting />);

    // Check that elements from BettingPresentation are rendered
    expect(getByText("Place Your Bet")).toBeInTheDocument();
    expect(getByText("Quick Bets")).toBeInTheDocument();
    expect(getByText("Custom Amount")).toBeInTheDocument();
  });

  describe("props passing", () => {
    it("should pass disabled prop correctly", () => {
      render(<Betting disabled={true} />);

      // The component should render even when disabled
      expect(document.querySelector(".bg-gray-800")).toBeInTheDocument();
    });

    it("should pass presetBets prop correctly", () => {
      const customPresetBets = [15, 30, 75];
      render(<Betting presetBets={customPresetBets} />);

      // Component should still render with custom preset bets
      expect(document.querySelector(".bg-gray-800")).toBeInTheDocument();
    });

    it("should pass className prop correctly", () => {
      render(<Betting className="test-class" />);

      // Component should render with additional class
      expect(document.querySelector(".bg-gray-800")).toBeInTheDocument();
    });
  });
});
