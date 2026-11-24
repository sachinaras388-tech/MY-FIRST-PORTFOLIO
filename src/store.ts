import { create } from "zustand";

/** Phones/tablets & small screens get the lighter render path. */
export const detectMobile = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);

interface PointerState {
  x: number;
  y: number;
  ndcX: number;
  ndcY: number;
  worldPoint: { x: number; y: number; z: number };
}

interface State {
  isMobile: boolean;
  sceneReady: boolean; // R3F canvas mounted & first frame ready
  ready: boolean; // loader finished → trigger hero entrance animations
  introProgress: number;
  introLanded: boolean;
  introComplete: boolean;
  pointer: PointerState;
  scrollProgress: number;
  soundOn: boolean;
  setSceneReady: () => void;
  setReady: () => void;
  setIntroProgress: (progress: number) => void;
  setIntroLanded: () => void;
  setIntroComplete: () => void;
  setPointer: (pointer: Omit<PointerState, "worldPoint">) => void;
  setWorldPoint: (worldPoint: PointerState["worldPoint"]) => void;
  setScrollProgress: (progress: number) => void;
  toggleSound: () => void;
}

export const useStore = create<State>()((set) => ({
  isMobile: detectMobile(),
  sceneReady: false,
  ready: false,
  introProgress: 0,
  introLanded: false,
  introComplete: false,
  pointer: { x: 0, y: 0, ndcX: 0, ndcY: 0, worldPoint: { x: 0, y: 0, z: 0 } },
  scrollProgress: 0,
  soundOn: false, // muted by default
  setSceneReady: () => set({ sceneReady: true }),
  setReady: () => set({ ready: true }),
  setIntroProgress: (introProgress) => set({ introProgress }),
  setIntroLanded: () => set({ introLanded: true }),
  setIntroComplete: () => set({ introProgress: 100, introLanded: true, introComplete: true }),
  setPointer: (pointer) => set((state) => ({ pointer: { ...state.pointer, ...pointer } })),
  setWorldPoint: (worldPoint) => set((state) => ({ pointer: { ...state.pointer, worldPoint } })),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
}));
