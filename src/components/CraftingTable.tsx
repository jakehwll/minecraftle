import { COLORS, HICONTRAST_COLORS } from "@/constants";
import { useGlobal } from "@/context/Global/context";
import { ColorTable, Table } from "@/types";
import { MouseEventHandler, useEffect, useState } from "react";
import Slot from "./Slot";
import classes from "./CraftingTable.module.css";
import cc from "classcat";
import useGameOptions from "@/hooks/useGameOptions";
import Image from "next/image";
import arrow from "../../public/arrow.png";
import arrow__no_craft from "../../public/arrow_nocraft.png";

const CRAFTING_TABLE_EMPTY: Table = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];
const COLOR_TABLE_EMPTY: ColorTable = [
  [undefined, undefined, undefined],
  [undefined, undefined, undefined],
  [undefined, undefined, undefined],
];
const COLOR_TABLE_CORRECT: ColorTable = [
  [2, 2, 2],
  [2, 2, 2],
  [2, 2, 2],
];

export default function CraftingTable({
  solved = false,
  tableNum = 0,
  disabled = false,
}: {
  solved?: boolean;
  tableNum?: number;
  disabled?: boolean;
}) {
  const [currentRecipe, setCurrentRecipe] = useState<string | undefined>();
  const [dragging, setDragging] = useState(false);

  const {
    cursorItem,
    setCursorItem,
    setCraftingTables,
    craftingTables,
    solution,
    trimVariants,
    colorTables,
    setColorTables,
    setGameState,
    recipes,
    remainingSolutionVariants,
    checkAllVariants,
  } = useGlobal();
  const options = useGameOptions();

  const colorTable = solved ? COLOR_TABLE_EMPTY : colorTables[tableNum];
  const currentTable = solved
    ? remainingSolutionVariants[0]
    : craftingTables[tableNum];

  const { SUCCESS_COLOR, NEAR_SUCCESS_COLOR } = options.highContrast
    ? HICONTRAST_COLORS
    : COLORS;

  const COLOR_TABLE_MAPPING: { [key: number]: string | undefined } = {
    0: undefined,
    2: SUCCESS_COLOR,
    3: NEAR_SUCCESS_COLOR,
  };

  const submitRecipe = () => {
    // We don't want to submit if the game is already solved
    if (solved) return;

    // We don't want to submit if the game is in hard mode and the current recipe is invalid
    if (currentRecipe === undefined && options.hardMode) return;

    // Check to see if the current recipe is correct
    if (currentRecipe === recipes[solution].output) {
      setColorTables((old) => [...old, COLOR_TABLE_CORRECT]);
      setGameState("won");
      return;
    }

    // If the current recipe is incorrect, we need to tell the user
    // which slots are correct and which are incorrect
    const correctSlots = trimVariants(currentTable);
    setColorTables((colorTables) => [...colorTables, correctSlots]);

    // If the user has more than 10 crafting tables, they lose.
    // Otherwise we add a new crafting table for them to try again.
    if (craftingTables.length < 10) {
      setCraftingTables((craftingTables) => ([
        ...craftingTables,
        CRAFTING_TABLE_EMPTY,
      ]));
      setColorTables((colorTables) => ([...colorTables, COLOR_TABLE_EMPTY]));
    } else {
      setGameState("lost");
    }
  };

  // Prevent the context menu from appearing when right-clicking on a slot
  useEffect(() => {
    const callback = (event: MouseEvent) => {
      if (event.target !== null) {
        const target = event.target as HTMLElement;
        target.getAttribute("data-slot") === "slot" && event.preventDefault();
      }
    };
    document.addEventListener("contextmenu", callback);
    return () => document.removeEventListener("contextmenu", callback);
  });

  // Handle multi-slot dragging
  useEffect(() => {
    const mouseDownCallback = (event: MouseEvent) => {
      if (event.which !== 3) return;
      setDragging(true);
    };
    const mouseUpCallback = (event: MouseEvent) => {
      if (event.which !== 3) return;
      setDragging(false);
    };
    document.addEventListener("mousedown", mouseDownCallback);
    document.addEventListener("mouseup", mouseUpCallback);
    return () => {
      document.removeEventListener("mousedown", mouseDownCallback);
      document.removeEventListener("mouseup", mouseUpCallback);
    };
  }, []);

  //
  useEffect(() => {
    const mouseDownCallback = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isDisabled = target.getAttribute("data-slot-disabled") === "true";
      
      if (isDisabled) return;

      if (event.which === 1) {
        if (target.getAttribute("data-slot-id") === null) return;

        const [tableNum, rowIndex, columnIndex] = target
          .getAttribute("data-slot-id")!
          .split("-")
          .map(Number);
        
        if (cursorItem !== null) {
          setCraftingTables((craftingTables) => {
            let result = [...craftingTables];
            result[tableNum][rowIndex][columnIndex] = cursorItem;
            return result;
          });
          setCursorItem(null);
        } else {
          if (craftingTables[tableNum][rowIndex][columnIndex] === null) return;
          setCursorItem(craftingTables[tableNum][rowIndex][columnIndex]);
          setCraftingTables((craftingTables) => {
            let result = [...craftingTables];
            result[tableNum][rowIndex][columnIndex] = null;
            return result;
          });
        }
      }
    };
    const mouseMoveCallback = (ev: MouseEvent) => {
      if (!dragging) return;
      
      const target = ev.target as HTMLElement;
      
      if (target.getAttribute("data-slot-id") === null) return;
      
      const [tableNum, rowIndex, columnIndex] = target
        .getAttribute("data-slot-id")!
        .split("-")
        .map(Number);
      
      if (cursorItem === null) return;
      
      setCraftingTables((old) => {
        const newCraftingTables = [...old];
        newCraftingTables[tableNum][rowIndex][columnIndex] = cursorItem;
        return newCraftingTables;
      });
    };

    document.addEventListener("mousedown", mouseDownCallback);
    document.addEventListener("mousemove", mouseMoveCallback);
    
    return () => {
      document.removeEventListener("mousedown", mouseDownCallback);
      document.removeEventListener("mousemove", mouseMoveCallback);
    };
  });

  // Whenever the crafting tables change, we need to check if the current recipe is valid
  useEffect(
    () => setCurrentRecipe(checkAllVariants(currentTable)),
    [craftingTables]
  );

  return (
    <>
      <div className={classes.root}>
        <div
          className={cc([
            "flex justify-between items-center w-[21rem]",
            classes.inner,
          ])}
        >
          <div className="w-36 h-36 flex flex-wrap">
            {currentTable.map((row, rowIndex) => (
              <div className="flex" key={rowIndex}>
                {row.map((item, columnIndex) => (
                  <Slot
                    key={`${rowIndex}-${columnIndex}`}
                    item={item}
                    style={
                      {
                        "--slot-background":
                          COLOR_TABLE_MAPPING[
                            colorTable[rowIndex][columnIndex] ?? 0
                          ],
                      } as React.CSSProperties
                    }
                    onContextMenu={(event) => event.preventDefault()}
                    slotId={`${tableNum}-${rowIndex}-${columnIndex}`}
                    disabled={disabled}
                  />
                ))}
              </div>
            ))}
          </div>

          <p className="text-5xl m-4 text-slot-background">
            {!options.hardMode ? (
              <Image src={arrow} alt={""} />
            ) : currentRecipe !== undefined ? (
              <Image src={arrow} alt={""} />
            ) : (
              <Image src={arrow__no_craft} alt={""} />
            )}
          </p>

          <div className="crafting-output">
            <Slot
              item={currentRecipe}
              onClick={() => !disabled && submitRecipe()}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </>
  );
}
