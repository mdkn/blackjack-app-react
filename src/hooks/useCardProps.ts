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
  textSize: string;
  iconSize: string;
}

const SIZE_CLASSES = {
  small: "w-14 h-20",
  medium: "w-16 h-24",
  large: "w-20 h-32",
};

const TEXT_SIZES = {
  small: "text-xs",
  medium: "text-sm",
  large: "text-base",
};

const ICON_SIZES = {
  small: "w-2 h-2",
  medium: "w-3 h-3",
  large: "w-4 h-4",
};

export const useCardProps = ({
  card,
  faceDown = false,
  size = "medium",
}: UseCardPropsParams): UseCardPropsReturn => {
  const sizeClasses = useMemo(() => SIZE_CLASSES[size], [size]);

  const textSize = useMemo(() => {
    if (card?.rank === "10") {
      // Special handling for "10" - use smaller text
      return size === "small"
        ? "text-xs"
        : size === "medium"
          ? "text-xs"
          : "text-sm";
    }
    return TEXT_SIZES[size];
  }, [size, card?.rank]);

  const iconSize = useMemo(() => {
    if (card?.rank === "10") {
      // Special handling for "10" - use smaller icons
      return size === "small"
        ? "w-1.5 h-1.5"
        : size === "medium"
          ? "w-2 h-2"
          : "w-3 h-3";
    }
    return ICON_SIZES[size];
  }, [size, card?.rank]);

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
    textSize,
    iconSize,
  };
};
