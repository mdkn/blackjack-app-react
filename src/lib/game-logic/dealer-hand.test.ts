import { describe, it, expect } from "vitest";
import { createEmptyHand, addCardToHand, calculateHandValue } from "./hand";
import { Card } from "../../types";

// Helper function to create cards
const createCard = (rank: string, suit: string): Card => ({
  rank: rank as any,
  suit: suit as any,
});

describe("Dealer Hand Value Calculation", () => {
  describe("Current behavior demonstrates the bug", () => {
    it("DEMONSTRATES BUG: dealer hand value includes hidden cards", () => {
      // This test demonstrates the current incorrect behavior
      const aceOfSpades = createCard("A", "spades");
      const kingOfHearts = createCard("K", "hearts");

      // Create dealer hand with both cards
      let dealerHand = createEmptyHand();
      dealerHand = addCardToHand(dealerHand, aceOfSpades);
      dealerHand = addCardToHand(dealerHand, kingOfHearts);

      // BUG: This shows that hand.value includes ALL cards, even hidden ones
      expect(dealerHand.value).toBe(21); // This passes, showing the bug exists
      expect(dealerHand.cards.length).toBe(2); // Both cards are in the hand

      // This is the problem: during player turn, dealer should only show
      // the value of face-up cards, not all cards
    });

    it("should only calculate value for face-up cards during player turn", () => {
      // This is what we WANT to happen (will fail until we fix it)
      const aceOfSpades = createCard("A", "spades");
      const kingOfHearts = createCard("K", "hearts");

      // Create dealer hand with both cards
      let dealerHand = createEmptyHand();
      dealerHand = addCardToHand(dealerHand, aceOfSpades);
      dealerHand = addCardToHand(dealerHand, kingOfHearts);

      // What we want: only face-up card value during player turn
      // We need a new function to calculate visible hand value
      const visibleValue = calculateVisibleHandValue(dealerHand.cards, 1); // Only first card visible
      expect(visibleValue).toBe(11); // Ace should be 11 when alone
    });

    it("should calculate value for face-up cards only with multiple face-up cards", () => {
      const aceOfSpades = createCard("A", "spades");
      const fiveOfDiamonds = createCard("5", "diamonds");
      const kingOfHearts = createCard("K", "hearts");

      // Dealer shows Ace + 5, hides King
      let dealerHand = createEmptyHand();
      dealerHand = addCardToHand(dealerHand, aceOfSpades);
      dealerHand = addCardToHand(dealerHand, fiveOfDiamonds);
      dealerHand = addCardToHand(dealerHand, kingOfHearts);

      // Should only count first 2 cards (Ace + 5 = 16)
      const visibleValue = calculateVisibleHandValue(dealerHand.cards, 2);
      expect(visibleValue).toBe(16);
    });

    it("should handle ace correctly when only ace is visible", () => {
      const aceOfSpades = createCard("A", "spades");
      const kingOfHearts = createCard("K", "hearts");

      let dealerHand = createEmptyHand();
      dealerHand = addCardToHand(dealerHand, aceOfSpades);
      dealerHand = addCardToHand(dealerHand, kingOfHearts);

      // Only ace visible - should be 11 (not 1)
      const visibleValue = calculateVisibleHandValue(dealerHand.cards, 1);
      expect(visibleValue).toBe(11);
    });

    it("should calculate all cards when all are face-up (dealer's turn)", () => {
      const aceOfSpades = createCard("A", "spades");
      const kingOfHearts = createCard("K", "hearts");

      let dealerHand = createEmptyHand();
      dealerHand = addCardToHand(dealerHand, aceOfSpades);
      dealerHand = addCardToHand(dealerHand, kingOfHearts);

      // All cards visible - should be 21
      const visibleValue = calculateVisibleHandValue(dealerHand.cards, 2);
      expect(visibleValue).toBe(21);
    });

    it("should handle multiple aces in visible cards", () => {
      const aceOfSpades = createCard("A", "spades");
      const aceOfHearts = createCard("A", "hearts");
      const kingOfDiamonds = createCard("K", "diamonds");

      let dealerHand = createEmptyHand();
      dealerHand = addCardToHand(dealerHand, aceOfSpades);
      dealerHand = addCardToHand(dealerHand, aceOfHearts);
      dealerHand = addCardToHand(dealerHand, kingOfDiamonds);

      // Only first 2 aces visible - should be 12 (11 + 1)
      const visibleValue = calculateVisibleHandValue(dealerHand.cards, 2);
      expect(visibleValue).toBe(12);
    });
  });
});

// This function doesn't exist yet - we need to implement it
// This test will fail until we create this function
export const calculateVisibleHandValue = (
  cards: Card[],
  visibleCount: number
): number => {
  // This is a placeholder - the real implementation should only calculate
  // the value of the first 'visibleCount' cards
  const visibleCards = cards.slice(0, visibleCount);
  return calculateHandValue(visibleCards);
};
