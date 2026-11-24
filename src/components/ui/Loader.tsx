import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useProgress } from "@react-three/drei";
import { useStore } from "../../store";

const DURATION = 900;

/** The amber beacon dissolves into the FPV arrival once the scene is ready. */
export default function Loader() {
  const sceneReady = useStore((s) => s.sceneReady);
  const setReady = useStore((s) => s.setReady);
  const reduceMotion = useReducedMotion();
  const { progress: assetProgress } = useProgress(); // real asset progress (0-100)

  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);

  // Refs let the rAF loop read fresh values without restarting
  const sceneRef = useRef(sceneReady);
  const assetRef = useRef(assetProgress);
  sceneRef.current = sceneReady;
  assetRef.current = assetProgress;

  useEffect(() => {
    if (reduceMotion) {
      setReady();
      setGone(true);
      return;
    }

    const start = performance.now();
    let raf = 0;
    let finished = false;
    const loop = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const sim = 1 - Math.pow(1 - t, 3); // ease-out
      let target = Math.max(sim, assetRef.current / 100);
      if (!sceneRef.current) target = Math.min(target, 0.95); // wait for the canvas
      if (target >= 1 && !finished) {
        finished = true;
        setTimeout(() => {
          setReady(); // release the page entrance animation
          setExiting(true);
        }, 180);
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion, setReady]);

  if (gone) return null;

  return (
    <motion.div
      className="hero-loader fixed inset-0 z-[100] grid place-items-center"
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      onAnimationComplete={() => exiting && setGone(true)}
    >
      <motion.div
        className="loader-amber-dot"
        initial={{ scale: 0, opacity: 0 }}
        animate={exiting
          ? { scale: 0.2, opacity: 0 }
          : { scale: [0.82, 1.08, 0.92, 0.82], opacity: [0.68, 1, 0.78, 0.68] }}
        transition={exiting
          ? { duration: 0.5, ease: [0.65, 0, 0.84, 0] }
          : { duration: 2.8, repeat: Infinity, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}
