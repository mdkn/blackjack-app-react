import { GameResult } from "../../types";
import { useGameHistoryProps } from "../../hooks/useGameHistoryProps";
import { GameHistoryPresentation } from "./GameHistoryPresentation";

interface GameHistoryProps {
  history: GameResult[];
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const GameHistory = (props: GameHistoryProps) => {
  const gameHistoryLogic = useGameHistoryProps({
    history: props.history,
  });

  return <GameHistoryPresentation {...props} {...gameHistoryLogic} />;
};
