import { useEffect, useState } from "react";

const useTooltip = () => {
  const [value, setValue] = useState<string>("test");

  useEffect(() => {
    const callback = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement;
      const value = target.getAttribute("data-tooltip");
      setValue(value || "");
    }
    window.addEventListener("mousemove", callback);
    return () => {
      window.removeEventListener("mousemove", callback);
    }
      
  }, []);

  return {
    value,
    setValue,
  };
};

export default useTooltip;
