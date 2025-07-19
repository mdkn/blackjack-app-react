import { Suit } from "../../types";

interface SuitIconProps {
  suit: Suit;
  className?: string;
  filled?: boolean;
}

export const SpadeSvg = ({ className = "w-4 h-4", filled = true }: { className?: string; filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "none" : "currentColor"}
    strokeWidth={filled ? 0 : 2}
  >
    <path d="M12 2C12 2 4 8 4 14C4 17 6.5 19 10 19C11 19 12 18.5 12 18.5C12 18.5 13 19 14 19C17.5 19 20 17 20 14C20 8 12 2 12 2Z" />
    <path d="M9 19H15V22H9V19Z" />
  </svg>
);

export const HeartSvg = ({ className = "w-4 h-4", filled = true }: { className?: string; filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "none" : "currentColor"}
    strokeWidth={filled ? 0 : 2}
  >
    <path d="M20.84 4.61C19.5 3.13 17.42 2.44 15.31 3.17C13.4 3.82 12 5.85 12 5.85C12 5.85 10.6 3.82 8.69 3.17C6.58 2.44 4.5 3.13 3.16 4.61C1.22 6.7 1.22 10.28 3.16 12.37L12 22L20.84 12.37C22.78 10.28 22.78 6.7 20.84 4.61Z" />
  </svg>
);

export const DiamondSvg = ({ className = "w-4 h-4", filled = true }: { className?: string; filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "none" : "currentColor"}
    strokeWidth={filled ? 0 : 2}
  >
    <path d="M12 2L6 12L12 22L18 12L12 2Z" />
  </svg>
);

export const ClubSvg = ({ className = "w-4 h-4", filled = true }: { className?: string; filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "none" : "currentColor"}
    strokeWidth={filled ? 0 : 2}
  >
    <circle cx="8" cy="6" r="4" />
    <circle cx="16" cy="6" r="4" />
    <circle cx="12" cy="14" r="5" />
    <path d="M9 19H15V22H9V19Z" />
  </svg>
);

export const SuitIcon = ({ suit, className = "w-4 h-4", filled = true }: SuitIconProps) => {
  switch (suit) {
    case "spades":
      return <SpadeSvg className={className} filled={filled} />;
    case "hearts":
      return <HeartSvg className={className} filled={filled} />;
    case "diamonds":
      return <DiamondSvg className={className} filled={filled} />;
    case "clubs":
      return <ClubSvg className={className} filled={filled} />;
  }
};