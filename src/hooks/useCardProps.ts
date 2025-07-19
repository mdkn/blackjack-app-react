import { useMemo } from "react";
import { Card as CardType } from "../types";
import { isRedCard } from "../lib/card-patterns";

interface UseCardPropsParams {
  card?: CardType;
  faceDown?: boolean;
  size?: "small" | "medium" | "large";
}

interface UseCardPropsReturn {
  sizeClasses: string;
  isRed: boolean;
  cardType: "face-down" | "empty" | "face-up";
  isFaceCard: boolean;
}

const SIZE_CLASSES = {
  small: "w-14 h-20 text-xs",
  medium: "w-18 h-26 text-sm",
  large: "w-24 h-34 text-base",
};

export const useCardProps = ({
  card,
  faceDown = false,
  size = "medium",
}: UseCardPropsParams): UseCardPropsReturn => {
  const sizeClasses = useMemo(() => SIZE_CLASSES[size], [size]);

  const isRed = useMemo(() => {
    return card ? isRedCard(card.suit) : false;
  }, [card]);

  const cardType = useMemo(() => {
    if (faceDown) return "face-down";
    if (!card) return "empty";
    return "face-up";
  }, [card, faceDown]);

  const isFaceCard = useMemo(() => {
    return card
      ? card.rank === "J" || card.rank === "Q" || card.rank === "K"
      : false;
  }, [card]);

  return {
    sizeClasses,
    isRed,
    cardType,
    isFaceCard,
  };
};
