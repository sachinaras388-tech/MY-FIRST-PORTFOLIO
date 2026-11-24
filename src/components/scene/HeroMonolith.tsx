import { Center, MeshTransmissionMaterial, RoundedBox, Text3D } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { site } from "../../config/site";
import { useStore } from "../../store";
import fontUrl from "three/examples/fonts/helvetiker_bold.typeface.json?url";

const INTRO_DURATION = 4.8;
const NAME_REVEAL_AT = 4.2;
const FLIGHT_POINTS: [number, number, number][] = [
  [0, 0, 80],
  [0, 0, 72],
  [-0.55, 0.12, 52],
  [0.65, 0.2, 32],
  [0.2, -0.1, 18],
  [0, 0, 12],
];
const FLIGHT_PROGRESS: [number, number][] = [
  [0, 0],
  [0.6, 0.1],
  [1.5, 0.4],
  [2.5, 0.7],
  [3.2, 0.9],
  [3.5, 0.97],
  [4.2, 1],
  [4.8, 1],
];
const FOV_KEYS: [number, number][] = [
  [0, 35],
  [0.2, 45],
  [0.6, 65],
  [3.2, 65],
  [3.5, 42],
  [4.2, 42],
  [4.8, 42],
];
const BANK_KEYS: [number, number][] = [
  [0, 0],
  [0.6, -8],
  [1.5, -8],
  [2.5, 12],
  [3.2, 1],
  [3.5, 4],
  [4.2, 0],
  [4.8, 0],
];
const PITCH_KEYS: [number, number][] = [
  [0, 0],
  [3.5, -4],
  [4.2, 0],
  [4.8, 0],
];
const BLUR_KEYS: [number, number][] = [
  [0, 0],
  [0.6, 0.2],
  [1.5, 1.4],
  [2.5, 1.6],
  [3.2, 1.2],
  [3.5, 0.7],
  [4.2, 0],
  [4.8, 0],
];

function timelineValue(time: number, keys: readonly [number, number][]) {
  for (let index = 1; index < keys.length; index += 1) {
    const [endTime, endValue] = keys[index];
    if (time <= endTime) {
      const [startTime, startValue] = keys[index - 1];
      const progress = THREE.MathUtils.smoothstep(time, startTime, endTime);
      return THREE.MathUtils.lerp(startValue, endValue, progress);
    }
  }
  return keys[keys.length - 1][1];
}

function BlueprintSliver({ visible }: { visible: boolean }) {
  return (
    <group position={[-6, 0, 46]} rotation={[0.02, -0.18, -0.04]} visible={visible}>
      <mesh>
        <planeGeometry args={[4, 5]} />
        <meshStandardMaterial
          color="#aaa9a4"
          metalness={0.78}
          roughness={0.28}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[3.8, 4.8]} />
        <meshBasicMaterial color="#111215" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.7, 0.95, 0.025]}>
        <planeGeometry args={[1.3, 0.014]} />
        <meshBasicMaterial color="#ff9a3c" />
      </mesh>
      <Center position={[0.72, 0.2, 0.04]}>
        <Text3D font={fontUrl} size={0.34} height={0.045} bevelEnabled bevelSize={0.008} bevelThickness={0.006}>
          REACT
          <meshStandardMaterial
            color="#c8c8d0"
            metalness={1}
            roughness={0.16}
            emissive="#ff9a3c"
            emissiveIntensity={0.12}
          />
        </Text3D>
      </Center>
    </group>
  );
}

function ProjectTeaser({ position, rotation = 0 }: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0.04, rotation, 0.03]}>
      <mesh>
        <planeGeometry args={[2, 1.125]} />
        <meshStandardMaterial color="#17181c" metalness={0.55} roughness={0.32} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.37, 0.04, 0.012]}>
        <planeGeometry args={[0.98, 1.04]} />
        <meshBasicMaterial color="#242a31" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-0.37, 0.04, 0.02]}>
        <planeGeometry args={[0.46, 0.64]} />
        <meshBasicMaterial color="#5c412a" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.42, 0.25, 0.015]}>
        <planeGeometry args={[0.56, 0.04]} />
        <meshBasicMaterial color="#c8c8d0" />
      </mesh>
      <mesh position={[0.42, 0.1, 0.015]}>
        <planeGeometry args={[0.42, 0.018]} />
        <meshBasicMaterial color="#77777e" />
      </mesh>
      <mesh position={[0.42, -0.28, 0.015]}>
        <planeGeometry args={[0.25, 0.018]} />
        <meshBasicMaterial color="#ff9a3c" />
      </mesh>
    </group>
  );
}

