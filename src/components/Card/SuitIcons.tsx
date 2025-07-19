import { Suit } from "../../types";

interface SuitIconProps {
  suit: Suit;
  className?: string;
}

export const SpadeSvg = ({ className = "w-4 h-4" }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center text-current`}>
    ♠
  </div>
);

export const HeartSvg = ({ className = "w-4 h-4" }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center text-current`}>
    ♥
  </div>
);

export const DiamondSvg = ({
  className = "w-4 h-4",
}: {
  className?: string;
}) => (
  <div className={`${className} flex items-center justify-center text-current`}>
    ♦
  </div>
);

export const ClubSvg = ({ className = "w-4 h-4" }: { className?: string }) => (
  <div className={`${className} flex items-center justify-center text-current`}>
    ♣
  </div>
);

export const SuitIcon = ({ suit, className = "w-4 h-4" }: SuitIconProps) => {
  switch (suit) {
    case "spades":
      return <SpadeSvg className={className} />;
    case "hearts":
      return <HeartSvg className={className} />;
    case "diamonds":
      return <DiamondSvg className={className} />;
    case "clubs":
      return <ClubSvg className={className} />;
  }
};
