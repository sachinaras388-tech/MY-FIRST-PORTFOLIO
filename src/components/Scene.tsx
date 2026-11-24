import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from "@react-three/postprocessing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useStore } from "../store";
import HeroMonolith from "./scene/HeroMonolith";
import FlightHud from "./scene/FlightHud";

gsap.registerPlugin(ScrollTrigger);

export default function Scene() {
  const isMobile = useStore((state) => state.isMobile);
  const setSceneReady = useStore((state) => state.setSceneReady);
  const setPointer = useStore((state) => state.setPointer);
  const setScrollProgress = useStore((state) => state.setScrollProgress);
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === "visible");
  const aberrationOffset = useMemo(() => new THREE.Vector2(0.001, 0.001), []);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      setPointer({
        x: event.clientX,
        y: event.clientY,
        ndcX: (event.clientX / window.innerWidth) * 2 - 1,
        ndcY: 1 - (event.clientY / window.innerHeight) * 2,
      });
    };
    window.addEventListener("pointermove", updatePointer, { passive: true });
    return () => window.removeEventListener("pointermove", updatePointer);
  }, [setPointer]);

  useEffect(() => {
    const updateProgress = (trigger: ScrollTrigger) => setScrollProgress(trigger.progress);
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: updateProgress,
      onRefresh: updateProgress,
    });
    ScrollTrigger.refresh();
    return () => trigger.kill();
  }, [setScrollProgress]);

  return (
    <div className="hero-scene fixed inset-0" aria-hidden="true">
      <Canvas
        frameloop={pageVisible ? "always" : "never"}
        dpr={isMobile ? 0.8 : 1.2}
        shadows
        camera={{ position: [0, 0, 80], fov: 35, near: 0.1, far: 140 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        onCreated={() => setSceneReady()}
      >
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <HeroMonolith />
        </Suspense>
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.8} luminanceThreshold={1.2} luminanceSmoothing={0.18} mipmapBlur />
          <Vignette eskil={false} offset={0.2} darkness={0.72} />
          <ChromaticAberration offset={aberrationOffset} radialModulation={false} modulationOffset={0} />
          <Noise opacity={0.04} />
        </EffectComposer>
      </Canvas>
      <FlightHud />
    </div>
  );
}
