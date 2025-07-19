import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Game/Card",
  component: Card,
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
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
    },
    faceDown: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Playing cards examples
export const AceOfSpades: Story = {
  args: {
    card: { suit: "spades", rank: "A" },
    size: "medium",
  },
};

export const KingOfHearts: Story = {
  args: {
    card: { suit: "hearts", rank: "K" },
    size: "medium",
  },
};

export const QueenOfDiamonds: Story = {
  args: {
    card: { suit: "diamonds", rank: "Q" },
    size: "medium",
  },
};

export const JackOfClubs: Story = {
  args: {
    card: { suit: "clubs", rank: "J" },
    size: "medium",
  },
};

export const TenOfSpades: Story = {
  args: {
    card: { suit: "spades", rank: "10" },
    size: "medium",
  },
};

// Different sizes
export const SmallCard: Story = {
  args: {
    card: { suit: "hearts", rank: "A" },
    size: "small",
  },
};

export const LargeCard: Story = {
  args: {
    card: { suit: "diamonds", rank: "K" },
    size: "large",
  },
};

// Special states
export const FaceDownCard: Story = {
  args: {
    faceDown: true,
    size: "medium",
  },
};

export const EmptySlot: Story = {
  args: {
    size: "medium",
  },
};

// Red and black cards comparison
export const RedCards: Story = {
  parameters: {
    docs: {
      description: {
        story: "Red cards (Hearts and Diamonds) display in red color.",
      },
    },
  },
  args: {
    card: { suit: "hearts", rank: "A" },
  },
};

export const BlackCards: Story = {
  parameters: {
    docs: {
      description: {
        story: "Black cards (Spades and Clubs) display in black color.",
      },
    },
  },
  args: {
    card: { suit: "spades", rank: "A" },
  },
};
