import type { Meta, StoryObj } from "@storybook/react-vite";
import { GameStats } from "./GameStats";
import { createEmptyHand, addCardToHand } from "../../utils";

const meta: Meta<typeof GameStats> = {
  title: "Game/GameStats",
  component: GameStats,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "table",
      values: [
        { name: "table", value: "#059669" },
        { name: "light", value: "#ffffff" },
        { name: "dark", value: "#333333" },
      ],
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample game history data for different scenarios
const createGameResult = (
  playerCards: Array<{ suit: string; rank: string }>,
  dealerCards: Array<{ suit: string; rank: string }>,
  result: "player-wins" | "dealer-wins" | "push",
  winnings: number,
  minutesAgo: number = 0
) => {
  let playerHand = createEmptyHand();
  playerCards.forEach(card => {
    playerHand = addCardToHand(playerHand, {
      suit: card.suit,
      rank: card.rank,
    });
  });

  let dealerHand = createEmptyHand();
  dealerCards.forEach(card => {
    dealerHand = addCardToHand(dealerHand, {
      suit: card.suit,
      rank: card.rank,
    });
  });

  return {
    playerHand,
    dealerHand,
    result,
    winnings,
    timestamp: new Date(Date.now() - minutesAgo * 60000),
  };
};

// No games played yet
export const NoGames: Story = {
  args: {
    history: [],
  },
};

// Good performance stats
export const WinningPlayer: Story = {
  args: {
    history: [
      createGameResult(
        [
          { suit: "spades", rank: "A" },
          { suit: "hearts", rank: "K" },
        ],
        [
          { suit: "clubs", rank: "10" },
          { suit: "diamonds", rank: "9" },
        ],
        "player-wins",
        150,
        5
      ), // Blackjack
      createGameResult(
        [
          { suit: "hearts", rank: "10" },
          { suit: "spades", rank: "10" },
        ],
        [
          { suit: "clubs", rank: "K" },
          { suit: "diamonds", rank: "Q" },
          { suit: "hearts", rank: "5" },
        ],
        "player-wins",
        50,
        10
      ), // Dealer bust
      createGameResult(
        [
          { suit: "spades", rank: "9" },
          { suit: "hearts", rank: "9" },
        ],
        [
          { suit: "clubs", rank: "10" },
          { suit: "diamonds", rank: "7" },
        ],
        "player-wins",
        25,
        15
      ),
      createGameResult(
        [
          { suit: "hearts", rank: "K" },
          { suit: "spades", rank: "A" },
        ],
        [
          { suit: "clubs", rank: "A" },
          { suit: "diamonds", rank: "J" },
        ],
        "push",
        0,
        20
      ), // Both blackjack
      createGameResult(
        [
          { suit: "spades", rank: "8" },
          { suit: "hearts", rank: "7" },
        ],
        [
          { suit: "clubs", rank: "A" },
          { suit: "diamonds", rank: "10" },
        ],
        "dealer-wins",
        -50,
        25
      ),
      createGameResult(
        [
          { suit: "hearts", rank: "A" },
          { suit: "spades", rank: "Q" },
        ],
        [
          { suit: "clubs", rank: "K" },
          { suit: "diamonds", rank: "8" },
        ],
        "player-wins",
        75,
        30
      ), // Another blackjack
    ],
  },
};

// Poor performance stats
export const LosingPlayer: Story = {
  args: {
    history: [
      createGameResult(
        [
          { suit: "spades", rank: "10" },
          { suit: "hearts", rank: "5" },
          { suit: "clubs", rank: "8" },
        ],
        [
          { suit: "diamonds", rank: "K" },
          { suit: "hearts", rank: "7" },
        ],
        "dealer-wins",
        -100,
        5
      ), // Player bust
      createGameResult(
        [
          { suit: "hearts", rank: "8" },
          { suit: "spades", rank: "7" },
        ],
        [
          { suit: "clubs", rank: "A" },
          { suit: "diamonds", rank: "10" },
        ],
        "dealer-wins",
        -50,
        10
      ), // Dealer blackjack
      createGameResult(
        [
          { suit: "spades", rank: "6" },
          { suit: "hearts", rank: "5" },
          { suit: "clubs", rank: "K" },
        ],
        [
          { suit: "diamonds", rank: "9" },
          { suit: "hearts", rank: "8" },
        ],
        "dealer-wins",
        -25,
        15
      ), // Player bust
      createGameResult(
        [
          { suit: "hearts", rank: "10" },
          { suit: "spades", rank: "9" },
        ],
        [
          { suit: "clubs", rank: "10" },
          { suit: "diamonds", rank: "10" },
        ],
        "dealer-wins",
        -75,
        20
      ),
      createGameResult(
        [
          { suit: "spades", rank: "A" },
          { suit: "hearts", rank: "6" },
        ],
        [
          { suit: "clubs", rank: "9" },
          { suit: "diamonds", rank: "9" },
        ],
        "dealer-wins",
        -50,
        25
      ),
    ],
  },
};

// Balanced performance
export const AveragePlayer: Story = {
  args: {
    history: [
      createGameResult(
        [
          { suit: "spades", rank: "A" },
          { suit: "hearts", rank: "K" },
        ],
        [
          { suit: "clubs", rank: "10" },
          { suit: "diamonds", rank: "9" },
        ],
        "player-wins",
        75,
        5
      ), // Blackjack
      createGameResult(
        [
          { suit: "hearts", rank: "10" },
          { suit: "spades", rank: "5" },
          { suit: "clubs", rank: "8" },
        ],
        [
          { suit: "diamonds", rank: "K" },
          { suit: "hearts", rank: "7" },
        ],
        "dealer-wins",
        -50,
        10
      ), // Player bust
      createGameResult(
        [
          { suit: "spades", rank: "10" },
          { suit: "hearts", rank: "10" },
        ],
        [
          { suit: "clubs", rank: "K" },
          { suit: "diamonds", rank: "10" },
        ],
        "push",
        0,
        15
      ), // Tie
      createGameResult(
        [
          { suit: "hearts", rank: "9" },
          { suit: "spades", rank: "9" },
        ],
        [
          { suit: "clubs", rank: "10" },
          { suit: "diamonds", rank: "6" },
          { suit: "hearts", rank: "6" },
        ],
        "player-wins",
        25,
        20
      ), // Dealer bust
      createGameResult(
        [
          { suit: "spades", rank: "8" },
          { suit: "hearts", rank: "7" },
        ],
        [
          { suit: "clubs", rank: "A" },
          { suit: "diamonds", rank: "10" },
        ],
        "dealer-wins",
        -25,
        25
      ), // Dealer blackjack
      createGameResult(
        [
          { suit: "hearts", rank: "K" },
          { suit: "spades", rank: "A" },
        ],
        [
          { suit: "clubs", rank: "9" },
          { suit: "diamonds", rank: "8" },
        ],
        "player-wins",
        75,
        30
      ), // Blackjack
      createGameResult(
        [
          { suit: "spades", rank: "7" },
          { suit: "hearts", rank: "6" },
        ],
        [
          { suit: "clubs", rank: "K" },
          { suit: "diamonds", rank: "5" },
        ],
        "dealer-wins",
        -50,
        35
      ),
      createGameResult(
        [
          { suit: "hearts", rank: "Q" },
          { suit: "spades", rank: "Q" },
        ],
        [
          { suit: "clubs", rank: "J" },
          { suit: "diamonds", rank: "J" },
        ],
        "push",
        0,
        40
      ), // Tie
    ],
  },
};

// Extensive history for stress testing
export const ExtensiveHistory: Story = {
  args: {
    history: Array(50)
      .fill(null)
      .map((_, index) => {
        const results = ["player-wins", "dealer-wins", "push"] as const;
        const result = results[index % 3];
        const winnings =
          result === "player-wins"
            ? Math.floor(Math.random() * 100) + 25
            : result === "dealer-wins"
              ? -(Math.floor(Math.random() * 100) + 25)
              : 0;

        return createGameResult(
          [
            { suit: "spades", rank: "10" },
            { suit: "hearts", rank: "9" },
          ],
          [
            { suit: "clubs", rank: "K" },
            { suit: "diamonds", rank: "8" },
          ],
          result,
          winnings,
          index * 3
        );
      }),
  },
};
