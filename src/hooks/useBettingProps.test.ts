import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useBettingProps } from "./useBettingProps";

// Mock the game store
const mockGameStore = {
  player: {
    name: "Player",
    chips: 1000,
    hand: { cards: [], value: 0, isBlackjack: false, isBust: false },
    currentBet: 0,
  },
  customBet: 25,
  minBet: 5,
  setCustomBet: vi.fn(),
  placeBet: vi.fn(),
};

// Mock useGameStore
vi.mock("../stores", () => ({
  useGameStore: () => mockGameStore,
}));

// Mock useSound
vi.mock("./useSound", () => ({
  useSound: () => ({
    playSound: vi.fn(),
  }),
}));

describe("useBettingProps", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock store values
    mockGameStore.player.chips = 1000;
    mockGameStore.player.currentBet = 0;
    mockGameStore.customBet = 25;
    mockGameStore.minBet = 5;
  });

  it("should return correct display values", () => {
    const { result } = renderHook(() => useBettingProps());

    expect(result.current.playerChips).toBe(1000);
    expect(result.current.currentBet).toBe(0);
    expect(result.current.customBet).toBe(25);
    expect(result.current.minBet).toBe(5);
    expect(result.current.effectiveMaxBet).toBe(1000);
    expect(result.current.disabled).toBe(false);
    expect(result.current.className).toBe("");
  });

  it("should return correct default preset bets", () => {
    const { result } = renderHook(() => useBettingProps());

    expect(result.current.presetBets).toEqual([5, 10, 25, 50, 100]);
  });

  it("should accept custom preset bets", () => {
    const customPresets = [10, 20, 50];
    const { result } = renderHook(() =>
      useBettingProps({ presetBets: customPresets })
    );

    expect(result.current.presetBets).toEqual(customPresets);
  });

  describe("canAffordAmount", () => {
    it("should return true when player can afford the amount", () => {
      const { result } = renderHook(() => useBettingProps());

      expect(result.current.canAffordAmount(100)).toBe(true);
      expect(result.current.canAffordAmount(5)).toBe(true);
      expect(result.current.canAffordAmount(1000)).toBe(true);
    });

    it("should return false when player cannot afford the amount", () => {
      const { result } = renderHook(() => useBettingProps());

      expect(result.current.canAffordAmount(1001)).toBe(false);
      expect(result.current.canAffordAmount(2000)).toBe(false);
    });

    it("should return false when amount is below minimum bet", () => {
      const { result } = renderHook(() => useBettingProps());

      expect(result.current.canAffordAmount(4)).toBe(false);
      expect(result.current.canAffordAmount(1)).toBe(false);
      expect(result.current.canAffordAmount(0)).toBe(false);
    });
  });

  describe("canPlaceCustomBet", () => {
    it("should return true when conditions are met", () => {
      const { result } = renderHook(() => useBettingProps());

      expect(result.current.canPlaceCustomBet).toBe(true);
    });

    it("should return false when disabled", () => {
      const { result } = renderHook(() => useBettingProps({ disabled: true }));

      expect(result.current.canPlaceCustomBet).toBe(false);
    });

    it("should return false when custom bet equals current bet", () => {
      mockGameStore.player.currentBet = 25;
      const { result } = renderHook(() => useBettingProps());

      expect(result.current.canPlaceCustomBet).toBe(false);
    });

    it("should return false when custom bet is below minimum", () => {
      mockGameStore.customBet = 3;
      const { result } = renderHook(() => useBettingProps());

      expect(result.current.canPlaceCustomBet).toBe(false);
    });

    it("should return false when custom bet exceeds player chips", () => {
      mockGameStore.customBet = 1500;
      const { result } = renderHook(() => useBettingProps());

      expect(result.current.canPlaceCustomBet).toBe(false);
    });
  });

  describe("getPresetButtonProps", () => {
    it("should return enabled button props when player can afford", () => {
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getPresetButtonProps(50);

      expect(buttonProps.disabled).toBe(false);
      expect(buttonProps.className).toContain("bg-blue-600");
      expect(typeof buttonProps.onClick).toBe("function");
    });

    it("should return disabled button props when player cannot afford", () => {
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getPresetButtonProps(1500);

      expect(buttonProps.disabled).toBe(true);
      expect(buttonProps.className).toContain("bg-gray-700");
      expect(buttonProps.className).toContain("cursor-not-allowed");
    });

    it("should return disabled button props when component is disabled", () => {
      const { result } = renderHook(() => useBettingProps({ disabled: true }));
      const buttonProps = result.current.getPresetButtonProps(50);

      expect(buttonProps.disabled).toBe(true);
      expect(buttonProps.className).toContain("bg-gray-700");
    });

    it("should call placeBet when button is clicked", () => {
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getPresetButtonProps(50);

      act(() => {
        buttonProps.onClick();
      });

      expect(mockGameStore.placeBet).toHaveBeenCalledWith(50);
    });

    it("should not call placeBet when player cannot afford", () => {
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getPresetButtonProps(1500);

      act(() => {
        buttonProps.onClick();
      });

      expect(mockGameStore.placeBet).not.toHaveBeenCalled();
    });
  });

  describe("getCustomBetInputProps", () => {
    it("should return correct input props", () => {
      const { result } = renderHook(() => useBettingProps());
      const inputProps = result.current.getCustomBetInputProps();

      expect(inputProps.type).toBe("number");
      expect(inputProps.value).toBe(25);
      expect(inputProps.min).toBe(5);
      expect(inputProps.max).toBe(1000);
      expect(inputProps.disabled).toBe(false);
      expect(typeof inputProps.onChange).toBe("function");
    });

    it("should be disabled when component is disabled", () => {
      const { result } = renderHook(() => useBettingProps({ disabled: true }));
      const inputProps = result.current.getCustomBetInputProps();

      expect(inputProps.disabled).toBe(true);
    });

    it("should call setCustomBet when value changes", () => {
      const { result } = renderHook(() => useBettingProps());
      const inputProps = result.current.getCustomBetInputProps();

      const mockEvent = {
        target: { value: "100" },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        inputProps.onChange(mockEvent);
      });

      expect(mockGameStore.setCustomBet).toHaveBeenCalledWith(100);
    });

    it("should enforce minimum bet when setting value", () => {
      const { result } = renderHook(() => useBettingProps());
      const inputProps = result.current.getCustomBetInputProps();

      const mockEvent = {
        target: { value: "2" },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        inputProps.onChange(mockEvent);
      });

      expect(mockGameStore.setCustomBet).toHaveBeenCalledWith(5);
    });

    it("should enforce maximum bet when setting value", () => {
      const { result } = renderHook(() => useBettingProps());
      const inputProps = result.current.getCustomBetInputProps();

      const mockEvent = {
        target: { value: "1500" },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        inputProps.onChange(mockEvent);
      });

      expect(mockGameStore.setCustomBet).toHaveBeenCalledWith(1000);
    });
  });

  describe("getCustomBetButtonProps", () => {
    it("should return enabled button when bet can be placed", () => {
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getCustomBetButtonProps();

      expect(buttonProps.disabled).toBe(false);
      expect(buttonProps.className).toContain("bg-green-600");
    });

    it("should return disabled button when bet cannot be placed", () => {
      mockGameStore.player.currentBet = 25; // Same as customBet
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getCustomBetButtonProps();

      expect(buttonProps.disabled).toBe(true);
      expect(buttonProps.className).toContain("bg-gray-700");
    });

    it("should call placeBet when clicked", () => {
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getCustomBetButtonProps();

      act(() => {
        buttonProps.onClick();
      });

      expect(mockGameStore.placeBet).toHaveBeenCalledWith(25);
    });
  });

  describe("getAllInButtonProps", () => {
    it("should return enabled button when player has enough chips", () => {
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getAllInButtonProps();

      expect(buttonProps.disabled).toBe(false);
      expect(buttonProps.className).toContain("border-red-500");
    });

    it("should return disabled button when player has insufficient chips", () => {
      mockGameStore.player.chips = 3; // Below minimum bet
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getAllInButtonProps();

      expect(buttonProps.disabled).toBe(true);
      expect(buttonProps.className).toContain("border-gray-600");
    });

    it("should call placeBet with all chips when clicked", () => {
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getAllInButtonProps();

      act(() => {
        buttonProps.onClick();
      });

      expect(mockGameStore.placeBet).toHaveBeenCalledWith(1000);
    });
  });

  describe("increment/decrement buttons", () => {
    it("should return enabled increment button when possible", () => {
      mockGameStore.customBet = 100;
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getIncrementButtonProps();

      expect(buttonProps.disabled).toBe(false);
      expect(buttonProps.className).toContain("bg-gray-700 hover:bg-gray-600");
    });

    it("should return disabled increment button at max chips", () => {
      mockGameStore.customBet = 1000;
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getIncrementButtonProps();

      expect(buttonProps.disabled).toBe(true);
      expect(buttonProps.className).toContain("cursor-not-allowed");
    });

    it("should return enabled decrement button when possible", () => {
      mockGameStore.customBet = 100;
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getDecrementButtonProps();

      expect(buttonProps.disabled).toBe(false);
      expect(buttonProps.className).toContain("bg-gray-700 hover:bg-gray-600");
    });

    it("should return disabled decrement button at minimum", () => {
      mockGameStore.customBet = 5;
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getDecrementButtonProps();

      expect(buttonProps.disabled).toBe(true);
      expect(buttonProps.className).toContain("cursor-not-allowed");
    });

    it("should increment custom bet by 5", () => {
      mockGameStore.customBet = 100;
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getIncrementButtonProps();

      act(() => {
        buttonProps.onClick();
      });

      expect(mockGameStore.setCustomBet).toHaveBeenCalledWith(105);
    });

    it("should decrement custom bet by 5", () => {
      mockGameStore.customBet = 100;
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getDecrementButtonProps();

      act(() => {
        buttonProps.onClick();
      });

      expect(mockGameStore.setCustomBet).toHaveBeenCalledWith(95);
    });

    it("should not exceed player chips when incrementing", () => {
      mockGameStore.customBet = 998;
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getIncrementButtonProps();

      act(() => {
        buttonProps.onClick();
      });

      expect(mockGameStore.setCustomBet).toHaveBeenCalledWith(1000);
    });

    it("should not go below minimum when decrementing", () => {
      mockGameStore.customBet = 7;
      const { result } = renderHook(() => useBettingProps());
      const buttonProps = result.current.getDecrementButtonProps();

      act(() => {
        buttonProps.onClick();
      });

      expect(mockGameStore.setCustomBet).toHaveBeenCalledWith(5);
    });
  });

  describe("effectiveMaxBet calculation", () => {
    it("should return player chips when less than 1000", () => {
      mockGameStore.player.chips = 500;
      const { result } = renderHook(() => useBettingProps());

      expect(result.current.effectiveMaxBet).toBe(500);
    });

    it("should return 1000 when player has more than 1000", () => {
      mockGameStore.player.chips = 2000;
      const { result } = renderHook(() => useBettingProps());

      expect(result.current.effectiveMaxBet).toBe(1000);
    });
  });

  describe("props getter stability", () => {
    it("should provide consistent button props for same inputs", () => {
      const { result } = renderHook(() => useBettingProps());

      const firstButtonProps = result.current.getPresetButtonProps(50);
      const secondButtonProps = result.current.getPresetButtonProps(50);

      expect(firstButtonProps.disabled).toBe(secondButtonProps.disabled);
      expect(firstButtonProps.className).toBe(secondButtonProps.className);
      expect(typeof firstButtonProps.onClick).toBe(
        typeof secondButtonProps.onClick
      );
    });

    it("should update props when dependencies change", () => {
      const { result, rerender } = renderHook(props => useBettingProps(props), {
        initialProps: { disabled: false },
      });

      const enabledButtonProps = result.current.getPresetButtonProps(50);

      rerender({ disabled: true });

      const disabledButtonProps = result.current.getPresetButtonProps(50);

      expect(enabledButtonProps.disabled).toBe(false);
      expect(disabledButtonProps.disabled).toBe(true);
    });
  });
});
