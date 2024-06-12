import { DEFAULT_OPTIONS } from "@/constants";
import {
  ColorTable,
  GameState,
  ItemMap,
  MatchMap,
  Options,
  RecipeMap,
  Table,
  TableItem,
} from "@/types";
import { Dispatch, SetStateAction, createContext, useContext } from "react";

export type GlobalContextProps = {
  solution: string;
  items: ItemMap;
  cursorItem: TableItem;
  setCursorItem: Dispatch<SetStateAction<TableItem>>;
  cursorHoverItem: TableItem;
  setCursorHoverItem: Dispatch<SetStateAction<TableItem>>;
  craftingTables: Table[];
  setCraftingTables: Dispatch<SetStateAction<Table[]>>;
  colorTables: ColorTable[];
  setColorTables: Dispatch<SetStateAction<ColorTable[]>>;
  recipes: RecipeMap;
  trimVariants: (guess: Table) => MatchMap;
  checkAllVariants: (guess: Table) => string | undefined;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  resetGame: (isRandom: boolean) => void;
  gameDate: Date;
  remainingSolutionVariants: Table[];
};

const GlobalContext = createContext<GlobalContextProps>({
  solution: "stick",
  items: {},
  cursorItem: null,
  setCursorItem: () => {},
  cursorHoverItem: null,
  setCursorHoverItem: () => {},
  craftingTables: [],
  setCraftingTables: () => {},
  colorTables: [],
  setColorTables: () => {},
  recipes: {},
  trimVariants: () => [
    [-1, -1, -1],
    [-1, -1, -1],
    [-1, -1, -1],
  ],
  checkAllVariants: () => undefined,
  gameState: "inprogress",
  setGameState: () => {},
  resetGame: () => {},
  gameDate: new Date(),
  remainingSolutionVariants: [],
});

export const GlobalContextProvider = GlobalContext.Provider;

export const useGlobal = () => useContext(GlobalContext);
