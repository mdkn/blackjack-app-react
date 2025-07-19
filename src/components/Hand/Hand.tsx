import { Hand as HandType } from "../../types";
import { useHandProps } from "../../hooks/useHandProps";
import { HandPresentation } from "./HandPresentation";

interface HandProps {
  hand: HandType;
  label?: string;
  hideCards?: boolean;
  hideLastCard?: boolean;
  cardSize?: "small" | "medium" | "large";
  className?: string;
}

export const Hand = (props: HandProps) => {
  const handLogic = useHandProps({
    hand: props.hand,
    hideCards: props.hideCards,
    hideLastCard: props.hideLastCard,
  });

  return <HandPresentation {...props} {...handLogic} />;
};
