import { create } from "zustand";
import { GameState, Player, Dealer, Deck, GamePhase } from "../types";
import {
  createDeck,
  createEmptyHand,
  dealCard,
  addCardToHand,
  shouldReshuffle,
  shouldDealerHit,
  determineWinner,
  calculateWinnings,
  updatePlayerChips,
} from "../lib/game-logic";

interface GameStore extends GameState {
  // Actions
  placeBet: (amount: number) => void;
  dealInitialCards: () => void;
  hit: () => void;
  stand: () => void;
  dealerPlay: () => void;
  resetRound: () => void;
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
  phase: "betting" satisfies GamePhase,
  player: initialPlayer,
  dealer: initialDealer,
  deck: initialDeck,
  gameHistory: [],

  // Actions
  placeBet: (amount: number) => {
    const { player } = get();
    if (player.chips >= amount && get().phase === "betting") {
      set(state => ({
        player: {
          ...state.player,
          currentBet: amount,
          chips: state.player.chips - amount,
        },
        phase: "dealing",
      }));

      // Automatically deal initial cards after betting
      setTimeout(() => get().dealInitialCards(), 100);
    }
  },

  dealInitialCards: () => {
    const state = get();
    let { deck } = state;

    // Check if deck needs reshuffling
    if (shouldReshuffle(deck)) {
      deck = createDeck();
    }

    // Deal two cards to player and dealer
    const playerCard1 = dealCard(deck);
    if (!playerCard1) return;
    deck = playerCard1.updatedDeck;

    const dealerCard1 = dealCard(deck);
    if (!dealerCard1) return;
    deck = dealerCard1.updatedDeck;

    const playerCard2 = dealCard(deck);
    if (!playerCard2) return;
    deck = playerCard2.updatedDeck;

    const dealerCard2 = dealCard(deck);
    if (!dealerCard2) return;
    deck = dealerCard2.updatedDeck;

    // Create new hands
    const playerHand = addCardToHand(
      addCardToHand(createEmptyHand(), playerCard1.card),
      playerCard2.card
    );

    const dealerHand = addCardToHand(
      addCardToHand(createEmptyHand(), dealerCard1.card),
      dealerCard2.card
    );

    set({
      player: { ...state.player, hand: playerHand },
      dealer: { ...state.dealer, hand: dealerHand },
      deck,
      phase: playerHand.isBlackjack ? "dealer-turn" : "player-turn",
    });

    // If player has blackjack, automatically proceed to dealer turn
    if (playerHand.isBlackjack) {
      setTimeout(() => get().dealerPlay(), 1000);
    }
  },

  hit: () => {
    const state = get();
    if (state.phase !== "player-turn") return;

    const cardResult = dealCard(state.deck);
    if (!cardResult) return;

    const newPlayerHand = addCardToHand(state.player.hand, cardResult.card);

    set({
      player: { ...state.player, hand: newPlayerHand },
      deck: cardResult.updatedDeck,
      phase: newPlayerHand.isBust ? "dealer-turn" : "player-turn",
    });

    // If player busts, automatically proceed to dealer turn
    if (newPlayerHand.isBust) {
      setTimeout(() => get().dealerPlay(), 1000);
    }
  },

  stand: () => {
    const state = get();
    if (state.phase === "player-turn") {
      set({ phase: "dealer-turn" });
      setTimeout(() => get().dealerPlay(), 500);
    }
  },

  dealerPlay: () => {
    const state = get();
    if (state.phase !== "dealer-turn") return;

    const { dealer, deck: initialDeck } = state;
    let deck = initialDeck;
    let dealerHand = dealer.hand;

    // Dealer plays according to rules
    while (shouldDealerHit(dealerHand)) {
      const cardResult = dealCard(deck);
      if (!cardResult) break;

      dealerHand = addCardToHand(dealerHand, cardResult.card);
      deck = cardResult.updatedDeck;
    }

    // Determine winner and update chips
    const { result } = determineWinner(state.player.hand, dealerHand);
    const winnings = calculateWinnings(
      state.player.currentBet,
      result,
      state.player.hand.isBlackjack
    );
    const updatedPlayer = updatePlayerChips(
      state.player,
      winnings + state.player.currentBet
    );

    // Create game result for history
    const gameResult = {
      playerHand: state.player.hand,
      dealerHand,
      result,
      winnings,
      timestamp: new Date(),
    };

    set({
      dealer: { ...dealer, hand: dealerHand },
      deck,
      player: { ...updatedPlayer, currentBet: 0 },
      phase: "game-over",
      gameHistory: [...state.gameHistory, gameResult],
    });
  },

  resetRound: () => {
    set({
      phase: "betting",
      player: {
        ...get().player,
        hand: createEmptyHand(),
        currentBet: 0,
      },
      dealer: {
        ...get().dealer,
        hand: createEmptyHand(),
      },
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
