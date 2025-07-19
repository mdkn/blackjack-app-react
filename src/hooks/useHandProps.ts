import { useMemo } from "react";
import { Hand } from "../types";
import { getHandDisplayValue } from "../lib/game-logic";

interface UseHandPropsParams {
  hand: Hand;
  hideCards?: boolean;
  hideLastCard?: boolean;
}

interface UseHandPropsReturn {
  statusColor: string;
  statusText: string;
  cardCount: string;
  hasSpecialAnimation: boolean;
  shouldHideCard: (index: number, cardsLength: number) => boolean;
}

export const useHandProps = ({
  hand,
  hideCards = false,
  hideLastCard = false,
}: UseHandPropsParams): UseHandPropsReturn => {
  const { cards, value, isBlackjack, isBust } = hand;

  const statusColor = useMemo(() => {
    if (isBust) return "text-red-500";
    if (isBlackjack) return "text-yellow-400";
    if (value === 21) return "text-green-400";
    return "text-white";
  }, [isBust, isBlackjack, value]);

  const statusText = useMemo(() => {
    if (hideCards && cards.length > 0) return "Hidden";
    if (isBust) return "BUST!";
    if (isBlackjack) return "BLACKJACK!";
    return getHandDisplayValue(hand);
  }, [hideCards, cards.length, isBust, isBlackjack, hand]);

  const cardCount = useMemo(() => {
    if (hideCards || cards.length === 0) return "";
    return cards.length === 1 ? "1 card" : `${cards.length} cards`;
  }, [hideCards, cards.length]);

  const hasSpecialAnimation = useMemo(() => {
    return isBust || isBlackjack;
  }, [isBust, isBlackjack]);

  const shouldHideCard = useMemo(
    () => (index: number, cardsLength: number) => {
      return hideCards || (hideLastCard && index === cardsLength - 1);
    },
    [hideCards, hideLastCard]
  );

  return {
    statusColor,
    statusText,
    cardCount,
    hasSpecialAnimation,
    shouldHideCard,
  };
};
