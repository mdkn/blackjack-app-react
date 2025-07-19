import { useMemo } from "react";
import { GamePhase } from "../types";

interface UseGameControlsPropsParams {
  phase: GamePhase;
  playerCanHit: boolean;
  disabled?: boolean;
}

interface UseGameControlsPropsReturn {
  isPlayerTurn: boolean;
  isGameOver: boolean;
  isDealing: boolean;
  statusMessage: string;
  statusMessageColor: string;
  showLoadingSpinner: boolean;
  canHit: boolean;
  canStand: boolean;
  canNextRound: boolean;
  canNewGame: boolean;
}

export const useGameControlsProps = ({
  phase,
  playerCanHit,
  disabled = false,
}: UseGameControlsPropsParams): UseGameControlsPropsReturn => {
  const isPlayerTurn = useMemo(() => phase === "player-turn", [phase]);
  const isGameOver = useMemo(() => phase === "game-over", [phase]);
  const isDealing = useMemo(
    () => phase === "dealing" || phase === "dealer-turn",
    [phase]
  );

  const { statusMessage, statusMessageColor } = useMemo(() => {
    let message = "";
    let messageColor = "text-gray-300";

    switch (phase) {
      case "betting":
        message = "Place your bet to start the round";
        messageColor = "text-blue-400";
        break;
      case "dealing":
        message = "Dealing cards...";
        messageColor = "text-yellow-400";
        break;
      case "player-turn":
        message = playerCanHit
          ? "Your turn - Hit or Stand?"
          : "You cannot hit (hand value too high)";
        messageColor = playerCanHit ? "text-green-400" : "text-orange-400";
        break;
      case "dealer-turn":
        message = "Dealer is playing...";
        messageColor = "text-purple-400";
        break;
      case "game-over":
        message = "Round complete!";
        messageColor = "text-gray-300";
        break;
    }

    return { statusMessage: message, statusMessageColor: messageColor };
  }, [phase, playerCanHit]);

  const showLoadingSpinner = useMemo(() => isDealing, [isDealing]);

  const canHit = useMemo(
    () => !disabled && playerCanHit,
    [disabled, playerCanHit]
  );
  const canStand = useMemo(() => !disabled, [disabled]);
  const canNextRound = useMemo(() => !disabled, [disabled]);
  const canNewGame = useMemo(() => !disabled, [disabled]);

  return {
    isPlayerTurn,
    isGameOver,
    isDealing,
    statusMessage,
    statusMessageColor,
    showLoadingSpinner,
    canHit,
    canStand,
    canNextRound,
    canNewGame,
  };
};
