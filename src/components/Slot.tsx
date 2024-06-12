import { useGlobal } from "@/context/Global/context";
import { TableItem } from "@/types";
import { ComponentProps } from "react";
import classes from "./Slot.module.css";

interface SlotProps extends ComponentProps<"div"> {
  item?: TableItem;
  slotId?: string;
  disabled?: boolean;
}

export default function Slot({
  item,
  slotId,
  disabled,
  ...props
}: SlotProps) {
  const { items, setCursorHoverItem } = useGlobal();
  const itemImage = item ? items[item]?.icon : undefined;

  const backgroundImage = itemImage
    ? { backgroundImage: `url(${itemImage})` }
    : {};

  const itemName = item ? items[item].name : null;

  return (
    <div
      className={classes.root}
      onMouseEnter={() => {
        if (!item) return;
        setCursorHoverItem(item);
      }}
      onMouseMove={() => {
        if (!item) return;
        setCursorHoverItem(item);
      }}
      onMouseLeave={() => setCursorHoverItem(null)}
      {...props}
    >
      <div
        className={classes.image}
        style={backgroundImage}
        data-slot={"slot"}
        data-slot-id={slotId}
        data-slot-disabled={disabled ? "true" : "false"}
        data-tooltip={itemName}
      />
    </div>
  );
}
