import MCButton from "@/components/Button";
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
  
  const { highContrast, setHighContrast } = useGameOptions();

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
              <Link href="/how-to-play">
                <MCButton className="flex-1">How To Play</MCButton>
              </Link>
              <Link href="/">
                <MCButton onClick={() => resetGame(false)}>Daily</MCButton>
              </Link>
              <Link href="/?random=true">
                <MCButton className="flex-1" onClick={() => resetGame(true)}>
                  Random
                </MCButton>
              </Link>
              <MCButton
                onClick={() => setHighContrast(!highContrast)}
              >
                High Contrast: {highContrast ? "ON" : "OFF"}
              </MCButton>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
