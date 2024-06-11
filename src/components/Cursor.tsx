import classes from "./Cursor.module.css";
import { useGlobal } from "@/context/Global/context";
import { useEffect, useState } from "react";

export default function Cursor() {
  const { items, cursorItem } = useGlobal();
  const [cursorPosition, setCursorPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (document) {
      document.addEventListener("mousemove", (e) => {
        setCursorPosition({ left: e.pageX - 5, top: e.pageY - 5 });
      });
    }
    return document.removeEventListener("mousemove", (e) => {});
  }, []);

  const backgroundItem = cursorItem ? `url(${cursorItem && items[cursorItem].icon})` : undefined;

  return (
    <div
      className={classes.root}
      style={{
        ...cursorPosition,
        backgroundImage: backgroundItem,
      }}
    />
  );
}
