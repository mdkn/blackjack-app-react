import type { Meta, StoryObj } from "@storybook/react-vite";
import { GameControls } from "./GameControls";

const meta: Meta<typeof GameControls> = {
  title: "Game/GameControls",
  component: GameControls,
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
    phase: {
      control: { type: "select" },
      options: [
        "betting",
        "dealing",
        "player-turn",
        "dealer-turn",
        "game-over",
      ],
    },
    playerCanHit: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultActions = {
  onHit: () => console.log("Hit clicked"),
  onStand: () => console.log("Stand clicked"),
  onNewRound: () => console.log("New Round clicked"),
  onNewGame: () => console.log("New Game clicked"),
};

// Betting phase
export const BettingPhase: Story = {
  args: {
    phase: "betting",
    playerCanHit: false,
    ...defaultActions,
  },
};

// Dealing phase
export const DealingPhase: Story = {
  args: {
    phase: "dealing",
    playerCanHit: false,
    ...defaultActions,
  },
};

// Player turn (can hit)
export const PlayerTurnCanHit: Story = {
  args: {
    phase: "player-turn",
    playerCanHit: true,
    ...defaultActions,
  },
};

// Player turn (cannot hit - hand too high)
export const PlayerTurnCannotHit: Story = {
  args: {
    phase: "player-turn",
    playerCanHit: false,
    ...defaultActions,
  },
};

// Dealer turn
export const DealerTurn: Story = {
  args: {
    phase: "dealer-turn",
    playerCanHit: false,
    ...defaultActions,
  },
};

// Game over
export const GameOver: Story = {
  args: {
    phase: "game-over",
    playerCanHit: false,
    ...defaultActions,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    phase: "player-turn",
    playerCanHit: true,
    disabled: true,
    ...defaultActions,
  },
};

// Interactive example
export const Interactive: Story = {
  args: {
    phase: "player-turn",
    playerCanHit: true,
    onHit: () => alert("Hit! Taking another card..."),
    onStand: () => alert("Stand! Ending your turn..."),
    onNewRound: () => alert("Starting new round..."),
    onNewGame: () => alert("Starting new game..."),
  },
};
