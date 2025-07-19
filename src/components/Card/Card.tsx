import React from "react";
import { motion } from "framer-motion";
import { Card as CardType } from "../../types";
import { SuitIcon } from "./SuitIcons";
import { useAnimations } from "../../hooks";
import {
  getSuitPatternConfig,
  getFaceCardText,
  isRedCard,
  SuitPatternConfig,
} from "../../lib/card-patterns";

interface CardProps {
  card?: CardType;
  faceDown?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  small: "w-14 h-20 text-xs",
  medium: "w-18 h-26 text-sm",
  large: "w-24 h-34 text-base",
};

const getSuitPattern = (suit: CardType["suit"], rank: CardType["rank"]) => {
  const config: SuitPatternConfig = getSuitPatternConfig(suit, rank);

  switch (config.type) {
    case "face":
      if (config.centerIcon) {
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <SuitIcon
              suit={suit}
              className={`${config.centerIcon.size} ${config.centerIcon.opacity}`}
              filled={config.centerIcon.filled}
            />
          </div>
        );
      }
      return null;

    case "ace":
      if (config.centerIcon) {
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <SuitIcon
              suit={suit}
              className={config.centerIcon.size}
              filled={config.centerIcon.filled}
            />
          </div>
        );
      }
      return null;

    case "number": {
      const suitElements: React.ReactElement[] = [];
      if (config.positions && config.iconSize && config.filled !== undefined) {
        config.positions.forEach((pos, index) => {
          suitElements.push(
            <div
              key={index}
              className={`absolute ${config.iconSize} flex items-center justify-center ${pos.rotate ? "rotate-180" : ""}`}
              style={{ left: pos.x, top: pos.y }}
            >
              <SuitIcon
                suit={suit}
                className={config.iconSize}
                filled={config.filled}
              />
            </div>
          );
        });
      }
      return <>{suitElements}</>;
    }

    default:
      return null;
  }
};

export const Card = ({
  card,
  faceDown = false,
  size = "medium",
  className = "",
  onClick,
}: CardProps) => {
  const isRed = card && isRedCard(card.suit);
  const { cardDeal, cardFlip } = useAnimations();

  if (faceDown) {
    return (
      <motion.div
        className={`${sizeClasses[size]} ${className} relative overflow-hidden cursor-pointer`}
        variants={cardFlip}
        initial="faceDown"
        animate="faceDown"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        style={{
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e3a8a 100%)",
          borderRadius: "8px",
          border: "2px solid #fbbf24",
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      >
        {/* Decorative pattern */}
        <div className="absolute inset-1 border border-yellow-400 rounded-md opacity-60">
          <div className="w-full h-full relative overflow-hidden">
            {/* Diamond pattern */}
            <svg
              className="absolute inset-0 w-full h-full opacity-30"
              viewBox="0 0 100 100"
            >
              <defs>
                <pattern
                  id="diamonds"
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <polygon
                    points="10,5 15,10 10,15 5,10"
                    fill="#fbbf24"
                    opacity="0.3"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#diamonds)" />
            </svg>

            {/* Center logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-yellow-400 font-bold text-xs opacity-80">
                ♠♥♦♣
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!card) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-gray-100`}
        style={{ boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)" }}
      >
        <span className="text-gray-400 text-xs font-medium">Empty</span>
      </div>
    );
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className} relative overflow-hidden cursor-pointer`}
      variants={cardDeal}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        background: "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)",
        borderRadius: "8px",
        border: "2px solid #e2e8f0",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      {/* Card inner content */}
      <div className="absolute inset-1 bg-white rounded-md p-1 flex flex-col justify-between">
        {/* Top left corner */}
        <div
          className={`flex flex-col items-start ${isRed ? "text-red-600" : "text-gray-900"}`}
        >
          <span className="font-bold leading-none text-sm">{card.rank}</span>
          <SuitIcon suit={card.suit} className="w-3 h-3 mt-0.5" filled />
        </div>

        {/* Center suit pattern */}
        <div
          className={`absolute inset-0 ${isRed ? "text-red-600" : "text-gray-900"}`}
        >
          {getSuitPattern(card.suit, card.rank)}
        </div>

        {/* Bottom right corner (rotated) */}
        <div
          className={`flex flex-col items-end rotate-180 ${isRed ? "text-red-600" : "text-gray-900"}`}
        >
          <span className="font-bold leading-none text-sm">{card.rank}</span>
          <SuitIcon suit={card.suit} className="w-3 h-3 mt-0.5" filled />
        </div>

        {/* Face card decorative elements */}
        {(card.rank === "J" || card.rank === "Q" || card.rank === "K") && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`text-xs font-semibold opacity-80 ${isRed ? "text-red-600" : "text-gray-900"}`}
            >
              {getFaceCardText(card.rank)}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
