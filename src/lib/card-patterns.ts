import { Card as CardType } from "../types";

export interface CardPosition {
  x: string;
  y: string;
  rotate: boolean;
}

/**
 * Get the positioning pattern for suit symbols on number cards (2-10)
 * @param num - The card number (2-10)
 * @returns Array of positions with x, y coordinates and rotation flag
 */
export const getCardPositions = (num: number): CardPosition[] => {
  const positions: Array<{ x: string; y: string; rotate: boolean }> = [];

  switch (num) {
    case 2:
      positions.push({ x: "50%", y: "25%", rotate: false });
      positions.push({ x: "50%", y: "75%", rotate: true });
      break;
    case 3:
      positions.push({ x: "50%", y: "20%", rotate: false });
      positions.push({ x: "50%", y: "50%", rotate: false });
      positions.push({ x: "50%", y: "80%", rotate: true });
      break;
    case 4:
      positions.push({ x: "30%", y: "25%", rotate: false });
      positions.push({ x: "70%", y: "25%", rotate: false });
      positions.push({ x: "30%", y: "75%", rotate: true });
      positions.push({ x: "70%", y: "75%", rotate: true });
      break;
    case 5:
      positions.push({ x: "30%", y: "20%", rotate: false });
      positions.push({ x: "70%", y: "20%", rotate: false });
      positions.push({ x: "50%", y: "50%", rotate: false });
      positions.push({ x: "30%", y: "80%", rotate: true });
      positions.push({ x: "70%", y: "80%", rotate: true });
      break;
    case 6:
      positions.push({ x: "30%", y: "20%", rotate: false });
      positions.push({ x: "70%", y: "20%", rotate: false });
      positions.push({ x: "30%", y: "50%", rotate: false });
      positions.push({ x: "70%", y: "50%", rotate: false });
      positions.push({ x: "30%", y: "80%", rotate: true });
      positions.push({ x: "70%", y: "80%", rotate: true });
      break;
    case 7:
      positions.push({ x: "30%", y: "20%", rotate: false });
      positions.push({ x: "70%", y: "20%", rotate: false });
      positions.push({ x: "50%", y: "35%", rotate: false });
      positions.push({ x: "30%", y: "50%", rotate: false });
      positions.push({ x: "70%", y: "50%", rotate: false });
      positions.push({ x: "30%", y: "80%", rotate: true });
      positions.push({ x: "70%", y: "80%", rotate: true });
      break;
    case 8:
      positions.push({ x: "30%", y: "20%", rotate: false });
      positions.push({ x: "70%", y: "20%", rotate: false });
      positions.push({ x: "50%", y: "30%", rotate: false });
      positions.push({ x: "30%", y: "45%", rotate: false });
      positions.push({ x: "70%", y: "45%", rotate: false });
      positions.push({ x: "50%", y: "70%", rotate: true });
      positions.push({ x: "30%", y: "80%", rotate: true });
      positions.push({ x: "70%", y: "80%", rotate: true });
      break;
    case 9:
      positions.push({ x: "30%", y: "18%", rotate: false });
      positions.push({ x: "70%", y: "18%", rotate: false });
      positions.push({ x: "30%", y: "35%", rotate: false });
      positions.push({ x: "70%", y: "35%", rotate: false });
      positions.push({ x: "50%", y: "50%", rotate: false });
      positions.push({ x: "30%", y: "65%", rotate: true });
      positions.push({ x: "70%", y: "65%", rotate: true });
      positions.push({ x: "30%", y: "82%", rotate: true });
      positions.push({ x: "70%", y: "82%", rotate: true });
      break;
    case 10:
      positions.push({ x: "30%", y: "18%", rotate: false });
      positions.push({ x: "70%", y: "18%", rotate: false });
      positions.push({ x: "50%", y: "28%", rotate: false });
      positions.push({ x: "30%", y: "38%", rotate: false });
      positions.push({ x: "70%", y: "38%", rotate: false });
      positions.push({ x: "30%", y: "62%", rotate: true });
      positions.push({ x: "70%", y: "62%", rotate: true });
      positions.push({ x: "50%", y: "72%", rotate: true });
      positions.push({ x: "30%", y: "82%", rotate: true });
      positions.push({ x: "70%", y: "82%", rotate: true });
      break;
    default:
      break;
  }

  // Adjust positions to account for icon centering
  return positions.map(pos => ({
    ...pos,
    x: `calc(${pos.x} - 6px)`,
    y: `calc(${pos.y} - 6px)`,
  }));
};

export interface SuitPatternConfig {
  type: "face" | "ace" | "number" | "unknown";
  centerIcon?: {
    size: string;
    opacity: string;
    filled: boolean;
  };
  positions?: CardPosition[];
  iconSize?: string;
  filled?: boolean;
}

/**
 * Get the suit pattern configuration for different card types
 * @param suit - The card suit (unused but kept for API consistency)
 * @param rank - The card rank
 * @returns Configuration object for rendering suit patterns
 */
export const getSuitPatternConfig = (
  _suit: CardType["suit"],
  rank: CardType["rank"]
): SuitPatternConfig => {
  // Face cards configuration
  if (rank === "J" || rank === "Q" || rank === "K") {
    return {
      type: "face",
      centerIcon: {
        size: "w-8 h-8",
        opacity: "opacity-15",
        filled: true,
      },
    };
  }

  // Ace configuration
  if (rank === "A") {
    return {
      type: "ace",
      centerIcon: {
        size: "w-6 h-6",
        opacity: "",
        filled: true,
      },
    };
  }

  // Number cards configuration
  const num = parseInt(rank) || 0;
  if (num >= 2 && num <= 10) {
    return {
      type: "number",
      positions: getCardPositions(num),
      iconSize: "w-3 h-3",
      filled: true,
    };
  }

  return {
    type: "unknown",
  };
};

/**
 * Get face card display text
 * @param rank - The card rank (J, Q, K)
 * @returns Display text for face cards
 */
export const getFaceCardText = (rank: CardType["rank"]): string => {
  switch (rank) {
    case "J":
      return "JACK";
    case "Q":
      return "QUEEN";
    case "K":
      return "KING";
    default:
      return "";
  }
};

/**
 * Check if a card is red (hearts or diamonds)
 * @param suit - The card suit
 * @returns True if the card is red
 */
export const isRedCard = (suit: CardType["suit"]): boolean => {
  return suit === "hearts" || suit === "diamonds";
};
