import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// TODO: Define all items as an enum.
interface GameState {
  
}

const useGameState = create<GameState>()(
  persist(
    (set) => ({
      
    }),
    {
      name: "minecraftle-game-state",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useGameState;
