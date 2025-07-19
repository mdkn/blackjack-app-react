import type { Meta, StoryObj } from "@storybook/react-vite";
import { Settings } from "./Settings";

const meta: Meta<typeof Settings> = {
  title: "Game/Settings",
  component: Settings,
  parameters: {
    layout: "fullscreen",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#111827" },
        { name: "table", value: "#059669" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Whether the settings modal is open",
    },
    onClose: {
      action: "closed",
      description: "Callback when settings modal is closed",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default settings modal
export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Settings closed"),
  },
};

// Closed state
export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => console.log("Settings closed"),
  },
};

// With custom styling
export const CustomStyling: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log("Settings closed"),
    className: "border-2 border-blue-500",
  },
};
