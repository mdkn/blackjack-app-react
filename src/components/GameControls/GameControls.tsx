import { GamePhase } from "../../types";
import { useGameControlsProps } from "../../hooks/useGameControlsProps";
import { GameControlsPresentation } from "./GameControlsPresentation";

interface GameControlsProps {
  phase: GamePhase;
  onHit: () => void;
  onStand: () => void;
  onNewRound: () => void;
  onNewGame: () => void;
  playerCanHit: boolean;
  disabled?: boolean;
  className?: string;
}

export const GameControls = (props: GameControlsProps) => {
  const gameControlsLogic = useGameControlsProps({
    phase: props.phase,
    playerCanHit: props.playerCanHit,
    disabled: props.disabled,
  });

  return <GameControlsPresentation {...props} {...gameControlsLogic} />;
};
