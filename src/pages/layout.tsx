import Button from "@/components/Button";
import Tooltip from "@/components/Tooltip";
import { useGlobal } from "@/context/Global/context";
import Link from "next/link";
import { useEffect } from "react";
import Image from "next/image";
import minecraftle_logo from "../../public/minecraftle_logo.png";
import useGameOptions from "@/hooks/useGameOptions";

export default function Layout({ children }: {
  children?: React.ReactNode;
}) {
  const { setCursorItem, resetGame } = useGlobal();
  
  const { highContrast, setHighContrast, hardMode, setHardMode } = useGameOptions();

  useEffect(() => {
    const callback = (ev: MouseEvent) => {
      if ( ev.target !== null ) {
        const target = ev.target as HTMLElement;
        target.getAttribute("data-slot") !== "slot" && setCursorItem(null);
      }
    }
    document.addEventListener("click", callback);
    return () => document.removeEventListener("click", callback);
  })

  return (
    <div>
      <div className="flex flex-col gap-4 max-w-xl m-auto">
        <header className={"flex flex-col gap-4"}>
          <div className={"flex items-center justify-center"}>
            <Image
              src={minecraftle_logo}
              alt="Minecraftle Logo"
              className={"w-96"}
            />
          </div>
          <Tooltip />
          <nav>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              <Link href="/how-to-play" className={"col-span-2"}>
                <Button className="flex-1">How To Play</Button>
              </Link>
              <Link href="/">
                <Button onClick={() => resetGame(false)}>Daily</Button>
              </Link>
              <Link href="/?random=true">
                <Button className="flex-1">
                  Random
                </Button>
              </Link>
              <Button
                onClick={() => setHighContrast(!highContrast)}
                data-tooltip="Increases contrast for better visibility."
              >
                High Contrast: {highContrast ? "ON" : "OFF"}
              </Button>
              <Button
                onClick={() => setHardMode(!hardMode)}
                data-tooltip="You have to craft a valid recipe."
              >
                Hard Mode: {hardMode ? "ON" : "OFF"}
              </Button>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className={"text-sm text-center"}>
          <p>Not an official Minecraft website.</p>
          <p>Minecraftle is not associated with Mojang AB or Microsoft.</p>
        </footer>
      </div>
    </div>
  );
}
