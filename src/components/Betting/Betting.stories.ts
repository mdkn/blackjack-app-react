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
    disabled: {
      control: { type: "boolean" },
    },
    presetBets: {
      control: { type: "object" },
    },
    className: {
      control: { type: "text" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default betting interface
export const Default: Story = {
  args: {
    disabled: false,
    presetBets: [5, 10, 25, 50, 100],
    className: "",
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    disabled: true,
    presetBets: [5, 10, 25, 50, 100],
    className: "",
  },
};

// Custom preset bets
export const CustomPresetBets: Story = {
  args: {
    disabled: false,
    presetBets: [10, 25, 50, 100, 200],
    className: "",
  },
};

// Small preset bets
export const SmallPresetBets: Story = {
  args: {
    disabled: false,
    presetBets: [1, 2, 5, 10, 25],
    className: "",
  },
};

// High stakes preset bets
export const HighStakesPresetBets: Story = {
  args: {
    disabled: false,
    presetBets: [50, 100, 250, 500, 1000],
    className: "",
  },
};

// Limited options
export const LimitedOptions: Story = {
  args: {
    disabled: false,
    presetBets: [5, 10, 25],
    className: "",
  },
};

// Many options
export const ManyOptions: Story = {
  args: {
    disabled: false,
    presetBets: [1, 5, 10, 15, 20, 25, 50, 75, 100],
    className: "",
  },
};

// With custom styling
export const WithCustomStyling: Story = {
  args: {
    disabled: false,
    presetBets: [5, 10, 25, 50, 100],
    className: "border-2 border-yellow-400",
  },
};

// Minimal configuration
export const Minimal: Story = {
  args: {},
};
