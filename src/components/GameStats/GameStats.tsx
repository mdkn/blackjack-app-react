import { GameResult } from "../../types";
import { useGameStatsProps } from "../../hooks/useGameStatsProps";
import { GameStatsPresentation } from "./GameStatsPresentation";

interface GameStatsProps {
  history: GameResult[];
  className?: string;
}

export const GameStats = (props: GameStatsProps) => {
  const gameStatsLogic = useGameStatsProps({
    history: props.history,
  });

  return <GameStatsPresentation {...props} {...gameStatsLogic} />;
};
