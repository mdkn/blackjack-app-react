import { Variants } from "framer-motion";

export interface AnimationConfig {
  duration: number;
  reducedMotion: boolean;
}

// Card dealing animation with staggered entrance
export const createCardDealVariants = (config: AnimationConfig): Variants => {
  const { duration, reducedMotion } = config;

  if (reducedMotion || duration === 0) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
  }

  return {
    hidden: {
      opacity: 0,
      scale: 0.3,
      rotateY: 180,
      y: -50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: duration / 1000,
      },
    },
  };
};

// Chip betting animation
export const createChipBetVariants = (config: AnimationConfig): Variants => {
  const { duration, reducedMotion } = config;

  if (reducedMotion || duration === 0) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
  }

  return {
    hidden: {
      opacity: 0,
      scale: 0.5,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 20,
        duration: duration / 1000,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: (duration * 0.7) / 1000,
      },
    },
  };
};

// Button hover and press animations
export const createButtonVariants = (config: AnimationConfig): Variants => {
  const { duration, reducedMotion } = config;

  if (reducedMotion || duration === 0) {
    return {
      idle: {},
      hover: {},
      pressed: {},
    };
  }

  return {
    idle: {
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: duration / 2000,
        ease: "easeOut",
      },
    },
    pressed: {
      scale: 0.98,
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      transition: {
        duration: duration / 4000,
        ease: "easeIn",
      },
    },
  };
};

// Game result announcement animation
export const createResultVariants = (config: AnimationConfig): Variants => {
  const { duration, reducedMotion } = config;

  if (reducedMotion || duration === 0) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
  }

  return {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 25,
        duration: duration / 1000,
      },
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      y: -10,
      transition: {
        duration: (duration * 0.6) / 1000,
        ease: "easeIn",
      },
    },
  };
};

// Modal entrance/exit animations
export const createModalVariants = (config: AnimationConfig): Variants => {
  const { duration, reducedMotion } = config;

  if (reducedMotion || duration === 0) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
  }

  return {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
        duration: duration / 1000,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: (duration * 0.8) / 1000,
        ease: "easeIn",
      },
    },
  };
};

// Staggered container animation for lists
export const createStaggerContainer = (config: AnimationConfig) => {
  const { duration, reducedMotion } = config;

  if (reducedMotion || duration === 0) {
    return {
      hidden: {},
      visible: {},
    };
  }

  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: duration / 2000,
        delayChildren: duration / 4000,
      },
    },
  };
};

// Individual staggered item animation
export const createStaggerItem = (config: AnimationConfig): Variants => {
  const { duration, reducedMotion } = config;

  if (reducedMotion || duration === 0) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
  }

  return {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: duration / 1000,
      },
    },
  };
};

// Chip stack animation when winning
export const createChipStackVariants = (config: AnimationConfig): Variants => {
  const { duration, reducedMotion } = config;

  if (reducedMotion || duration === 0) {
    return {
      normal: {},
      winning: {},
    };
  }

  return {
    normal: {
      scale: 1,
      rotate: 0,
    },
    winning: {
      scale: [1, 1.1, 1],
      rotate: [0, -2, 2, 0],
      transition: {
        duration: duration / 1000,
        ease: "easeInOut",
        times: [0, 0.5, 1],
      },
    },
  };
};

// Card flip animation for revealing dealer card
export const createCardFlipVariants = (config: AnimationConfig): Variants => {
  const { duration, reducedMotion } = config;

  if (reducedMotion || duration === 0) {
    return {
      faceDown: { rotateY: 0 },
      faceUp: { rotateY: 0 },
    };
  }

  return {
    faceDown: {
      rotateY: 0,
    },
    faceUp: {
      rotateY: 180,
      transition: {
        duration: duration / 1000,
        ease: "easeInOut",
      },
    },
  };
};
