import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GameControlsPresentation } from "./GameControlsPresentation";
import { GamePhase } from "../../types";

describe("GameControlsPresentation", () => {
  const defaultProps = {
    phase: "player-turn" as GamePhase,
    playerCanHit: true,
    disabled: false,
    statusMessage: "Your turn - Hit or Stand?",
    statusMessageColor: "text-green-400",
    onHit: vi.fn(),
    onStand: vi.fn(),
    onNewRound: vi.fn(),
    onNewGame: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render status message with correct color", () => {
    render(<GameControlsPresentation {...defaultProps} />);

    const statusElement = screen.getByText("Your turn - Hit or Stand?");
    expect(statusElement).toBeInTheDocument();
    expect(statusElement).toHaveClass("text-green-400");
  });

  it("should render Hit button during player turn when can hit", () => {
    render(<GameControlsPresentation {...defaultProps} />);

    const hitButton = screen.getByText("Hit");
    expect(hitButton).toBeInTheDocument();
    expect(hitButton).not.toBeDisabled();
  });

  it("should render Stand button during player turn", () => {
    render(<GameControlsPresentation {...defaultProps} />);

    const standButton = screen.getByText("Stand");
    expect(standButton).toBeInTheDocument();
    expect(standButton).not.toBeDisabled();
  });

  it("should call onHit when Hit button is clicked", () => {
    render(<GameControlsPresentation {...defaultProps} />);

    const hitButton = screen.getByText("Hit");
    fireEvent.click(hitButton);

    expect(defaultProps.onHit).toHaveBeenCalledTimes(1);
  });

  it("should call onStand when Stand button is clicked", () => {
    render(<GameControlsPresentation {...defaultProps} />);

    const standButton = screen.getByText("Stand");
    fireEvent.click(standButton);

    expect(defaultProps.onStand).toHaveBeenCalledTimes(1);
  });

  it("should disable Hit button when playerCanHit is false", () => {
    render(<GameControlsPresentation {...defaultProps} playerCanHit={false} />);

    const hitButton = screen.getByText("Hit");
    expect(hitButton).toBeDisabled();
  });

  it("should disable all buttons when disabled prop is true", () => {
    render(<GameControlsPresentation {...defaultProps} disabled={true} />);

    const hitButton = screen.getByText("Hit");
    const standButton = screen.getByText("Stand");

    expect(hitButton).toBeDisabled();
    expect(standButton).toBeDisabled();
  });

  it("should render New Round button during game-over phase", () => {
    render(
      <GameControlsPresentation
        {...defaultProps}
        phase="game-over"
        statusMessage="Round complete - Start a new round?"
        statusMessageColor="text-gray-400"
      />
    );

    const newRoundButton = screen.getByText("New Round");
    expect(newRoundButton).toBeInTheDocument();
  });

  it("should call onNewRound when New Round button is clicked", () => {
    render(
      <GameControlsPresentation
        {...defaultProps}
        phase="game-over"
        statusMessage="Round complete - Start a new round?"
        statusMessageColor="text-gray-400"
      />
    );

    const newRoundButton = screen.getByText("New Round");
    fireEvent.click(newRoundButton);

    expect(defaultProps.onNewRound).toHaveBeenCalledTimes(1);
  });

  it("should render New Game button", () => {
    render(<GameControlsPresentation {...defaultProps} />);

    const newGameButton = screen.getByText("New Game");
    expect(newGameButton).toBeInTheDocument();
  });

  it("should call onNewGame when New Game button is clicked", () => {
    render(<GameControlsPresentation {...defaultProps} />);

    const newGameButton = screen.getByText("New Game");
    fireEvent.click(newGameButton);

    expect(defaultProps.onNewGame).toHaveBeenCalledTimes(1);
  });

  it("should not render Hit/Stand buttons during betting phase", () => {
    render(
      <GameControlsPresentation
        {...defaultProps}
        phase="betting"
        statusMessage="Place your bet to start the round"
        statusMessageColor="text-blue-400"
      />
    );

    expect(screen.queryByText("Hit")).not.toBeInTheDocument();
    expect(screen.queryByText("Stand")).not.toBeInTheDocument();
  });

  it("should not render Hit/Stand buttons during dealing phase", () => {
    render(
      <GameControlsPresentation
        {...defaultProps}
        phase="dealing"
        statusMessage="Dealing cards..."
        statusMessageColor="text-yellow-400"
      />
    );

    expect(screen.queryByText("Hit")).not.toBeInTheDocument();
    expect(screen.queryByText("Stand")).not.toBeInTheDocument();
  });

  it("should not render Hit/Stand buttons during dealer turn", () => {
    render(
      <GameControlsPresentation
        {...defaultProps}
        phase="dealer-turn"
        statusMessage="Dealer's turn..."
        statusMessageColor="text-purple-400"
      />
    );

    expect(screen.queryByText("Hit")).not.toBeInTheDocument();
    expect(screen.queryByText("Stand")).not.toBeInTheDocument();
  });

  it("should handle different status message colors", () => {
    render(
      <GameControlsPresentation
        {...defaultProps}
        statusMessage="You must stand"
        statusMessageColor="text-orange-400"
      />
    );

    const statusElement = screen.getByText("You must stand");
    expect(statusElement).toHaveClass("text-orange-400");
  });

  it("should maintain button accessibility", () => {
    render(<GameControlsPresentation {...defaultProps} />);

    const hitButton = screen.getByText("Hit");
    const standButton = screen.getByText("Stand");
    const newGameButton = screen.getByText("New Game");

    expect(hitButton).toHaveAttribute("type", "button");
    expect(standButton).toHaveAttribute("type", "button");
    expect(newGameButton).toHaveAttribute("type", "button");
  });
});
