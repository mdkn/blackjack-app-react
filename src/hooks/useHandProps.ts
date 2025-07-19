import { useMemo } from "react";
import { Hand } from "../types";
import { getHandDisplayValue } from "../lib/game-logic";
import { calculateVisibleHandValue } from "../lib/game-logic/hand";

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

  // Calculate visible hand properties when hideLastCard is true
  const visibleValue = useMemo(() => {
    if (hideLastCard && cards.length > 1) {
      return calculateVisibleHandValue(cards, cards.length - 1);
    }
    return value;
  }, [hideLastCard, cards, value]);

  const visibleIsBlackjack = useMemo(() => {
    if (hideLastCard && cards.length > 1) {
      // Can't be blackjack if we're hiding cards and showing less than 2 cards
      return false;
    }
    return isBlackjack;
  }, [hideLastCard, cards.length, isBlackjack]);

  const visibleIsBust = useMemo(() => {
    if (hideLastCard && cards.length > 1) {
      return visibleValue > 21;
    }
    return isBust;
  }, [hideLastCard, cards.length, visibleValue, isBust]);

  const statusColor = useMemo(() => {
    if (visibleIsBust) return "text-red-500";
    if (visibleIsBlackjack) return "text-yellow-400";
    if (visibleValue === 21) return "text-green-400";
    return "text-white";
  }, [visibleIsBust, visibleIsBlackjack, visibleValue]);

  const statusText = useMemo(() => {
    if (hideCards && cards.length > 0) return "Hidden";
    if (visibleIsBust) return "BUST!";
    if (visibleIsBlackjack) return "BLACKJACK!";

    // Create a temporary hand with visible cards only for display
    if (hideLastCard && cards.length > 1) {
      const visibleCards = cards.slice(0, cards.length - 1);
      const tempHand = {
        cards: visibleCards,
        value: visibleValue,
        isBlackjack: visibleIsBlackjack,
        isBust: visibleIsBust,
      };
      return getHandDisplayValue(tempHand);
    }

    return getHandDisplayValue(hand);
  }, [
    hideCards,
    cards,
    visibleIsBust,
    visibleIsBlackjack,
    hideLastCard,
    visibleValue,
    hand,
  ]);

  const cardCount = useMemo(() => {
    if (hideCards || cards.length === 0) return "";
    return cards.length === 1 ? "1 card" : `${cards.length} cards`;
  }, [hideCards, cards.length]);

  const hasSpecialAnimation = useMemo(() => {
    return visibleIsBust || visibleIsBlackjack;
  }, [visibleIsBust, visibleIsBlackjack]);

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
