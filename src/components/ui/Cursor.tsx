import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useStore } from "../../store";

export default function Cursor() {
  const introComplete = useStore((state) => state.introComplete);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 160, damping: 24, mass: 0.45 });
  const springY = useSpring(y, { stiffness: 160, damping: 24, mass: 0.45 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    const over = (event: PointerEvent) => {
      setHovering(event.target instanceof Element && Boolean(event.target.closest("[data-cursor], a, button")));
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [x, y]);

  if (!enabled || !introComplete) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[120] h-[6px] w-[6px] -ml-[3px] -mt-[3px] rounded-full bg-[#ff9a3c]"
        style={{ x, y, mixBlendMode: "screen", boxShadow: "0 0 14px 2px rgba(255,154,60,.55)" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[119] -ml-[22px] -mt-[22px] h-11 w-11 rounded-full border"
        style={{ x: springX, y: springY, mixBlendMode: "screen" }}
        animate={{
          scale: hovering ? 1 : 0.72,
          opacity: hovering ? 0.9 : 0.24,
          borderColor: hovering ? "rgba(255,154,60,.82)" : "rgba(255,154,60,.42)",
        }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
      />
    </>
  );
}
