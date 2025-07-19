import { motion } from "framer-motion";
import { Card } from "../Card";
import { Hand as HandType } from "../../types";
import { getHandDisplayValue } from "../../lib/game-logic";
import { useAnimations } from "../../hooks";

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
  const { staggerContainer, staggerItem, result } = useAnimations();

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
      <motion.div
        className="flex space-x-2"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {cards.length === 0 ? (
          <Card size={cardSize} />
        ) : (
          cards.map((card, index) => {
            const shouldHide =
              hideCards || (hideLastCard && index === cards.length - 1);

            return (
              <motion.div
                key={`${card.suit}-${card.rank}-${index}`}
                variants={staggerItem}
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
      </motion.div>

      {/* Hand value and status */}
      <div className="text-center">
        <motion.div
          className={`text-xl font-bold ${getStatusColor()}`}
          variants={isBust || isBlackjack ? result : undefined}
          initial={isBust || isBlackjack ? "hidden" : undefined}
          animate={isBust || isBlackjack ? "visible" : undefined}
        >
          {getStatusText()}
        </motion.div>

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
