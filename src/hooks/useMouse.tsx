import { useEffect, useState } from "react";

const useMouse = () => {
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const updateMouse = (e: MouseEvent) => {
        setMouse({ x: e.clientX, y: e.clientY });
    };
    useEffect(() => {
        window.addEventListener("mousemove", updateMouse);
        return () => {
        window.removeEventListener("mousemove", updateMouse);
        };
    }, []);
    return mouse;
}

export default useMouse;