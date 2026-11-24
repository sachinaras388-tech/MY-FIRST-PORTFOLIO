import { motion } from "framer-motion";
import { useStore } from "../../store";

export default function FlightHud() {
  const ready = useStore((state) => state.ready);
  const progress = useStore((state) => state.introProgress);
  const introLanded = useStore((state) => state.introLanded);
  const altitude = Math.max(0, 8 - Math.round((progress / 100) * 8));
  const speed = Math.round(99 * Math.sin((progress / 100) * Math.PI));

  return (
    <motion.div
      className="flight-hud"
      aria-hidden="true"
      initial={{ opacity: 0, y: 5 }}
      style={{ transformOrigin: "left center" }}
      animate={{
        opacity: ready && !introLanded ? 1 : 0,
        y: ready && !introLanded ? 0 : 3,
        scaleX: ready && !introLanded ? 1 : 0.015,
      }}
      transition={{ duration: introLanded ? 0.55 : 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <span>SYS BOOT</span>
      <i>·</i>
      <span>{String(progress).padStart(3, "0")}%</span>
      <i>·</i>
      <span>ALT {String(altitude).padStart(2, "0")}</span>
      <i>·</i>
      <span>SPD {String(speed).padStart(2, "0")}</span>
    </motion.div>
  );
}
