import { useBettingProps } from "../../hooks/useBettingProps";
import { BettingPresentation } from "./BettingPresentation";

interface BettingProps {
  disabled?: boolean;
  presetBets?: number[];
  className?: string;
}

export const Betting = (props: BettingProps) => {
  const bettingLogic = useBettingProps(props);

  return <BettingPresentation {...bettingLogic} />;
};
