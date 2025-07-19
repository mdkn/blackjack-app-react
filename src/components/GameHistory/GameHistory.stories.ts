import type { Meta, StoryObj } from "@storybook/react-vite";
import { GameHistory } from "./GameHistory";
import { createEmptyHand, addCardToHand } from "../../lib/game-logic";

const meta: Meta<typeof GameHistory> = {
  title: "Game/GameHistory",
  component: GameHistory,
  parameters: {
    layout: "fullscreen",
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
  argTypes: {
    isOpen: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample game history data
const sampleHistory = [
  {
    playerHand: addCardToHand(
      addCardToHand(createEmptyHand(), { suit: "spades", rank: "A" }),
      { suit: "hearts", rank: "K" }
    ),
    dealerHand: addCardToHand(
      addCardToHand(createEmptyHand(), { suit: "clubs", rank: "10" }),
      { suit: "diamonds", rank: "9" }
    ),
    result: "player-wins" as const,
    winnings: 75,
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
  },
  {
    playerHand: addCardToHand(
      addCardToHand(
        addCardToHand(createEmptyHand(), { suit: "hearts", rank: "10" }),
        { suit: "spades", rank: "5" }
      ),
      { suit: "clubs", rank: "8" }
    ),
    dealerHand: addCardToHand(
      addCardToHand(createEmptyHand(), { suit: "diamonds", rank: "K" }),
      { suit: "hearts", rank: "7" }
    ),
    result: "dealer-wins" as const,
    winnings: -50,
    timestamp: new Date(Date.now() - 600000), // 10 minutes ago
  },
  {
    playerHand: addCardToHand(
      addCardToHand(createEmptyHand(), { suit: "spades", rank: "10" }),
      { suit: "hearts", rank: "10" }
    ),
    dealerHand: addCardToHand(
      addCardToHand(createEmptyHand(), { suit: "clubs", rank: "K" }),
      { suit: "diamonds", rank: "10" }
    ),
    result: "push" as const,
    winnings: 0,
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
  },
  {
    playerHand: addCardToHand(
      addCardToHand(createEmptyHand(), { suit: "hearts", rank: "A" }),
      { suit: "spades", rank: "Q" }
    ),
    dealerHand: addCardToHand(
      addCardToHand(
        addCardToHand(createEmptyHand(), { suit: "clubs", rank: "6" }),
        { suit: "diamonds", rank: "5" }
      ),
      { suit: "hearts", rank: "K" }
    ),
    result: "player-wins" as const,
    winnings: 150, // Blackjack 3:2 payout
    timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
  },
  {
    playerHand: addCardToHand(
      addCardToHand(createEmptyHand(), { suit: "spades", rank: "8" }),
      { suit: "hearts", rank: "7" }
    ),
    dealerHand: addCardToHand(
      addCardToHand(createEmptyHand(), { suit: "clubs", rank: "A" }),
      { suit: "diamonds", rank: "10" }
    ),
    result: "dealer-wins" as const,
    winnings: -25,
    timestamp: new Date(Date.now() - 1500000), // 25 minutes ago
  },
];

// Empty history
export const EmptyHistory: Story = {
  args: {
    history: [],
    isOpen: true,
    onClose: () => console.log("Close history"),
  },
};

// With game history
export const WithHistory: Story = {
  args: {
    history: sampleHistory,
    isOpen: true,
    onClose: () => console.log("Close history"),
  },
};

// Closed modal
export const Closed: Story = {
  args: {
    history: sampleHistory,
    isOpen: false,
    onClose: () => console.log("Close history"),
  },
};

// Single game
export const SingleGame: Story = {
  args: {
    history: [sampleHistory[0]],
    isOpen: true,
    onClose: () => console.log("Close history"),
  },
};

// Long history (stress test)
export const LongHistory: Story = {
  args: {
    history: Array(20)
      .fill(null)
      .map((_, index) => ({
        ...sampleHistory[index % sampleHistory.length],
        timestamp: new Date(Date.now() - index * 180000), // Every 3 minutes
        winnings:
          Math.random() > 0.5
            ? Math.floor(Math.random() * 100)
            : -Math.floor(Math.random() * 100),
      })),
    isOpen: true,
    onClose: () => console.log("Close history"),
  },
};
