import { useGlobal } from "@/context/Global/context";
import { TableItem } from "@/types";
import { ComponentProps } from "react";

interface SlotProps extends ComponentProps<"div"> {
  item?: TableItem;
}

export default function Slot({
  item,
  ...props
}: SlotProps) {
  const { items, setCursorHoverItem } = useGlobal();
  const itemImage = item ? items[item]?.icon : undefined;

  const backgroundImage = itemImage
    ? { backgroundImage: `url(${itemImage})` }
    : {};

  return (
    <div
      className="slot"
      onMouseEnter={() => {
        if ( !item ) return
        setCursorHoverItem(item);
      }}
      onMouseLeave={() => setCursorHoverItem(null)}
      {...props}
    >
      <div className="slot-image" style={backgroundImage} data-slot={"slot"} />
    </div>
  );
}
