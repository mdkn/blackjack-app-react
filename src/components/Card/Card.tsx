import { motion } from "framer-motion";
import { Card as CardType } from "../../types";
import { SuitIcon } from "./SuitIcons";

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
  // Special patterns for face cards
  if (rank === "J" || rank === "Q" || rank === "K") {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <SuitIcon suit={suit} className="w-8 h-8 opacity-15" filled />
      </div>
    );
  }

  // Special pattern for Ace
  if (rank === "A") {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <SuitIcon suit={suit} className="w-6 h-6" filled />
      </div>
    );
  }

  // Number card patterns
  const suitElements = [];
  const num = parseInt(rank) || 0;

  if (num >= 2 && num <= 10) {
    const positions = getCardPositions(num);
    positions.forEach((pos, index) => {
      suitElements.push(
        <div
          key={index}
          className={`absolute w-3 h-3 flex items-center justify-center ${pos.rotate ? "rotate-180" : ""}`}
          style={{ left: pos.x, top: pos.y }}
        >
          <SuitIcon suit={suit} className="w-3 h-3" filled />
        </div>
      );
    });
  }

  return <>{suitElements}</>;
};

const getCardPositions = (num: number) => {
  const positions = [];

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
  }

  return positions.map(pos => ({
    ...pos,
    x: `calc(${pos.x} - 6px)`,
    y: `calc(${pos.y} - 6px)`,
  }));
};

export const Card = ({
  card,
  faceDown = false,
  size = "medium",
  className = "",
  onClick,
}: CardProps) => {
  const isRed = card && (card.suit === "hearts" || card.suit === "diamonds");

  if (faceDown) {
    return (
      <motion.div
        className={`${sizeClasses[size]} ${className} relative overflow-hidden cursor-pointer`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 0.3 }}
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      initial={{ rotateY: 180 }}
      animate={{ rotateY: 0 }}
      transition={{ duration: 0.6 }}
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
              {card.rank === "J" && "JACK"}
              {card.rank === "Q" && "QUEEN"}
              {card.rank === "K" && "KING"}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
