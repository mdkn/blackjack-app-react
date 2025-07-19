import type { Meta, StoryObj } from "@storybook/react-vite";
import { Hand } from "./Hand";
import { createEmptyHand, addCardToHand } from "../../utils";

const meta: Meta<typeof Hand> = {
  title: "Game/Hand",
  component: Hand,
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
    cardSize: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
    hideCards: {
      control: { type: "boolean" },
    },
    hideLastCard: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Empty hand
export const EmptyHand: Story = {
  args: {
    hand: createEmptyHand(),
    label: "Empty Hand",
  },
};

// Single card
export const SingleCard: Story = {
  args: {
    hand: addCardToHand(createEmptyHand(), { suit: "spades", rank: "A" }),
    label: "Single Card",
  },
};

// Blackjack hand
export const BlackjackHand: Story = {
  args: {
    hand: addCardToHand(
      addCardToHand(createEmptyHand(), { suit: "spades", rank: "A" }),
      { suit: "hearts", rank: "K" }
    ),
    label: "Blackjack!",
  },
};

// Bust hand
export const BustHand: Story = {
  args: {
    hand: addCardToHand(
      addCardToHand(
        addCardToHand(createEmptyHand(), { suit: "spades", rank: "K" }),
        { suit: "hearts", rank: "Q" }
      ),
      { suit: "diamonds", rank: "5" }
    ),
    label: "Bust Hand",
  },
};

// Soft hand (Ace + 6)
export const SoftHand: Story = {
  args: {
    hand: addCardToHand(
      addCardToHand(createEmptyHand(), { suit: "spades", rank: "A" }),
      { suit: "hearts", rank: "6" }
    ),
    label: "Soft 17",
  },
};

// Hard hand
export const HardHand: Story = {
  args: {
    hand: addCardToHand(
      addCardToHand(createEmptyHand(), { suit: "spades", rank: "10" }),
      { suit: "hearts", rank: "7" }
    ),
    label: "Hard 17",
  },
};

// Multiple cards
export const MultipleCards: Story = {
  args: {
    hand: addCardToHand(
      addCardToHand(
        addCardToHand(
          addCardToHand(createEmptyHand(), { suit: "spades", rank: "2" }),
          { suit: "hearts", rank: "3" }
        ),
        { suit: "diamonds", rank: "4" }
      ),
      { suit: "clubs", rank: "5" }
    ),
    label: "Multiple Cards",
  },
};

// Hidden hand (dealer's initial hand)
export const HiddenHand: Story = {
  args: {
    hand: addCardToHand(
      addCardToHand(createEmptyHand(), { suit: "spades", rank: "K" }),
      { suit: "hearts", rank: "A" }
    ),
    label: "Dealer Hand",
    hideCards: true,
  },
};

// Partially hidden hand (dealer with one card shown)
export const PartiallyHiddenHand: Story = {
  args: {
    hand: addCardToHand(
      addCardToHand(createEmptyHand(), { suit: "spades", rank: "K" }),
      { suit: "hearts", rank: "A" }
    ),
    label: "Dealer Hand",
    hideLastCard: true,
  },
};

// Different sizes
export const SmallCards: Story = {
  args: {
    hand: addCardToHand(
      addCardToHand(createEmptyHand(), { suit: "spades", rank: "A" }),
      { suit: "hearts", rank: "K" }
    ),
    label: "Small Size",
    cardSize: "small",
  },
};

export const LargeCards: Story = {
  args: {
    hand: addCardToHand(
      addCardToHand(createEmptyHand(), { suit: "spades", rank: "A" }),
      { suit: "hearts", rank: "K" }
    ),
    label: "Large Size",
    cardSize: "large",
  },
};
