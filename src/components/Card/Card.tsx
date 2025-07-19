import { Card as CardType } from "../../types";
import { useCardProps } from "../../hooks/useCardProps";
import { CardPresentation } from "./CardPresentation";

interface CardProps {
  card?: CardType;
  faceDown?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
  onClick?: () => void;
}

export const Card = (props: CardProps) => {
  const cardLogic = useCardProps({
    card: props.card,
    faceDown: props.faceDown,
    size: props.size,
  });

  return <CardPresentation {...props} {...cardLogic} />;
};
