import CraftingTable from "@/components/CraftingTable";
import Cursor from "@/components/Cursor";
import Inventory from "@/components/Inventory";
import LoadingSpinner from "@/components/LoadingSpinner";
import Button from "@/components/Button";
import Popup from "@/components/Popup";
import { useGlobal } from "@/context/Global/context";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { GameState } from "@/types";

export default function Home() {
  const router = useRouter();
  const { random } = router.query;
  const {
    craftingTables,
    gameState,
    resetGame,
    recipes,
    gameDate,
    items,
  } = useGlobal();
  const [popupVisible, setPopupVisible] = useState(false);

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    divRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [craftingTables.length]);

  useEffect(() => {
    if (random) {
      resetGame(true);
      setPopupVisible(false);
    }
  }, [random]);

  return (
    <div
      className={`max-w-lg items-center m-auto flex flex-col gap-4`}
    >
      <Cursor />

      {Object.keys(recipes).length > 0 && Object.keys(items).length > 0 ? (
        <div className={"flex flex-col gap-2"}>
          {craftingTables.map((table, index) => (
            <CraftingTable
              key={index}
              tableNum={index}
              disabled={
                gameState !== GameState.InProgress ||
                index !== craftingTables.length - 1
              }
            />
          ))}
        </div>
      ) : (
        <div className="box inv-background">
          <LoadingSpinner />
        </div>
      )}

      <Inventory guessCount={craftingTables.length} />
      
      <div ref={divRef}></div>

      {popupVisible && (
        <Popup
          isRandom={!!random}
          isOpen={popupVisible}
          closeModal={() => {
            setPopupVisible(false);
          }}
        />
      )}
      {gameState !== GameState.InProgress && (
        <Button onClick={() => setPopupVisible(true)}>Show Summary</Button>
      )}
    </div>
  );
}
