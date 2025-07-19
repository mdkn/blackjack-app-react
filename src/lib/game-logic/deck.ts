import { Card, Deck, SUITS, RANKS } from "../../types";

export function createDeck(): Deck {
  const cards: Card[] = [];

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      cards.push({ suit, rank });
    }
  }

  return {
    cards: shuffleDeck(cards),
    remaining: cards.length,
  };
}

export function shuffleDeck(cards: Card[]): Card[] {
  const shuffled = [...cards];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function dealCard(deck: Deck): { card: Card; updatedDeck: Deck } | null {
  if (deck.remaining === 0) {
    return null;
  }

  const card = deck.cards[deck.cards.length - deck.remaining];
  const updatedDeck: Deck = {
    ...deck,
    remaining: deck.remaining - 1,
  };

  return { card, updatedDeck };
}

export function shouldReshuffle(deck: Deck): boolean {
  return deck.remaining < 10; // Reshuffle when less than 10 cards remain
}
