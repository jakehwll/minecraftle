import { useGlobal } from "@/context/Global/context";
import classes from "./Tooltip.module.css";
import useMouse from "@/hooks/useMouse";

export default function Tooltip() {
  const { cursorHoverItem, cursorItem, items } = useGlobal();
  const { x, y } = useMouse()

  if ( !cursorHoverItem || cursorItem ) return null;

  const itemName = items[cursorHoverItem]?.name;

  return (
    <div
      className={classes.root}
      style={{
        left: x + 10,
        top: y - 30,
      }}
    >
      {itemName}
    </div>
  );
}