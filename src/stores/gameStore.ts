import { create } from "zustand";
import { GameState, Player, Dealer, Deck, GamePhase } from "../types";
import { createDeck, createEmptyHand } from "../utils";

interface GameStore extends GameState {
  // Actions
  placeBet: (amount: number) => void;
  hit: () => void;
  stand: () => void;
  resetGame: () => void;
  newGame: () => void;
}

const initialPlayer: Player = {
  name: "Player",
  chips: 1000,
  hand: createEmptyHand(),
  currentBet: 0,
};

const initialDealer: Dealer = {
  hand: createEmptyHand(),
};

const initialDeck: Deck = createDeck();

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  phase: "betting" as GamePhase,
  player: initialPlayer,
  dealer: initialDealer,
  deck: initialDeck,
  gameHistory: [],

  // Actions
  placeBet: (amount: number) => {
    const { player } = get();
    if (player.chips >= amount) {
      set(state => ({
        player: {
          ...state.player,
          currentBet: amount,
          chips: state.player.chips - amount,
        },
        phase: "dealing",
      }));
    }
  },

  hit: () => {
    // TODO: Implement hit logic
    console.log("Hit action");
  },

  stand: () => {
    // TODO: Implement stand logic
    console.log("Stand action");
  },

  resetGame: () => {
    set({
      phase: "betting",
      player: {
        ...initialPlayer,
        chips: get().player.chips, // Keep current chips
      },
      dealer: initialDealer,
      deck: createDeck(),
    });
  },

  newGame: () => {
    set({
      phase: "betting",
      player: initialPlayer,
      dealer: initialDealer,
      deck: createDeck(),
      gameHistory: [],
    });
  },
}));
