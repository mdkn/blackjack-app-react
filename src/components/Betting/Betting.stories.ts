import type { Meta, StoryObj } from "@storybook/react-vite";
import { Betting } from "./Betting";

const meta: Meta<typeof Betting> = {
  title: "Game/Betting",
  component: Betting,
  parameters: {
    layout: "centered",
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
    playerChips: {
      control: { type: "number", min: 0, max: 10000, step: 5 },
    },
    currentBet: {
      control: { type: "number", min: 0, max: 500, step: 5 },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default betting interface
export const Default: Story = {
  args: {
    playerChips: 1000,
    currentBet: 0,
    onPlaceBet: (amount: number) => {
      console.log(`Bet placed: $${amount}`);
    },
  },
};

// Player with low chips
export const LowChips: Story = {
  args: {
    playerChips: 25,
    currentBet: 0,
    onPlaceBet: (amount: number) => {
      console.log(`Bet placed: $${amount}`);
    },
  },
};

// Player with very high chips
export const HighChips: Story = {
  args: {
    playerChips: 5000,
    currentBet: 0,
    onPlaceBet: (amount: number) => {
      console.log(`Bet placed: $${amount}`);
    },
  },
};

// Minimal chips (barely enough to play)
export const MinimalChips: Story = {
  args: {
    playerChips: 10,
    currentBet: 0,
    onPlaceBet: (amount: number) => {
      console.log(`Bet placed: $${amount}`);
    },
  },
};

// No chips (broke player)
export const NoChips: Story = {
  args: {
    playerChips: 0,
    currentBet: 0,
    onPlaceBet: (amount: number) => {
      console.log(`Bet placed: $${amount}`);
    },
  },
};

// With current bet placed
export const WithCurrentBet: Story = {
  args: {
    playerChips: 500,
    currentBet: 50,
    onPlaceBet: (amount: number) => {
      console.log(`Bet placed: $${amount}`);
    },
  },
};

// Large current bet
export const LargeCurrentBet: Story = {
  args: {
    playerChips: 200,
    currentBet: 100,
    onPlaceBet: (amount: number) => {
      console.log(`Bet placed: $${amount}`);
    },
  },
};

// Disabled state (during game)
export const Disabled: Story = {
  args: {
    playerChips: 1000,
    currentBet: 25,
    disabled: true,
    onPlaceBet: (amount: number) => {
      console.log(`Bet placed: $${amount}`);
    },
  },
};

// Interactive example with action logging
export const Interactive: Story = {
  args: {
    playerChips: 1000,
    currentBet: 0,
    onPlaceBet: (amount: number) => {
      alert(`You placed a bet of $${amount}!`);
    },
  },
};
