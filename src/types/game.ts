import { Card } from "./card";

export interface Hand {
  cards: Card[];
  value: number;
  isBlackjack: boolean;
  isBust: boolean;
}

export interface Player {
  name: string;
  chips: number;
  hand: Hand;
  currentBet: number;
}

export interface Dealer {
  hand: Hand;
  hiddenCard?: Card;
}

export interface Deck {
  cards: Card[];
  remaining: number;
}

export type GamePhase =
  | "betting"
  | "dealing"
  | "player-turn"
  | "dealer-turn"
  | "game-over";

export type GameAction = "hit" | "stand" | "double-down" | "split";

export interface GameState {
  phase: GamePhase;
  player: Player;
  dealer: Dealer;
  deck: Deck;
  gameHistory: GameResult[];
}

export interface GameResult {
  playerHand: Hand;
  dealerHand: Hand;
  result: "player-wins" | "dealer-wins" | "push";
  winnings: number;
  timestamp: Date;
}
