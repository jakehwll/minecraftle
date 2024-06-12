import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GameState {
  boards: Array<Array<number>>;
}

const useGameState = create<GameState>()(
  persist(
    (set) => ({
      boards: [],
    }),
    {
      name: "minecraftle-game-state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useGameState;