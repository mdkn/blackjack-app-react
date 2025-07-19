import { Hand, Player, GameResult } from "../../types";

export const determineWinner = (
  playerHand: Hand,
  dealerHand: Hand
): { result: "player-wins" | "dealer-wins" | "push"; message: string } => {
  // Player busted
  if (playerHand.isBust) {
    return { result: "dealer-wins", message: "Player busted" };
  }

  // Dealer busted, player didn't
  if (dealerHand.isBust) {
    return { result: "player-wins", message: "Dealer busted" };
  }

  // Both have blackjack
  if (playerHand.isBlackjack && dealerHand.isBlackjack) {
    return { result: "push", message: "Both have blackjack" };
  }

  // Player has blackjack, dealer doesn't
  if (playerHand.isBlackjack) {
    return { result: "player-wins", message: "Blackjack!" };
  }

  // Dealer has blackjack, player doesn't
  if (dealerHand.isBlackjack) {
    return { result: "dealer-wins", message: "Dealer blackjack" };
  }

  // Compare values
  if (playerHand.value > dealerHand.value) {
    return { result: "player-wins", message: "Player wins" };
  } else if (playerHand.value < dealerHand.value) {
    return { result: "dealer-wins", message: "Dealer wins" };
  } else {
    return { result: "push", message: "Push" };
  }
};

export const calculateWinnings = (
  bet: number,
  result: "player-wins" | "dealer-wins" | "push",
  isBlackjack: boolean = false
): number => {
  switch (result) {
    case "player-wins":
      return isBlackjack ? Math.floor(bet * 1.5) : bet; // Blackjack pays 3:2
    case "dealer-wins":
      return -bet;
    case "push":
      return 0;
    default:
      return 0;
  }
};

export const createGameResult = (
  playerHand: Hand,
  dealerHand: Hand,
  bet: number
): GameResult => {
  const { result } = determineWinner(playerHand, dealerHand);
  const winnings = calculateWinnings(bet, result, playerHand.isBlackjack);

  return {
    playerHand: { ...playerHand },
    dealerHand: { ...dealerHand },
    result,
    winnings,
    timestamp: new Date(),
  };
};

export const canPlayerAffordBet = (
  player: Player,
  betAmount: number
): boolean => {
  return player.chips >= betAmount;
};

export const updatePlayerChips = (player: Player, amount: number): Player => {
  return {
    ...player,
    chips: Math.max(0, player.chips + amount),
  };
};
