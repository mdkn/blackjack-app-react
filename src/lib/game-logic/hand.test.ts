import {
  createEmptyHand,
  addCardToHand,
  calculateHandValue,
  canHit,
  shouldDealerHit,
  isSoftHand,
  getHandDisplayValue,
} from "./hand";
import { Card } from "../../types";

describe("Hand utilities", () => {
  const aceSpades: Card = { suit: "spades", rank: "A" };
  const kingHearts: Card = { suit: "hearts", rank: "K" };
  const fiveClubs: Card = { suit: "clubs", rank: "5" };
  const sixDiamonds: Card = { suit: "diamonds", rank: "6" };

  test("createEmptyHand creates an empty hand", () => {
    const hand = createEmptyHand();
    expect(hand.cards.length).toBe(0);
    expect(hand.value).toBe(0);
    expect(hand.isBlackjack).toBe(false);
    expect(hand.isBust).toBe(false);
  });

  test("addCardToHand adds a card and updates value", () => {
    const emptyHand = createEmptyHand();
    const handWithKing = addCardToHand(emptyHand, kingHearts);

    expect(handWithKing.cards.length).toBe(1);
    expect(handWithKing.value).toBe(10);
    expect(handWithKing.isBlackjack).toBe(false);
  });

  test("calculateHandValue handles aces correctly", () => {
    expect(calculateHandValue([aceSpades, kingHearts])).toBe(21); // Ace as 11
    expect(calculateHandValue([aceSpades, fiveClubs, sixDiamonds])).toBe(12); // Ace as 1
    expect(calculateHandValue([aceSpades, aceSpades])).toBe(12); // One ace as 11, one as 1
  });

  test("detects blackjack correctly", () => {
    const emptyHand = createEmptyHand();
    const blackjackHand = addCardToHand(
      addCardToHand(emptyHand, aceSpades),
      kingHearts
    );

    expect(blackjackHand.isBlackjack).toBe(true);
    expect(blackjackHand.value).toBe(21);
  });

  test("detects bust correctly", () => {
    const emptyHand = createEmptyHand();
    const bustHand = addCardToHand(
      addCardToHand(addCardToHand(emptyHand, kingHearts), kingHearts),
      fiveClubs
    );

    expect(bustHand.isBust).toBe(true);
    expect(bustHand.value).toBe(25);
  });

  test("canHit returns correct values", () => {
    const emptyHand = createEmptyHand();
    const hand20 = addCardToHand(
      addCardToHand(emptyHand, kingHearts),
      kingHearts
    );
    const hand21 = addCardToHand(hand20, aceSpades);

    expect(canHit(hand20)).toBe(true);
    expect(canHit(hand21)).toBe(false);
  });

  test("shouldDealerHit follows dealer rules", () => {
    const emptyHand = createEmptyHand();
    const hand16 = addCardToHand(
      addCardToHand(emptyHand, kingHearts),
      sixDiamonds
    );
    const hand17 = addCardToHand(hand16, aceSpades);
    const softHand17 = addCardToHand(
      addCardToHand(emptyHand, aceSpades),
      sixDiamonds
    );

    expect(shouldDealerHit(hand16)).toBe(true); // Hit on 16
    expect(shouldDealerHit(hand17)).toBe(false); // Stand on hard 17
    expect(shouldDealerHit(softHand17)).toBe(true); // Hit on soft 17
  });

  test("isSoftHand detects soft hands correctly", () => {
    const emptyHand = createEmptyHand();
    const softHand = addCardToHand(
      addCardToHand(emptyHand, aceSpades),
      sixDiamonds
    );
    const hardHand = addCardToHand(
      addCardToHand(emptyHand, kingHearts),
      sixDiamonds
    );

    expect(isSoftHand(softHand)).toBe(true);
    expect(isSoftHand(hardHand)).toBe(false);
  });

  test("getHandDisplayValue shows soft/hard values correctly", () => {
    const emptyHand = createEmptyHand();
    const softHand = addCardToHand(
      addCardToHand(emptyHand, aceSpades),
      sixDiamonds
    );
    const hardHand = addCardToHand(
      addCardToHand(emptyHand, kingHearts),
      sixDiamonds
    );

    expect(getHandDisplayValue(softHand)).toBe("7/17");
    expect(getHandDisplayValue(hardHand)).toBe("16");
  });
});
