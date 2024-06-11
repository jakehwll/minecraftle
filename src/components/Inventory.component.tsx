import { useEffect, useMemo, useRef, useState } from "react";
import Slot from "./Slot.component";
import { useGlobal } from "@/context/Global/context";
import {
  CACHE_VERSION,
  COLORS,
  HICONTRAST_COLORS,
  PUBLIC_DIR,
} from "@/constants";
import MCButton from "./MCButton.component";
import { Color } from "@/types";

export default function Inventory({ guessCount }: { guessCount: number }) {
  const {
    cursorItem,
    setCursorItem,
    craftingTables,
    setCraftingTables,
    gameState,
    colorTables,
    items,
    options: { highContrast },
  } = useGlobal();
  const [givenIngredients, setGivenIngredients] = useState<string[]>([]);

  const isTableEmpty = useMemo(
    () =>
      craftingTables.length > 0 &&
      craftingTables[craftingTables.length - 1].every((row) =>
        row.every((slot) => slot === undefined || slot === null)
      ),
    [craftingTables]
  );

  const invBackgrounds =
    useMemo(() => {
      if (givenIngredients.length > 0 && craftingTables.length > 0) {
        const newInvBackgrounds: { [key: string]: Color } = {};
        for (let ingredient of givenIngredients) {
          newInvBackgrounds[ingredient] = -1;
        }
        for (let [tableNum, table] of colorTables.entries()) {
          for (let [r, row] of table.entries()) {
            for (let [c, slot] of row.entries()) {
              if (
                craftingTables[tableNum][r][c] !== undefined &&
                craftingTables[tableNum][r][c] !== null
              ) {
                const newColor = colorTables[tableNum][r][c];
                const existingColor =
                  newInvBackgrounds[craftingTables[tableNum][r][c]!];

                if (existingColor === 2 || newColor === 2) {
                  newInvBackgrounds[craftingTables[tableNum][r][c]!] = 2;
                } else if (existingColor === 3 || newColor === 3) {
                  newInvBackgrounds[craftingTables[tableNum][r][c]!] = 3;
                } else if (existingColor === 0 || newColor === 0) {
                  newInvBackgrounds[craftingTables[tableNum][r][c]!] = 0;
                }
              }
            }
          }
        }
        return newInvBackgrounds;
      }
    }, [givenIngredients, craftingTables, colorTables]) ?? {};

  const { SUCCESS_COLOR, NEAR_SUCCESS_COLOR, WRONG_COLOR } = highContrast
    ? HICONTRAST_COLORS
    : COLORS;

  const COLOR_MAP: { [key: number]: string | undefined } = {
    0: WRONG_COLOR,
    2: SUCCESS_COLOR,
    3: NEAR_SUCCESS_COLOR,
  };

  useEffect(() => {
    let storedgivenIngredients = JSON.parse(
      localStorage.getItem(`givenIngredients_${CACHE_VERSION}`) ?? "[]"
    );
    if (storedgivenIngredients.length === 0) {
      fetch(PUBLIC_DIR + "/data/given_ingredients.json")
        .then((response) => response.json())
        .then((obj) => {
          setGivenIngredients(obj);
          localStorage.setItem(
            `givenIngredients_${CACHE_VERSION}`,
            JSON.stringify(obj)
          );
        });
    } else {
      setGivenIngredients(storedgivenIngredients);
    }
  }, []);

  const clearLastTable = () => {
    setCraftingTables((old) => {
      const newCraftingTables = [...old];
      newCraftingTables.pop();
      newCraftingTables.push([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);
      return newCraftingTables;
    });
    setCursorItem(null);
  };

  return (
    <div className="box inv-background max-w-[21rem] flex flex-col items-center gap-3">
      <h2>Crafting Ingredients</h2>
      <div className="flex flex-wrap">
        {Object.keys(items).length > 0 &&
          givenIngredients.map((ingredient, i) => (
            <Slot
              key={i}
              item={ingredient}
              onClick={() => {
                setCursorItem(
                  ingredient !== cursorItem ? ingredient : null
                );
              }}
              style={{
                backgroundColor: COLOR_MAP[invBackgrounds[ingredient] ?? 0]
              }}
            />
          ))}
      </div>
      <div className="flex w-full justify-between items-center">
        <div className="h-8">
          {gameState === "inprogress" && !isTableEmpty && (
            <MCButton onClick={clearLastTable}>Clear</MCButton>
          )}
        </div>
        <p>Guess {guessCount}/10</p>
      </div>
    </div>
  );
}
