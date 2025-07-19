import {
  createDeck,
  dealCard,
  shouldReshuffle,
  shuffleDeck,
} from "../utils/deck";
import { SUITS, RANKS } from "../types";

describe("Deck utilities", () => {
  test("createDeck creates a full deck of 52 cards", () => {
    const deck = createDeck();
    expect(deck.cards.length).toBe(52);
    expect(deck.remaining).toBe(52);
  });

  test("deck contains all suits and ranks", () => {
    const deck = createDeck();
    const suits = new Set(deck.cards.map(card => card.suit));
    const ranks = new Set(deck.cards.map(card => card.rank));

    expect(suits.size).toBe(SUITS.length);
    expect(ranks.size).toBe(RANKS.length);
  });

  test("dealCard removes a card from the deck", () => {
    const deck = createDeck();
    const result = dealCard(deck);

    expect(result).not.toBeNull();
    expect(result!.updatedDeck.remaining).toBe(51);
    expect(result!.card).toBeDefined();
  });

  test("dealCard returns null when deck is empty", () => {
    const emptyDeck = { cards: [], remaining: 0 };
    const result = dealCard(emptyDeck);

    expect(result).toBeNull();
  });

  test("shouldReshuffle returns true when less than 10 cards remain", () => {
    const lowDeck = { cards: [], remaining: 9 };
    const fullDeck = { cards: [], remaining: 30 };

    expect(shouldReshuffle(lowDeck)).toBe(true);
    expect(shouldReshuffle(fullDeck)).toBe(false);
  });

  test("shuffleDeck randomizes card order", () => {
    const originalCards = [
      { suit: "spades" as const, rank: "A" as const },
      { suit: "hearts" as const, rank: "2" as const },
      { suit: "diamonds" as const, rank: "3" as const },
    ];

    const shuffled = shuffleDeck(originalCards);

    expect(shuffled.length).toBe(originalCards.length);
    expect(shuffled).toContain(originalCards[0]);
    expect(shuffled).toContain(originalCards[1]);
    expect(shuffled).toContain(originalCards[2]);
  });
});
