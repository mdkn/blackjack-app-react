import {
  determineWinner,
  calculateWinnings,
  createGameResult,
  canPlayerAffordBet,
  updatePlayerChips,
} from "../utils/game";
import { createEmptyHand, addCardToHand } from "../utils/hand";
import { Player, Card } from "../types";

describe("Game utilities", () => {
  const aceSpades: Card = { suit: "spades", rank: "A" };
  const kingHearts: Card = { suit: "hearts", rank: "K" };
  const fiveClubs: Card = { suit: "clubs", rank: "5" };
  const sixDiamonds: Card = { suit: "diamonds", rank: "6" };

  test("determineWinner handles player bust", () => {
    const playerBust = addCardToHand(
      addCardToHand(addCardToHand(createEmptyHand(), kingHearts), kingHearts),
      fiveClubs
    );
    const dealerHand = addCardToHand(createEmptyHand(), kingHearts);

    const result = determineWinner(playerBust, dealerHand);
    expect(result.result).toBe("lose");
    expect(result.message).toBe("Player busted");
  });

  test("determineWinner handles dealer bust", () => {
    const playerHand = addCardToHand(
      addCardToHand(createEmptyHand(), kingHearts),
      fiveClubs
    );
    const dealerBust = addCardToHand(
      addCardToHand(addCardToHand(createEmptyHand(), kingHearts), kingHearts),
      fiveClubs
    );

    const result = determineWinner(playerHand, dealerBust);
    expect(result.result).toBe("win");
    expect(result.message).toBe("Dealer busted");
  });

  test("determineWinner handles blackjack scenarios", () => {
    const playerBlackjack = addCardToHand(
      addCardToHand(createEmptyHand(), aceSpades),
      kingHearts
    );
    const dealerBlackjack = addCardToHand(
      addCardToHand(createEmptyHand(), aceSpades),
      kingHearts
    );
    const regularHand = addCardToHand(
      addCardToHand(createEmptyHand(), kingHearts),
      fiveClubs
    );

    // Both blackjack
    let result = determineWinner(playerBlackjack, dealerBlackjack);
    expect(result.result).toBe("push");

    // Player blackjack only
    result = determineWinner(playerBlackjack, regularHand);
    expect(result.result).toBe("win");
    expect(result.message).toBe("Blackjack!");

    // Dealer blackjack only
    result = determineWinner(regularHand, dealerBlackjack);
    expect(result.result).toBe("lose");
  });

  test("calculateWinnings handles different scenarios", () => {
    expect(calculateWinnings(100, "win", false)).toBe(100); // Regular win
    expect(calculateWinnings(100, "win", true)).toBe(150); // Blackjack win (3:2)
    expect(calculateWinnings(100, "lose")).toBe(-100); // Loss
    expect(calculateWinnings(100, "push")).toBe(0); // Push
  });

  test("canPlayerAffordBet checks player chips", () => {
    const player: Player = {
      name: "Test Player",
      chips: 100,
      hand: createEmptyHand(),
      currentBet: 0,
    };

    expect(canPlayerAffordBet(player, 50)).toBe(true);
    expect(canPlayerAffordBet(player, 100)).toBe(true);
    expect(canPlayerAffordBet(player, 150)).toBe(false);
  });

  test("updatePlayerChips updates chips correctly", () => {
    const player: Player = {
      name: "Test Player",
      chips: 100,
      hand: createEmptyHand(),
      currentBet: 0,
    };

    const updatedPlayer = updatePlayerChips(player, 50);
    expect(updatedPlayer.chips).toBe(150);

    const reducedPlayer = updatePlayerChips(player, -120);
    expect(reducedPlayer.chips).toBe(0); // Can't go below 0
  });

  test("createGameResult creates complete game result", () => {
    const playerHand = addCardToHand(
      addCardToHand(createEmptyHand(), aceSpades),
      kingHearts
    );
    const dealerHand = addCardToHand(
      addCardToHand(createEmptyHand(), kingHearts),
      fiveClubs
    );

    const result = createGameResult(playerHand, dealerHand, 100);

    expect(result.result).toBe("win");
    expect(result.winnings).toBe(150); // Blackjack win
    expect(result.timestamp).toBeInstanceOf(Date);
    expect(result.playerHand).toEqual(playerHand);
    expect(result.dealerHand).toEqual(dealerHand);
  });
});
