import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  color: string;
}

interface ClickRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export const CosmicCursorSystem: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);

  // High-frequency positions via refs
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const lastMousePos = useRef({ x: -100, y: -100 });
  const mouseVelocity = useRef(0);
  const isHoveringInteractive = useRef<'none' | 'button' | 'card' | 'text'>('none');
  const isMouseDown = useRef(false);

  // Particle pools
  const particles = useRef<TrailParticle[]>([]);
  const ripples = useRef<ClickRipple[]>([]);

  useEffect(() => {
    // Detect touch / coarse pointer devices
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse || 'ontouchstart' in window) {
      setIsTouchDevice(true);
      return; // Do not initialize custom cursor on touch devices
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle canvas sizing
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const cosmicColors = ['#22d3ee', '#38bdf8', '#818cf8', '#a855f7', '#e0f2fe'];

    // Mouse movement listener
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const dx = x - lastMousePos.current.x;
      const dy = y - lastMousePos.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      mouseVelocity.current = speed;

      mousePos.current.x = x;
      mousePos.current.y = y;

      // Update immediate dot position directly for instantaneous responsiveness
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
      }

      // Check hovered element for context awareness
      const target = e.target as HTMLElement | null;
      if (target) {
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.getAttribute('data-cursor') === 'text'
        ) {
          isHoveringInteractive.current = 'text';
        } else if (
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.getAttribute('data-cursor') === 'button'
        ) {
          isHoveringInteractive.current = 'button';
        } else if (
          target.closest('.glass-card') ||
          target.closest('.project-card') ||
          target.closest('[data-cursor="card"]')
        ) {
          isHoveringInteractive.current = 'card';
        } else {
          isHoveringInteractive.current = 'none';
        }
      }

      // Spawn trail particles based on movement velocity
      if (!prefersReducedMotion && speed > 2.5 && particles.current.length < 40) {
        const count = speed > 18 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          particles.current.push({
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            vx: -dx * 0.08 + (Math.random() - 0.5) * 1.2,
            vy: -dy * 0.08 + (Math.random() - 0.5) * 1.2,
            radius: Math.random() * 2.2 + 0.8,
            alpha: 0.85,
            decay: Math.random() * 0.035 + 0.02,
            color: cosmicColors[Math.floor(Math.random() * cosmicColors.length)],
          });
        }
      }

      lastMousePos.current.x = x;
      lastMousePos.current.y = y;
    };

    // Click / MouseDown interaction
    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown.current = true;
      const { clientX: x, clientY: y } = e;

      // Create expanding cosmic ripple
      ripples.current.push({
        x,
        y,
        radius: 4,
        maxRadius: 36,
        alpha: 0.8,
        color: '#22d3ee',
      });

      // Small burst of cosmic sparks
      if (!prefersReducedMotion) {
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.2;
          const force = Math.random() * 3.5 + 2.0;
          particles.current.push({
            x,
            y,
            vx: Math.cos(angle) * force,
            vy: Math.sin(angle) * force,
            radius: Math.random() * 2.5 + 1.2,
            alpha: 1.0,
            decay: 0.045,
            color: cosmicColors[i % cosmicColors.length],
          });
        }
      }
    };

    const handleMouseUp = () => {
      isMouseDown.current = false;
    };

    const handleMouseLeave = () => {
      mousePos.current.x = -100;
      mousePos.current.y = -100;
      if (cursorDotRef.current) {
        cursorDotRef.current.style.opacity = '0';
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.opacity = '0';
      }
    };

    const handleMouseEnter = () => {
      if (cursorDotRef.current) {
        cursorDotRef.current.style.opacity = '1';
      }
      if (cursorRingRef.current) {
        cursorRingRef.current.style.opacity = '1';
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Render loop
    let animId: number;
    const render = () => {
      animId = requestAnimationFrame(render);

      // Smooth lerp for outer cursor ring
      const lerpFactor = 0.22;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;

      if (cursorRingRef.current) {
        const mode = isHoveringInteractive.current;
        let ringSize = 34;
        let scale = 1;
        let borderColor = 'rgba(34, 211, 238, 0.45)';
        let bgColor = 'rgba(6, 182, 212, 0.04)';

        if (mode === 'text') {
          // Subtle thin indicator for text selection
          cursorRingRef.current.style.opacity = '0.2';
          scale = 0.5;
        } else {
          cursorRingRef.current.style.opacity = '1';
          if (mode === 'button') {
            ringSize = 48;
            scale = isMouseDown.current ? 0.9 : 1.25;
            borderColor = 'rgba(56, 189, 248, 0.9)';
            bgColor = 'rgba(56, 189, 248, 0.16)';
          } else if (mode === 'card') {
            ringSize = 42;
            scale = 1.1;
            borderColor = 'rgba(168, 85, 247, 0.6)';
            bgColor = 'rgba(168, 85, 247, 0.08)';
          } else if (isMouseDown.current) {
            scale = 0.8;
          }
        }

        const offset = ringSize / 2;
        cursorRingRef.current.style.width = `${ringSize}px`;
        cursorRingRef.current.style.height = `${ringSize}px`;
        cursorRingRef.current.style.borderColor = borderColor;
        cursorRingRef.current.style.backgroundColor = bgColor;
        cursorRingRef.current.style.transform = `translate3d(${ringPos.current.x - offset}px, ${
          ringPos.current.y - offset
        }px, 0) scale(${scale})`;
      }

      // Draw particle trails and ripples on 2D canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update & render ripples
      for (let i = ripples.current.length - 1; i >= 0; i--) {
        const rip = ripples.current[i];
        rip.radius += 2.2;
        rip.alpha -= 0.045;

        if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
          ripples.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(34, 211, 238, ${rip.alpha})`;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = 'rgba(34, 211, 238, 0.8)';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      }

      // Update & render particle trails
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [prefersReducedMotion]);

  if (isTouchDevice) {
    return null;
  }

  return (
    <>
      {/* 2D Canvas for Particle Trails and Click Ripples */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Immediate Central Cyan/Blue Point with Inner Glow */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee,0_0_18px_#38bdf8] pointer-events-none z-50 transition-opacity duration-200"
        style={{ willChange: 'transform' }}
      />

      {/* Smooth Trailing Outer Glow Ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 rounded-full border border-cyan-400/40 pointer-events-none z-50 transition-all duration-150 ease-out shadow-[0_0_16px_rgba(6,182,212,0.25)]"
        style={{ willChange: 'transform, width, height, border-color, background-color' }}
      />
    </>
  );
};

