import { useGlobal } from "@/context/Global/context";
import { useEffect, useState } from "react";

export default function Tooltip() {
  const { cursorHoverItem, cursorItem } = useGlobal();

  const [cursorPosition, setCursorPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (document) {
      document.addEventListener("mousemove", (e) => {
        setCursorPosition({ left: e.pageX + 10, top: e.pageY - 30 });
      });
    }
    return document.removeEventListener("mousemove", (e) => {});
  }, []);

  if ( !cursorHoverItem || cursorItem ) return null;

  return (
    <div
      className={"tooltip"}
      style={{
        ...cursorPosition,
      }}
    >
      {cursorHoverItem}
    </div>
  );
}