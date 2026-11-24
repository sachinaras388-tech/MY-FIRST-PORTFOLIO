import { motion, useScroll, useSpring } from "framer-motion";

/** Thin glowing scroll progress bar at the top of the page. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed left-0 top-0 z-[90] h-[2px] w-full origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg,#626269,#d9d9df,#85858d)",
        boxShadow: "0 0 10px rgba(200,200,208,.26)",
      }}
    />
  );
}
