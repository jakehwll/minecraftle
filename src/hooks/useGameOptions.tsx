import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface GameOptions {
  highContrast: boolean;
  setHighContrast: (highContrast: boolean) => void;
  hardMode: boolean;
  setHardMode: (hardMode: boolean) => void;
}

const useGameOptions = create<GameOptions>()(
  persist(
    (set) => ({
      highContrast: false,
      setHighContrast: (highContrast) => set({ highContrast }),
      hardMode: false,
      setHardMode: (hardMode) => set({ hardMode }),
    }),
    {
      name: "minecraftle-game-options",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useGameOptions;
