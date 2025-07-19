import { motion } from "framer-motion";
import { Card } from "../Card";
import { Hand as HandType } from "../../types";
import { useAnimations } from "../../hooks";

interface HandPresentationProps {
  hand: HandType;
  label?: string;
  cardSize?: "small" | "medium" | "large";
  className?: string;
  statusColor: string;
  statusText: string;
  cardCount: string;
  hasSpecialAnimation: boolean;
  shouldHideCard: (index: number, cardsLength: number) => boolean;
}

export const HandPresentation = ({
  hand,
  label,
  cardSize = "medium",
  className = "",
  statusColor,
  statusText,
  cardCount,
  hasSpecialAnimation,
  shouldHideCard,
}: HandPresentationProps) => {
  const { cards } = hand;
  const { staggerContainer, staggerItem, result } = useAnimations();

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
          <div className="flex space-x-2">
            {[1, 2].map(i => (
              <div
                key={i}
                className="w-16 h-24 border-2 border-dashed border-yellow-400 rounded-lg flex items-center justify-center bg-gray-700 animate-pulse"
              >
                <span className="text-yellow-400 text-xs">...</span>
              </div>
            ))}
          </div>
        ) : (
          cards.map((card, index) => {
            const shouldHide = shouldHideCard(index, cards.length);

            return (
              <motion.div
                key={`${card.suit}-${card.rank}-${index}`}
                variants={staggerItem}
              >
                <Card card={card} faceDown={shouldHide} size={cardSize} />
              </motion.div>
            );
          })
        )}
      </motion.div>

      {/* Hand value and status */}
      <div className="text-center">
        <motion.div
          className={`text-xl font-bold ${statusColor}`}
          variants={hasSpecialAnimation ? result : undefined}
          initial={hasSpecialAnimation ? "hidden" : undefined}
          animate={hasSpecialAnimation ? "visible" : undefined}
        >
          {statusText}
        </motion.div>

        {/* Additional info for non-hidden hands */}
        {cardCount && (
          <div className="text-sm text-gray-300 mt-1">{cardCount}</div>
        )}
      </div>
    </div>
  );
};
