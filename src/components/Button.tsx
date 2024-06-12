import cc from "classcat";
import classes from "./Button.module.css";
import { ComponentProps } from "react";

export default function Button({
  onClick,
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  const onClickWithSound = (event: React.MouseEvent<HTMLDivElement>) => {
    const audioToPlay = new Audio("/audio/button_click.wav");
    audioToPlay.play();
    if (onClick) onClick(event);
  };
  return (
    <div
      className={cc([classes.root, "hover:cursor-pointer", className])}
      onClick={(event) => onClickWithSound(event)}
    >
      <div className={classes.title} {...props}>
        {children}
      </div>
    </div>
  );
}
