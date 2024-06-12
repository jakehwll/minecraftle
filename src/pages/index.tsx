import CraftingTable from "@/components/CraftingTable";
import Cursor from "@/components/Cursor";
import Inventory from "@/components/Inventory";
import LoadingSpinner from "@/components/LoadingSpinner";
import MCButton from "@/components/Button";
import Popup from "@/components/Popup";
import { useGlobal } from "@/context/Global/context";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

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
      className={`flex max-w-lg flex-col items-center m-auto`}
    >
      <Cursor />

      {Object.keys(recipes).length > 0 && Object.keys(items).length > 0 ? (
        <div className="guesses" id="guesses">
          {craftingTables.map((table, index) => (
            <CraftingTable
              key={index}
              tableNum={index}
              disabled={
                gameState !== "inprogress" ||
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
      {gameState !== "inprogress" && (
        <MCButton onClick={() => setPopupVisible(true)}>Show Summary</MCButton>
      )}
    </div>
  );
}
