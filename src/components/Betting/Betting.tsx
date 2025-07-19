import { useBettingContainer } from "../../hooks/useBettingContainer";
import { BettingPresentation } from "./BettingPresentation";

interface BettingProps {
  playerChips: number;
  currentBet: number;
  onPlaceBet: (amount: number) => void;
  disabled?: boolean;
  presetBets?: number[];
  defaultBet?: number;
  maxBet?: number;
  className?: string;
}

export const Betting = (props: BettingProps) => {
  const bettingLogic = useBettingContainer({
    playerChips: props.playerChips,
    onPlaceBet: props.onPlaceBet,
    disabled: props.disabled,
    defaultBet: props.defaultBet,
    maxBet: props.maxBet,
  });

  return <BettingPresentation {...props} {...bettingLogic} />;
};
