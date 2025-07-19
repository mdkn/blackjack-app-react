import { motion } from "framer-motion";
import { Spade, Heart, Diamond, Club } from "lucide-react";
import { Card as CardType, SUIT_SYMBOLS } from "../../types";

interface CardProps {
  card?: CardType;
  faceDown?: boolean;
  size?: "small" | "medium" | "large";
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  small: "w-12 h-16 text-xs",
  medium: "w-16 h-24 text-sm",
  large: "w-20 h-28 text-base",
};

const SuitIcon = ({
  suit,
  className,
}: {
  suit: CardType["suit"];
  className?: string;
}) => {
  const iconProps = { className: className || "w-4 h-4" };

  switch (suit) {
    case "spades":
      return <Spade {...iconProps} />;
    case "hearts":
      return <Heart {...iconProps} />;
    case "diamonds":
      return <Diamond {...iconProps} />;
    case "clubs":
      return <Club {...iconProps} />;
  }
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
        className={`${sizeClasses[size]} ${className} card-back flex items-center justify-center cursor-pointer`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-2xl font-bold opacity-30">🂠</div>
      </motion.div>
    );
  }

  if (!card) {
    return (
      <div
        className={`${sizeClasses[size]} ${className} border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center`}
      >
        <span className="text-gray-400 text-xs">Empty</span>
      </div>
    );
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className} card flex flex-col justify-between p-2 cursor-pointer relative`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      initial={{ rotateY: 180 }}
      animate={{ rotateY: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Top left corner */}
      <div
        className={`flex flex-col items-center ${isRed ? "text-red-600" : "text-black"}`}
      >
        <span className="font-bold leading-none">{card.rank}</span>
        <SuitIcon suit={card.suit} className="w-3 h-3" />
      </div>

      {/* Center suit icon */}
      <div
        className={`absolute inset-0 flex items-center justify-center ${isRed ? "text-red-600" : "text-black"}`}
      >
        <SuitIcon suit={card.suit} className="w-6 h-6 opacity-20" />
      </div>

      {/* Bottom right corner (rotated) */}
      <div
        className={`flex flex-col items-center rotate-180 self-end ${isRed ? "text-red-600" : "text-black"}`}
      >
        <span className="font-bold leading-none">{card.rank}</span>
        <SuitIcon suit={card.suit} className="w-3 h-3" />
      </div>

      {/* Unicode suit symbol for larger cards */}
      {size === "large" && (
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl ${isRed ? "text-red-600" : "text-black"} opacity-10`}
        >
          {SUIT_SYMBOLS[card.suit]}
        </div>
      )}
    </motion.div>
  );
};
