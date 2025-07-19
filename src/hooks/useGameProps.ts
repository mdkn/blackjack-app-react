import { useGameStore, useSettingsStore } from "../stores";
import { useSound } from "./useSound";
import { ComponentProps } from "react";
import { Hand, Betting, GameControls } from "../components";

export interface UseGamePropsReturn {
  getDealerHandProps: () => ComponentProps<typeof Hand>;
  getPlayerHandProps: () => ComponentProps<typeof Hand>;
  getBettingProps: () => ComponentProps<typeof Betting>;
  getGameControlsProps: () => ComponentProps<typeof GameControls>;
}

export const useGameProps = (): UseGamePropsReturn => {
  const { player, dealer, phase, hit, stand, resetRound, newGame, placeBet } =
    useGameStore();

  const { settings } = useSettingsStore();
  const { playSound } = useSound();

  // Player can hit if it's their turn, hand isn't bust, and value < 21
  const playerCanHit =
    phase === "player-turn" && !player.hand.isBust && player.hand.value < 21;

  // Dealer Hand props with hide logic for face-down card
  const getDealerHandProps = () => ({
    hand: dealer.hand,
    label: "Dealer",
    hideLastCard: phase === "player-turn" || phase === "dealing",
    cardSize: settings.cardSize,
    className: "mb-4",
  });

  // Player Hand props
  const getPlayerHandProps = () => ({
    hand: player.hand,
    label: "Your Hand",
    cardSize: settings.cardSize,
    className: "mb-4",
  });

  // Betting props with sound effect wrapper
  const getBettingProps = () => ({
    playerChips: player.chips,
    currentBet: player.currentBet,
    onPlaceBet: (amount: number) => {
      playSound("chipPlace");
      placeBet(amount);
    },
    presetBets: settings.betIncrements,
    defaultBet: settings.defaultBet,
    maxBet: settings.maxBet,
  });

  // Game Controls props with sound effect wrappers
  const getGameControlsProps = () => ({
    phase,
    onHit: () => {
      playSound("cardDeal");
      hit();
    },
    onStand: () => {
      playSound("cardFlip");
      stand();
    },
    onNewRound: () => {
      playSound("chipPlace");
      resetRound();
    },
    onNewGame: newGame,
    playerCanHit,
    playerChips: player.chips,
  });

  return {
    getDealerHandProps,
    getPlayerHandProps,
    getBettingProps,
    getGameControlsProps,
  };
};
