import { useMemo } from "react";
import { useSettingsStore } from "../stores";
import {
  createCardDealVariants,
  createChipBetVariants,
  createButtonVariants,
  createResultVariants,
  createModalVariants,
  createStaggerContainer,
  createStaggerItem,
  createChipStackVariants,
  createCardFlipVariants,
  AnimationConfig,
} from "../lib/animations";

export interface UseAnimationsReturn {
  config: AnimationConfig;
  cardDeal: ReturnType<typeof createCardDealVariants>;
  chipBet: ReturnType<typeof createChipBetVariants>;
  button: ReturnType<typeof createButtonVariants>;
  result: ReturnType<typeof createResultVariants>;
  modal: ReturnType<typeof createModalVariants>;
  staggerContainer: ReturnType<typeof createStaggerContainer>;
  staggerItem: ReturnType<typeof createStaggerItem>;
  chipStack: ReturnType<typeof createChipStackVariants>;
  cardFlip: ReturnType<typeof createCardFlipVariants>;
}

export const useAnimations = (): UseAnimationsReturn => {
  const { settings, getAnimationDuration } = useSettingsStore();

  const config = useMemo<AnimationConfig>(
    () => ({
      duration: getAnimationDuration(),
      reducedMotion: settings.reducedMotion,
    }),
    [getAnimationDuration, settings.reducedMotion]
  );

  const animations = useMemo(
    () => ({
      config,
      cardDeal: createCardDealVariants(config),
      chipBet: createChipBetVariants(config),
      button: createButtonVariants(config),
      result: createResultVariants(config),
      modal: createModalVariants(config),
      staggerContainer: createStaggerContainer(config),
      staggerItem: createStaggerItem(config),
      chipStack: createChipStackVariants(config),
      cardFlip: createCardFlipVariants(config),
    }),
    [config]
  );

  return animations;
};
