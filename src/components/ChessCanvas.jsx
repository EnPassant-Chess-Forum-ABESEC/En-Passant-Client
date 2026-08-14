"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Center } from "@react-three/drei";

function ChessPieceModel({ scrollYProgress }) {
  const { scene } = useGLTF("/king.glb");
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      // Map scroll progress (0 to 1) to rotation.
      modelRef.current.rotation.y = scrollYProgress.get() * Math.PI * 4;
    }
  });

  return (
    <Center position={[0, 0, 0]}>
      <primitive ref={modelRef} object={scene} scale={5.5} />
    </Center>
  );
}

export default function ChessCanvas({ scrollYProgress }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <Suspense fallback={null}>
        <Environment preset="night" />
        <ChessPieceModel scrollYProgress={scrollYProgress} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/king.glb");
