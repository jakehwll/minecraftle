import classes from "./Cursor.module.css";
import { useGlobal } from "@/context/Global/context";
import useMouse from "@/hooks/useMouse";

export default function Cursor() {
  const { items, cursorItem } = useGlobal();
  const { x, y } = useMouse();

  const backgroundItem = cursorItem ? `url(${cursorItem && items[cursorItem].icon})` : undefined;

  return (
    <div
      className={classes.root}
      style={{
        left: x - 5,
        top: y - 5,
        backgroundImage: backgroundItem,
      }}
    />
  );
}
