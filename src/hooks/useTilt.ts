import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface TiltOptions {
  maxTilt?: number; // Maximum tilt angle in degrees (default: 8)
  scale?: number; // Scale factor on hover (default: 1.02)
  perspective?: number; // 3D Perspective in px (default: 1000)
  magnetic?: boolean; // Pull toward cursor (default: false)
  magneticForce?: number; // Magnetic strength (default: 0.15)
}

export function useTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const {
    maxTilt = 8,
    scale = 1.02,
    perspective = 1000,
    magnetic = false,
    magneticForce = 0.15,
  } = options;

  const ref = useRef<T | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el || prefersReducedMotion) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const normX = (x - centerX) / centerX;
      const normY = (y - centerY) / centerY;

      const rotateX = -normY * maxTilt;
      const rotateY = normX * maxTilt;

      let transX = 0;
      let transY = 0;
      if (magnetic) {
        transX = (x - centerX) * magneticForce;
        transY = (y - centerY) * magneticForce;
      }

      el.style.transform = `perspective(${perspective}px) translate3d(${transX.toFixed(
        1
      )}px, ${transY.toFixed(1)}px, 0) rotateX(${rotateX.toFixed(
        2
      )}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, 1)`;
    },
    [magnetic, magneticForce, maxTilt, perspective, prefersReducedMotion, scale]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(${perspective}px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }, [perspective]);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    el.style.transition = 'transform 0.18s cubic-bezier(0.2, 0.8, 0.4, 1)';
    el.style.transformStyle = 'preserve-3d';

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, prefersReducedMotion]);

  return ref;
}

