import { useGlobal } from "@/context/Global/context";
import classes from "./Tooltip.module.css";
import useMouse from "@/hooks/useMouse";

export default function Tooltip() {
  const { cursorHoverItem, cursorItem } = useGlobal();
  const { x, y } = useMouse()

  if ( !cursorHoverItem || cursorItem ) return null;

  return (
    <div
      className={classes.root}
      style={{
        left: x + 10,
        top: y - 30,
      }}
    >
      {cursorHoverItem}
    </div>
  );
}