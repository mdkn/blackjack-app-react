import { Hand, Card, RANK_VALUES } from "../../types";

export const createEmptyHand = (): Hand => {
  return {
    cards: [],
    value: 0,
    isBlackjack: false,
    isBust: false,
  };
};

export const addCardToHand = (hand: Hand, card: Card): Hand => {
  const newCards = [...hand.cards, card];
  const value = calculateHandValue(newCards);
  const isBlackjack = newCards.length === 2 && value === 21;
  const isBust = value > 21;

  return {
    cards: newCards,
    value,
    isBlackjack,
    isBust,
  };
};

export const calculateHandValue = (cards: Card[]): number => {
  let total = 0;
  let aces = 0;

  // First, add all non-ace cards
  for (const card of cards) {
    if (card.rank === "A") {
      aces++;
    } else {
      total += RANK_VALUES[card.rank][0];
    }
  }

  // Then add aces, using 11 when possible
  for (let i = 0; i < aces; i++) {
    if (total + 11 <= 21) {
      total += 11;
    } else {
      total += 1;
    }
  }

  return total;
};

export const calculateVisibleHandValue = (
  cards: Card[],
  visibleCount: number
): number => {
  const visibleCards = cards.slice(0, Math.max(0, visibleCount));
  return calculateHandValue(visibleCards);
};

export const canHit = (hand: Hand): boolean => {
  return !hand.isBust && hand.value < 21;
};

export const shouldDealerHit = (hand: Hand): boolean => {
  if (hand.value < 17) {
    return true;
  }

  // Dealer hits on soft 17
  if (hand.value === 17 && isSoftHand(hand)) {
    return true;
  }

  return false;
};

export const isSoftHand = (hand: Hand): boolean => {
  let hasAce = false;
  let total = 0;

  for (const card of hand.cards) {
    if (card.rank === "A") {
      hasAce = true;
      total += 1;
    } else {
      total += RANK_VALUES[card.rank][0];
    }
  }

  // If we have an ace and can use it as 11 without busting, it's a soft hand
  return hasAce && total + 10 === hand.value;
};

export const getHandDisplayValue = (hand: Hand): string => {
  if (isSoftHand(hand)) {
    const hardValue = hand.value - 10;
    return `${hardValue}/${hand.value}`;
  }
  return hand.value.toString();
};
