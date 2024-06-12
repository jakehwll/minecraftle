export type Table = [TableRow, TableRow, TableRow];
export type TableRow = [TableItem, TableItem, TableItem];
export type TableItem = string | null | number

export type Color = number | undefined;
export type ColorRow = [Color, Color, Color];
export type ColorTable = [ColorRow, ColorRow, ColorRow];

export type Item = {
  name: string;
  icon: string;
  stack: number;
};
export type ItemMap = { [key: string]: Item };

export type RawRecipe = (string | null)[][];

export type Recipe = {
  type: string;
  group: string;
  output: string;
  input: RawRecipe;
};

export type RecipeMap = {
  [key: string]: Recipe;
};

export type MatchMapRow = [number, number, number];
export type MatchMap = [MatchMapRow, MatchMapRow, MatchMapRow];

// TODO Rename this to "GameStatus"
export enum GameState {
  InProgress = "IN_PROGRESS",
  Win = "WIN",
  Lose = "LOSE",
};