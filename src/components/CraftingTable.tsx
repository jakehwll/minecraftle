import { COLORS, HICONTRAST_COLORS } from "@/constants";
import { useGlobal } from "@/context/Global/context";
import { ColorTable } from "@/types";
import { MouseEventHandler, useEffect, useState } from "react";
import Slot from "./Slot";
import classes from "./CraftingTable.module.css";
import cc from "classcat";

export default function CraftingTable({
  solved = false,
  tableNum = 0,
  active = true,
}: {
  solved?: boolean;
  tableNum?: number;
  active?: boolean;
}) {
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
    options: { highContrast },
    checkAllVariants,
  } = useGlobal();

  const [currentRecipe, setCurrentRecipe] = useState<string | undefined>();

  const colorTable = solved
    ? [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
      ]
    : colorTables[tableNum];
  const currentTable = solved
    ? remainingSolutionVariants[0]
    : craftingTables[tableNum];

  const { SUCCESS_COLOR, NEAR_SUCCESS_COLOR } = highContrast
    ? HICONTRAST_COLORS
    : COLORS;

  const COLOR_MAP: { [key: number]: string | undefined } = {
    0: undefined,
    2: SUCCESS_COLOR,
    3: NEAR_SUCCESS_COLOR,
  };

  useEffect(() => {
    if (currentTable) {
      for (let row of currentTable) {
        for (let item of row) {
          if (item) {
            return;
          }
        }
      }
    }
    setCurrentRecipe(undefined);
  }, [craftingTables]);

  const setColorTable = (t: ColorTable) => {
    setColorTables((o) => {
      let n = [...o];
      n[tableNum] = t;
      return n;
    });
  };

  const processGuess = () => {
    if (solved) return;

    if (
      currentRecipe?.replace("minecraft:", "") ===
      recipes[solution].output.replace("minecraft:", "")
    ) {
      setColorTable([
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2],
      ]);
      setTimeout(() => {
        setGameState("won");
      }, 1000);
      return;
    }

    // is wrong, trim the remaining solution variants
    const correctSlots = trimVariants(currentTable);

    // update colors based on matchmap
    setColorTable(correctSlots);

    if (craftingTables.length < 10) {
      setCraftingTables((old) => {
        const newCraftingTables = [...old];
        newCraftingTables.push([
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ]);
        return newCraftingTables;
      });
      setColorTables((old) => {
        const newColorTables = [...old];
        newColorTables.push([
          [undefined, undefined, undefined],
          [undefined, undefined, undefined],
          [undefined, undefined, undefined],
        ]);
        return newColorTables;
      });
    } else {
      setTimeout(() => {
        setGameState("lost");
      }, 1000);
    }
  };

  useEffect(() => {
    const callback = (ev: MouseEvent) => {
      if (ev.target !== null) {
        const target = ev.target as HTMLElement;
        target.getAttribute("data-slot") === "slot" && ev.preventDefault();
      }
    };
    document.addEventListener("contextmenu", callback);
    return () => document.removeEventListener("contextmenu", callback);
  });

  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const mouseDownCallback = (ev: MouseEvent) => {
      if (ev.which !== 3) return;
      setDragging(true);
    };
    const mouseUpCallback = (ev: MouseEvent) => {
      if (ev.which !== 3) return;
      setDragging(false);
    };
    document.addEventListener("mousedown", mouseDownCallback);
    document.addEventListener("mouseup", mouseUpCallback);
    return () => {
      document.removeEventListener("mousedown", mouseDownCallback);
      document.removeEventListener("mouseup", mouseUpCallback);
    };
  }, []);

  useEffect(() => {
    const mouseDownCallback = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement;
      if (ev.which === 1) {
        if (target.getAttribute("data-slot-id") === null) return;
        const [tableNum, rowIndex, columnIndex] = target
          .getAttribute("data-slot-id")!
          .split("-")
          .map(Number);
        if (cursorItem !== null) {
          setCraftingTables((old) => {
            const newCraftingTables = [...old];
            newCraftingTables[tableNum][rowIndex][columnIndex] = cursorItem;
            return newCraftingTables;
          });
          setCursorItem(null);
        } else {
          if ( craftingTables[tableNum][rowIndex][columnIndex] === null ) return;
          setCursorItem(craftingTables[tableNum][rowIndex][columnIndex]);
          setCraftingTables((old) => {
            const newCraftingTables = [...old];
            newCraftingTables[tableNum][rowIndex][columnIndex] = null;
            return newCraftingTables;
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

  useEffect(() => {
    const result = checkAllVariants(currentTable);
    setCurrentRecipe(result);
  }, [craftingTables]);

  return (
    <>
      <div
        className={cc([
          "flex box justify-between items-center w-[22rem]",
          classes.root,
        ])}
      >
        <div className="w-36 h-36 flex flex-wrap">
          {currentTable.map((row, rowIndex) => (
            <div className="flex" key={rowIndex}>
              {row.map((item, columnIndex) => (
                <Slot
                  key={`${rowIndex}-${columnIndex}`}
                  item={item}
                  style={{
                    backgroundColor:
                      COLOR_MAP[colorTable[rowIndex][columnIndex] ?? 0],
                  }}
                  onContextMenu={(event) => {
                    event.preventDefault();
                  }}
                  moreProps={{
                    "data-slot-id": `${tableNum}-${rowIndex}-${columnIndex}`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>

        <p className="text-5xl m-4 text-slot-background">→</p>
        <div className="crafting-output">
          <Slot
            item={solved ? recipes[solution].output : currentRecipe}
            onClick={() => processGuess()}
          />
        </div>
      </div>
    </>
  );
}
