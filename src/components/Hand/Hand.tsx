import { motion } from "framer-motion";
import { Card } from "../Card";
import { Hand as HandType } from "../../types";
import { getHandDisplayValue } from "../../utils";

interface HandProps {
  hand: HandType;
  label?: string;
  hideCards?: boolean;
  hideLastCard?: boolean;
  cardSize?: "small" | "medium" | "large";
  className?: string;
}

export const Hand = ({
  hand,
  label,
  hideCards = false,
  hideLastCard = false,
  cardSize = "medium",
  className = "",
}: HandProps) => {
  const { cards, value, isBlackjack, isBust } = hand;

  const getStatusColor = () => {
    if (isBust) return "text-red-500";
    if (isBlackjack) return "text-yellow-400";
    if (value === 21) return "text-green-400";
    return "text-white";
  };

  const getStatusText = () => {
    if (hideCards && cards.length > 0) return "Hidden";
    if (isBust) return "BUST!";
    if (isBlackjack) return "BLACKJACK!";
    return getHandDisplayValue(hand);
  };

  return (
    <div className={`${className} flex flex-col items-center space-y-4`}>
      {/* Label */}
      {label && <h3 className="text-lg font-semibold text-white">{label}</h3>}

      {/* Cards */}
      <div className="flex space-x-2">
        {cards.length === 0 ? (
          <Card size={cardSize} />
        ) : (
          cards.map((card, index) => {
            const shouldHide =
              hideCards || (hideLastCard && index === cards.length - 1);

            return (
              <motion.div
                key={`${card.suit}-${card.rank}-${index}`}
                initial={{
                  opacity: 0,
                  y: -100,
                  rotateY: 180,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotateY: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <Card
                  card={shouldHide ? undefined : card}
                  faceDown={shouldHide}
                  size={cardSize}
                />
              </motion.div>
            );
          })
        )}
      </div>

      {/* Hand value and status */}
      <div className="text-center">
        <div className={`text-xl font-bold ${getStatusColor()}`}>
          {getStatusText()}
        </div>

        {/* Additional info for non-hidden hands */}
        {!hideCards && cards.length > 0 && (
          <div className="text-sm text-gray-300 mt-1">
            {cards.length === 1 ? "1 card" : `${cards.length} cards`}
          </div>
        )}
      </div>
    </div>
  );
};