function LedgerTeaser() {
  return (
    <group position={[0, -2.7, 14]} rotation={[0.16, 0.24, -0.12]}>
      <mesh position={[-0.55, 0, 0]}>
        <planeGeometry args={[1.1, 1.5]} />
        <meshStandardMaterial color="#21150f" roughness={0.86} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.55, 0, 0]}>
        <planeGeometry args={[1.1, 1.5]} />
        <meshStandardMaterial color="#292018" roughness={0.82} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.018]}>
        <boxGeometry args={[0.045, 1.46, 0.04]} />
        <meshStandardMaterial color="#a16b37" metalness={0.7} roughness={0.38} />
      </mesh>
      {[-0.78, -0.52, 0.44, 0.7].map((x, index) => (
        <mesh key={x} position={[x, 0.18 - (index % 2) * 0.12, 0.012]}>
          <planeGeometry args={[0.42, 0.012]} />
          <meshBasicMaterial color="#b4824c" />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroMonolith() {
  const monolith = useRef<THREE.Group>(null);
  const tunnel = useRef<THREE.Group>(null);
  const tunnelMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const nameMaterial = useRef<THREE.MeshStandardMaterial>(null);
  const beaconMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const cursorLight = useRef<THREE.PointLight>(null);
  const blueprint = useRef<THREE.Group>(null);
  const projects = useRef<THREE.Group>(null);
  const ledger = useRef<THREE.Group>(null);
  const ready = useStore((state) => state.ready);
  const isMobile = useStore((state) => state.isMobile);
  const reduceMotion = useReducedMotion();
  const { camera, gl } = useThree();
  const flightCurve = useMemo(() => new THREE.CatmullRomCurve3(
    FLIGHT_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    false,
    "centripetal",
  ), []);
  const tunnelGeometry = useMemo(() => new THREE.TubeGeometry(flightCurve, 180, 4.65, 28, false), [flightCurve]);
  const ribGeometry = useMemo(() => new THREE.TorusGeometry(4.6, 0.018, 8, 64), []);
  const ribs = useMemo(() => Array.from({ length: 14 }, (_, index) => {
    const progress = 0.04 + index * 0.068;
    const position = flightCurve.getPointAt(progress);
    const tangent = flightCurve.getTangentAt(progress);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    return { position, quaternion };
  }), [flightCurve]);
  const cameraPosition = useMemo(() => new THREE.Vector3(), []);
  const cameraDirection = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointerPosition = useMemo(() => new THREE.Vector2(), []);
  const worldPoint = useMemo(() => new THREE.Vector3(), []);
  const floorPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const ribMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#8f8f95",
    metalness: 1,
    roughness: 0.2,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.48,
  }), []);
  const readyAt = useRef<number | null>(null);
  const lastProgress = useRef(-1);
  const raycastFrame = useRef(false);
  const landed = useRef(false);
  const complete = useRef(false);

  useFrame(({ clock }, delta) => {
    if (ready && readyAt.current === null) readyAt.current = clock.elapsedTime;
    const rawElapsed = readyAt.current === null ? 0 : clock.elapsedTime - readyAt.current;
    const elapsed = reduceMotion && ready ? INTRO_DURATION : Math.min(rawElapsed, INTRO_DURATION);
    const pointer = useStore.getState().pointer;
    const pathProgress = reduceMotion ? 1 : timelineValue(elapsed, FLIGHT_PROGRESS);
    flightCurve.getPointAt(pathProgress, cameraPosition);
    flightCurve.getTangentAt(pathProgress, cameraDirection);

    if (reduceMotion && ready) {
      tunnelMaterial.current && (tunnelMaterial.current.opacity = 0);
      ribMaterial.opacity = 0;
    } else {
      const tunnelFade = 1 - THREE.MathUtils.smoothstep(elapsed, 3.2, 4.05);
      tunnelMaterial.current && (tunnelMaterial.current.opacity = tunnelFade);
      ribMaterial.opacity = tunnelFade * 0.48;
    }
    if (tunnel.current) {
      const opening = reduceMotion ? 1 : THREE.MathUtils.smoothstep(elapsed, 2.1, 2.8);
      tunnel.current.scale.set(1 + opening * 0.42, 1 + opening * 0.42, 1);
    }

    camera.position.copy(cameraPosition);
    if (ready && elapsed < 0.6 && !reduceMotion) {
      const hover = 1 - THREE.MathUtils.smoothstep(elapsed, 0.35, 0.6);
      camera.position.x += Math.sin(elapsed * 8) * 0.012 * hover;
      camera.position.y += Math.cos(elapsed * 7) * 0.009 * hover;
    }
    if (ready && elapsed >= 0.2 && elapsed < 0.6 && !reduceMotion) {
      const shake = 1 - THREE.MathUtils.smoothstep(elapsed, 0.2, 0.6);
      camera.position.x += Math.sin(elapsed * 58) * 0.035 * shake;
      camera.position.y += Math.cos(elapsed * 51) * 0.026 * shake;
    }
    if (useStore.getState().introComplete && !reduceMotion) {
      camera.position.x += pointer.ndcX * 0.16;
      camera.position.y += pointer.ndcY * 0.16;
    }

    lookTarget.copy(cameraPosition).add(cameraDirection);
    camera.lookAt(lookTarget);
    const bank = reduceMotion ? 0 : timelineValue(elapsed, BANK_KEYS);
    const pitch = reduceMotion ? 0 : timelineValue(elapsed, PITCH_KEYS);
    camera.rotation.z += THREE.MathUtils.degToRad(bank);
    camera.rotation.x += THREE.MathUtils.degToRad(pitch);

    if (camera instanceof THREE.PerspectiveCamera) {
      const fov = reduceMotion ? 42 : timelineValue(elapsed, FOV_KEYS);
      if (Math.abs(camera.fov - fov) > 0.05) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    }

    const blur = reduceMotion ? 0 : timelineValue(elapsed, BLUR_KEYS);
    gl.domElement.style.filter = blur > 0.02 ? `blur(${blur.toFixed(2)}px)` : "";

    if (blueprint.current) blueprint.current.visible = !reduceMotion && elapsed >= 1.15 && elapsed <= 1.9;
    if (projects.current) projects.current.visible = !reduceMotion && elapsed >= 2.15 && elapsed <= 2.9;
    if (ledger.current) ledger.current.visible = !reduceMotion && elapsed >= 2.9 && elapsed <= 3.8;

    if (monolith.current) {
      monolith.current.rotation.y = reduceMotion ? 0 : clock.elapsedTime * THREE.MathUtils.degToRad(3);
      monolith.current.rotation.z = THREE.MathUtils.degToRad(-8);
    }
    if (nameMaterial.current) {
      const reveal = reduceMotion ? 1 : THREE.MathUtils.smoothstep(elapsed, NAME_REVEAL_AT, NAME_REVEAL_AT + 0.6);
      nameMaterial.current.opacity = reveal;
      nameMaterial.current.emissiveIntensity = 2.2 * reveal;
    }
    if (beaconMaterial.current) {
      beaconMaterial.current.opacity = 1 - THREE.MathUtils.smoothstep(elapsed, NAME_REVEAL_AT, NAME_REVEAL_AT + 0.45);
      beaconMaterial.current.transparent = true;
      beaconMaterial.current.opacity *= 0.75 + Math.sin(clock.elapsedTime * 4) * 0.2;
    }

    if (ready) {
      const progress = Math.round((elapsed / INTRO_DURATION) * 100);
      if (progress !== lastProgress.current) {
        lastProgress.current = progress;
        useStore.getState().setIntroProgress(progress);
      }
      if ((elapsed >= NAME_REVEAL_AT || reduceMotion) && !landed.current) {
        landed.current = true;
        useStore.getState().setIntroLanded();
      }
      if ((elapsed >= INTRO_DURATION || reduceMotion) && !complete.current) {
        complete.current = true;
        useStore.getState().setIntroComplete();
      }
    }

    const pointerActive = useStore.getState().introComplete && !isMobile;
    if (cursorLight.current) cursorLight.current.intensity = pointerActive ? 0.6 : 0;
    if (cursorLight.current && pointerActive && !raycastFrame.current) {
      raycastFrame.current = true;
    } else if (cursorLight.current && pointerActive) {
      raycastFrame.current = false;
      pointerPosition.set(pointer.ndcX, pointer.ndcY);
      raycaster.setFromCamera(pointerPosition, camera);
      if (raycaster.ray.intersectPlane(floorPlane, worldPoint)) {
        cursorLight.current.position.set(worldPoint.x, worldPoint.y, 3);
        useStore.getState().setWorldPoint({ x: worldPoint.x, y: worldPoint.y, z: 0 });
      }
    }
  });

  const monolithPosition: [number, number, number] = isMobile ? [0.2, 2.15, 0] : [2.35, 0, 0];
  const monolithScale = isMobile ? 0.42 : 1;

  return (
    <>
      <fogExp2 attach="fog" args={["#100b08", 0.01]} />
      <ambientLight color="#9b9998" intensity={0.18} />
      <spotLight
        color="#ff9a3c"
        intensity={3}
        position={[-4, 7, 6]}
        angle={0.48}
        penumbra={0.82}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight color="#3a6b9e" intensity={0.8} position={[1, 2, -3]} />
      <pointLight ref={cursorLight} color="#ff9a3c" intensity={0} distance={6} decay={2} />
      <group ref={tunnel}>
        <mesh geometry={tunnelGeometry}>
          <meshStandardMaterial
            ref={tunnelMaterial}
            color="#151519"
            metalness={0.92}
            roughness={0.19}
            side={THREE.BackSide}
            transparent
            opacity={1}
            depthWrite={false}
          />
        </mesh>
        {ribs.map(({ position, quaternion }, index) => (
          <mesh key={index} geometry={ribGeometry} position={position} quaternion={quaternion} material={ribMaterial} />
        ))}
      </group>
      <group ref={blueprint}>
        <BlueprintSliver visible />
      </group>
      <group ref={projects}>
        <ProjectTeaser position={[4.5, 0.35, 27.5]} rotation={-0.18} />
        <ProjectTeaser position={[6.6, 0.8, 22.5]} rotation={-0.3} />
      </group>
      <group ref={ledger}>
        <LedgerTeaser />
      </group>
      <group ref={monolith} position={monolithPosition} scale={monolithScale}>
        <RoundedBox args={[2, 7.2, 0.6]} radius={0.055} smoothness={5} castShadow receiveShadow>
          <MeshTransmissionMaterial
            color="#202026"
            metalness={1}
            roughness={0.12}
            transmission={0.04}
            thickness={0.18}
            envMapIntensity={2.2}
            chromaticAberration={0.001}
            clearcoat={0.35}
            clearcoatRoughness={0.12}
            samples={isMobile ? 2 : 4}
            resolution={isMobile ? 128 : 256}
          />
        </RoundedBox>
        <mesh position={[0, 0.1, 0.32]}>
          <sphereGeometry args={[0.055, 12, 10]} />
          <meshBasicMaterial ref={beaconMaterial} color="#ff9a3c" toneMapped={false} />
        </mesh>
        <Center position={[0, 0.1, 0.307]}>
          <Text3D
            font={fontUrl}
            size={0.24}
            height={0.015}
            curveSegments={10}
            bevelEnabled
            bevelSegments={3}
            bevelSize={0.006}
            bevelThickness={0.004}
          >
            {site.name}
            <meshStandardMaterial
              ref={nameMaterial}
              color="#21150b"
              emissive="#ff9a3c"
              emissiveIntensity={0}
              metalness={0.75}
              roughness={0.22}
              transparent
              opacity={0}
            />
          </Text3D>
        </Center>
      </group>
      <mesh position={[0, -3.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#020204" roughness={0.95} metalness={0.02} />
      </mesh>
    </>
  );
}
