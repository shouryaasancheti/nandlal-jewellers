"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface HeroMistCanvasProps {
  dark: boolean;
}

export function HeroMistCanvas({ dark }: HeroMistCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const darkUniformRef = useRef<{ value: number }>({ value: dark ? 1 : 0 });

  useEffect(() => {
    darkUniformRef.current.value = dark ? 1.0 : 0.0;
  }, [dark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isLowPower =
      typeof navigator !== "undefined" &&
      ((navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        // @ts-expect-error deviceMemory is non-standard
        (navigator.deviceMemory && navigator.deviceMemory <= 4));

    if (reducedMotion || isLowPower) return;

    let rafId = 0;
    let renderer: THREE.WebGLRenderer | null = null;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const uniforms = {
        uTime: { value: 0 },
        uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uDark: darkUniformRef.current,
      };

      const material = new THREE.ShaderMaterial({
        transparent: true,
        uniforms,
        vertexShader: `void main() { gl_Position = vec4(position, 1.0); }`,
        fragmentShader: `
          uniform float uTime;
          uniform vec2 uRes;
          uniform float uDark;
          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
          float noise(vec2 p) {
            vec2 i = floor(p); vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                       mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
          }
          float fbm(vec2 p) {
            float v = 0.0; float a = 0.5;
            for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
            return v;
          }
          void main() {
            vec2 uv = gl_FragCoord.xy / uRes.xy;
            float t = uTime * 0.045;
            float n1 = fbm(uv * 2.4 + vec2(t, t * 0.4));
            float n2 = fbm(uv * 3.8 - vec2(t * 0.7, -t * 0.3));
            float cloud = smoothstep(0.28, 0.85, n1 * 0.65 + n2 * 0.45);
            vec3 lightCol = mix(vec3(0.91, 0.89, 0.85), vec3(0.99, 0.98, 0.95), cloud);
            vec3 darkCol = mix(vec3(0.05, 0.05, 0.05), vec3(0.16, 0.14, 0.10), cloud);
            vec3 col = mix(lightCol, darkCol, uDark);
            float alpha = mix(cloud * 0.46, cloud * 0.28, uDark);
            gl_FragColor = vec4(col, alpha);
          }
        `,
      });

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
      scene.add(mesh);

      const onResize = () => {
        if (!renderer) return;
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      const clock = new THREE.Clock();
      const render = () => {
        uniforms.uTime.value = clock.getElapsedTime();
        renderer?.render(scene, camera);
        rafId = requestAnimationFrame(render);
      };
      render();

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", onResize);
        material.dispose();
        mesh.geometry.dispose();
        renderer?.dispose();
      };
    } catch {
      return undefined;
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-90"
    />
  );
}
