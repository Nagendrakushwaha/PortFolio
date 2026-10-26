import React, { useState, useEffect, useRef } from 'react';
import { Mic, AlertTriangle, VolumeX } from 'lucide-react';

export type AssistantState =
  | 'idle'
  | 'ready'
  | 'listening'
  | 'processing'
  | 'speaking'
  | 'muted'
  | 'error';

export type VisemeType = 'rest' | 'aa' | 'ee' | 'oh' | 'oo' | 'mm';

export interface KennedyTalkingAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  state?: AssistantState;
  isSpeaking?: boolean;
  isListening?: boolean;
  isProcessing?: boolean;
  isThinking?: boolean;
  isMuted?: boolean;
  audioLevel?: number; // 0.0 to 1.0 (Real-time amplitude from speech audio)
  mouthOpen?: number; // 0.0 to 1.0 (Dynamic jaw opening)
  viseme?: VisemeType;
  className?: string;
  interactive?: boolean; // Follow mouse coordinates subtly
  showAura?: boolean;
  badge?: boolean;
}

export const KennedyTalkingAvatar: React.FC<KennedyTalkingAvatarProps> = ({
  size = 'md',
  state = 'idle',
  isSpeaking = false,
  isListening = false,
  isProcessing = false,
  isThinking = false,
  isMuted = false,
  audioLevel = 0,
  mouthOpen = 0,
  viseme = 'rest',
  className = '',
  interactive = true,
  showAura = true,
  badge = true,
}) => {
  // Determine effective state
  const effectiveState: AssistantState = isMuted
    ? 'muted'
    : isSpeaking
    ? 'speaking'
    : isProcessing || isThinking
    ? 'processing'
    : isListening
    ? 'listening'
    : state;

  // Size configurations
  const dimensions = {
    xs: { px: 32, icon: 'w-2 h-2', ring: 1.5 },
    sm: { px: 42, icon: 'w-2.5 h-2.5', ring: 2 },
    md: { px: 62, icon: 'w-3 h-3', ring: 2.5 },
    lg: { px: 92, icon: 'w-4 h-4', ring: 3 },
    xl: { px: 136, icon: 'w-5 h-5', ring: 4 },
  }[size];

  // Head and eye tracking state
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [headTilt, setHeadTilt] = useState<{ pitch: number; yaw: number; roll: number }>({ pitch: 0, yaw: 0, roll: 0 });
  const [smoothedMouth, setSmoothedMouth] = useState<number>(0);

  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // 1. Mouse movement tracking for lifelike eye direction
  useEffect(() => {
    if (!interactive || typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const nx = Math.max(-1, Math.min(1, (e.clientX - centerX) / (centerX || 1)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - centerY) / (centerY || 1)));
      setMousePos({ x: nx, y: ny });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  // 2. Natural blinking cycle
  useEffect(() => {
    let blinkTimer: ReturnType<typeof setTimeout>;

    const scheduleBlink = () => {
      const delay = 3200 + Math.random() * 3300;
      blinkTimer = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 130);
      }, delay);
    };

    scheduleBlink();
    return () => clearTimeout(blinkTimer);
  }, []);

  // 3. Animation loop: Head gestures, state postures, and strict speech synchronization
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      timeRef.current += dt;
      const t = timeRef.current;

      // STRICT MOUTH CONTROL:
      // If not speaking, mouth springs to zero immediately (no fake continuous mouth movement!)
      setSmoothedMouth((prev) => {
        if (!isSpeaking || audioLevel <= 0.01) {
          return Math.max(0, prev * 0.65 - 0.04);
        }
        const target = Math.max(0.12, Math.min(1.0, mouthOpen || audioLevel * 1.2));
        return prev + (target - prev) * 0.45;
      });

      // Kinematic Head Movement
      let targetPitch = 0;
      let targetYaw = mousePos.x * 3.5;
      let targetRoll = 0;

      if (effectiveState === 'speaking') {
        // Conversational head nods matching audio cadence
        targetPitch = Math.sin(t * 8.5) * (audioLevel * 3.8) + Math.cos(t * 3.2) * 1.5;
        targetYaw = mousePos.x * 4 + Math.sin(t * 2.5) * 2.2;
        targetRoll = Math.cos(t * 4.0) * 1.2;
      } else if (effectiveState === 'listening') {
        // Attentive listener head tilt
        targetPitch = -1.2;
        targetYaw = mousePos.x * 2.5 - 1.5;
        targetRoll = 3.6;
      } else if (effectiveState === 'processing') {
        // Reflective upward-lateral gaze
        targetPitch = -3.2;
        targetYaw = 3.0 + Math.sin(t * 3.5) * 1.2;
        targetRoll = -1.5;
      } else {
        // Idle gentle breathing sway
        targetPitch = Math.sin(t * 1.6) * 1.1;
        targetYaw = mousePos.x * 2.5;
        targetRoll = Math.cos(t * 1.2) * 0.6;
      }

      setHeadTilt((prev) => ({
        pitch: prev.pitch + (targetPitch - prev.pitch) * 0.15,
        yaw: prev.yaw + (targetYaw - prev.yaw) * 0.15,
        roll: prev.roll + (targetRoll - prev.roll) * 0.15,
      }));

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [effectiveState, isSpeaking, audioLevel, mouthOpen, mousePos]);

  // Dynamic SVG Mouth Path Calculation
  const calculateMouthPath = () => {
    const open = Math.min(1, Math.max(0, smoothedMouth));
    const jawDrop = open * 12;

    if (open < 0.05) {
      return {
        cavity: 'M 36,65 Q 50,66.5 64,65 Z',
        upperLip: 'M 36,65 Q 50,65.8 64,65',
        lowerLip: 'M 36,65 Q 50,67.2 64,65',
        teethVisible: false,
      };
    }

    switch (viseme) {
      case 'oh': {
        const rx = 10 - open * 2;
        const ry = 4 + jawDrop * 0.8;
        return {
          cavity: `M ${50 - rx},64 Q 50,${64 - ry * 0.6} ${50 + rx},64 Q 50,${64 + ry} ${50 - rx},64 Z`,
          upperLip: `M ${50 - rx},64 Q 50,${64 - ry * 0.6} ${50 + rx},64`,
          lowerLip: `M ${50 - rx},64 Q 50,${64 + ry} ${50 + rx},64`,
          teethVisible: open > 0.4,
        };
      }
      case 'ee': {
        const rx = 16 + open * 2;
        const ry = 2.5 + jawDrop * 0.45;
        return {
          cavity: `M ${50 - rx},64 Q 50,${64 - ry * 0.4} ${50 + rx},64 Q 50,${64 + ry} ${50 - rx},64 Z`,
          upperLip: `M ${50 - rx},64 Q 50,${64 - ry * 0.4} ${50 + rx},64`,
          lowerLip: `M ${50 - rx},64 Q 50,${64 + ry} ${50 - rx},64 Z`,
          teethVisible: true,
        };
      }
      case 'oo': {
        const r = 5 + open * 3;
        return {
          cavity: `M ${50 - r},65 Q 50,${65 - r * 0.7} ${50 + r},65 Q 50,${65 + r} ${50 - r},65 Z`,
          upperLip: `M ${50 - r},65 Q 50,${65 - r * 0.7} ${50 + r},65`,
          lowerLip: `M ${50 - r},65 Q 50,${65 + r} ${50 + r},65`,
          teethVisible: false,
        };
      }
      case 'mm': {
        return {
          cavity: 'M 37,65 Q 50,65.5 63,65 Z',
          upperLip: 'M 37,65 Q 50,64.8 63,65',
          lowerLip: 'M 37,65 Q 50,66.2 63,65',
          teethVisible: false,
        };
      }
      case 'aa':
      default: {
        const rx = 14 + open * 2;
        const topY = 63.5 - open * 2;
        const bottomY = 64.5 + jawDrop;
        return {
          cavity: `M ${50 - rx},63.5 Q 50,${topY} ${50 + rx},63.5 Q 50,${bottomY} ${50 - rx},63.5 Z`,
          upperLip: `M ${50 - rx},63.5 Q 50,${topY} ${50 + rx},63.5`,
          lowerLip: `M ${50 - rx},63.5 Q 50,${bottomY} ${50 + rx},63.5`,
          teethVisible: open > 0.25,
        };
      }
    }
  };

  const mouth = calculateMouthPath();

  // Eyeball gaze calculation
  const pupilOffsetX = effectiveState === 'processing' ? 1.5 : mousePos.x * 2.2;
  const pupilOffsetY = effectiveState === 'processing' ? -2.0 : mousePos.y * 1.8;

  // Eyebrow vertical shifts
  const browOffset =
    effectiveState === 'listening' ? -2.0 : effectiveState === 'processing' ? 0.8 : isSpeaking ? -audioLevel * 1.5 : 0;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: dimensions.px, height: dimensions.px }}
      title={`Mr. Kennedy AI Assistant (${effectiveState.toUpperCase()})`}
    >
      {/* 1. Dynamic Holographic Aura Rings */}
      {showAura && (
        <>
          {/* Speaking Audio Ripple Ring */}
          {effectiveState === 'speaking' && (
            <div
              className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping opacity-60 pointer-events-none"
              style={{ animationDuration: '1.4s' }}
            />
          )}

          {/* Listening Sonar Ping */}
          {effectiveState === 'listening' && (
            <>
              <div
                className="absolute -inset-1.5 rounded-full border-2 border-rose-500/70 animate-ping opacity-75 pointer-events-none"
                style={{ animationDuration: '1.2s' }}
              />
              <div className="absolute -inset-1 rounded-full bg-rose-500/20 blur-sm animate-pulse pointer-events-none" />
            </>
          )}

          {/* Processing / Thinking Synaptic Halo */}
          {effectiveState === 'processing' && (
            <div className="absolute -inset-1.5 rounded-full border border-indigo-400/60 border-t-cyan-400 border-r-purple-500 animate-spin pointer-events-none" />
          )}

          {/* Ready / Ambient Cosmic Glow */}
          {effectiveState === 'ready' && (
            <div className="absolute -inset-0.5 rounded-full bg-cyan-500/20 blur-xs animate-pulse pointer-events-none" />
          )}
        </>
      )}

      {/* 2. Main Stylized Rigged Avatar Canvas/SVG Container */}
      <div
        className="w-full h-full rounded-full p-[2px] transition-transform duration-100 ease-out flex items-center justify-center overflow-hidden relative shadow-lg"
        style={{
          background:
            effectiveState === 'listening'
              ? 'linear-gradient(135deg, #f43f5e, #ec4899, #8b5cf6)'
              : effectiveState === 'speaking'
              ? 'linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6)'
              : effectiveState === 'processing'
              ? 'linear-gradient(135deg, #6366f1, #a855f7, #06b6d4)'
              : effectiveState === 'muted'
              ? 'linear-gradient(135deg, #64748b, #475569, #334155)'
              : 'linear-gradient(135deg, #06b6d4, #4f46e5, #9333ea)',
          boxShadow:
            effectiveState === 'speaking'
              ? '0 0 18px rgba(6, 182, 212, 0.45)'
              : effectiveState === 'listening'
              ? '0 0 18px rgba(244, 63, 94, 0.45)'
              : '0 0 12px rgba(99, 102, 241, 0.3)',
        }}
      >
        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/30 via-slate-950 to-slate-950 pointer-events-none" />

          {/* Rigged Avatar Face & Head SVG */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full relative z-10 transition-transform duration-75"
            style={{
              transform: `rotate(${headTilt.roll}deg) translateY(${headTilt.pitch * 0.4}px) translateX(${headTilt.yaw * 0.3}px)`,
              transformOrigin: '50% 65%',
            }}
          >
            <defs>
              <linearGradient id="kennedyChassis" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="50%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              <linearGradient id="kennedyFaceplate" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="60%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              <linearGradient id="neonCyanGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>

              <radialGradient id="oralDepth" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#450a0a" />
                <stop offset="65%" stopColor="#180404" />
                <stop offset="100%" stopColor="#090101" />
              </radialGradient>
            </defs>

            {/* A. Cybernetic Temporal Ear Sensor Nodes (Left & Right) */}
            <g>
              <circle cx="16" cy="52" r="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
              <circle
                cx="16"
                cy="52"
                r={effectiveState === 'speaking' || effectiveState === 'listening' ? 3.5 : 2}
                fill={effectiveState === 'listening' ? '#f43f5e' : '#22d3ee'}
                className={effectiveState === 'speaking' || effectiveState === 'listening' ? 'animate-pulse' : ''}
              />
              <circle cx="84" cy="52" r="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
              <circle
                cx="84"
                cy="52"
                r={effectiveState === 'speaking' || effectiveState === 'listening' ? 3.5 : 2}
                fill={effectiveState === 'listening' ? '#f43f5e' : '#22d3ee'}
                className={effectiveState === 'speaking' || effectiveState === 'listening' ? 'animate-pulse' : ''}
              />
            </g>

            {/* B. Cranium & Upper Head Silhouette */}
            <path
              d="M 23,45 C 23,24 35,14 50,14 C 65,14 77,24 77,45 C 77,54 74,62 70,68 C 65,74 58,78 50,78 C 42,78 35,74 30,68 C 26,62 23,54 23,45 Z"
              fill="url(#kennedyChassis)"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeOpacity="0.4"
            />

            {/* C. Forehead Circuit Traces & Neural Indicator */}
            <path d="M 50,18 L 50,26 M 42,22 L 58,22" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.7" />
            <circle cx="50" cy="27" r="2.2" fill={effectiveState === 'processing' ? '#38bdf8' : '#0ea5e9'} className={effectiveState === 'processing' ? 'animate-ping' : ''} />

            {/* D. Faceplate Contour */}
            <path
              d="M 28,42 C 28,30 36,25 50,25 C 64,25 72,30 72,42 C 72,55 68,66 50,66 C 32,66 28,55 28,42 Z"
              fill="url(#kennedyFaceplate)"
              opacity="0.85"
            />

            {/* E. Eyebrows (Dynamic posture based on state) */}
            <g style={{ transform: `translateY(${browOffset}px)`, transition: 'transform 0.15s ease-out' }}>
              <path
                d={effectiveState === 'processing' ? 'M 32,37 Q 40,40 46,39' : 'M 32,38 Q 40,36 46,38'}
                stroke="#67e8f9"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d={effectiveState === 'processing' ? 'M 54,39 Q 60,40 68,37' : 'M 54,38 Q 60,36 68,38'}
                stroke="#67e8f9"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* F. Cybernetic Eyes & Blinking Eyelids */}
            <g id="eyes">
              <ellipse cx="39" cy="45" rx="7.5" ry={isBlinking ? 1 : 5} fill="#020617" stroke="#0ea5e9" strokeWidth="0.8" />
              <ellipse cx="61" cy="45" rx="7.5" ry={isBlinking ? 1 : 5} fill="#020617" stroke="#0ea5e9" strokeWidth="0.8" />

              {!isBlinking && (
                <>
                  <g style={{ transform: `translate(${pupilOffsetX}px, ${pupilOffsetY}px)` }}>
                    <circle cx="39" cy="45" r="3.6" fill="url(#neonCyanGlow)" />
                    <circle cx="39" cy="45" r="1.8" fill="#020617" />
                    <circle cx="37.8" cy="43.8" r="0.9" fill="#ffffff" />
                  </g>
                  <g style={{ transform: `translate(${pupilOffsetX}px, ${pupilOffsetY}px)` }}>
                    <circle cx="61" cy="45" r="3.6" fill="url(#neonCyanGlow)" />
                    <circle cx="61" cy="45" r="1.8" fill="#020617" />
                    <circle cx="59.8" cy="43.8" r="0.9" fill="#ffffff" />
                  </g>
                </>
              )}
            </g>

            {/* G. Nose Bridge */}
            <path d="M 50,47 L 50,54 M 48,54 L 52,54" stroke="#475569" strokeWidth="1" strokeLinecap="round" />

            {/* H. ARTICULATED JAW & LIP-SYNCHRONIZED MOUTH */}
            <g id="articulated-mouth">
              <path d={mouth.cavity} fill="url(#oralDepth)" />

              {mouth.teethVisible && (
                <path
                  d="M 40,63.2 Q 50,63.8 60,63.2 L 58.5,65.2 Q 50,65.8 41.5,65.2 Z"
                  fill="#f8fafc"
                  opacity="0.95"
                />
              )}

              {smoothedMouth > 0.45 && (
                <path
                  d={`M 42,${63.5 + smoothedMouth * 10} Q 50,${63 + smoothedMouth * 10} 58,${63.5 + smoothedMouth * 10} L 57,${62 + smoothedMouth * 10} Q 50,${61.5 + smoothedMouth * 10} 43,${62 + smoothedMouth * 10} Z`}
                  fill="#f1f5f9"
                  opacity="0.85"
                />
              )}

              <path
                d={mouth.upperLip}
                stroke="#67e8f9"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />

              <path
                d={mouth.lowerLip}
                stroke="#38bdf8"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* I. Articulated Chin */}
            <path
              d={`M 40,${74 + smoothedMouth * 4} Q 50,${78 + smoothedMouth * 5} 60,${74 + smoothedMouth * 4}`}
              stroke="#1e293b"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* 3. Live State Badge (Bottom Right Indicator) */}
      {badge && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 rounded-full ring-2 ring-slate-950 flex items-center justify-center shadow-md transition-all ${
            effectiveState === 'speaking'
              ? 'bg-cyan-400 text-slate-950 animate-pulse'
              : effectiveState === 'listening'
              ? 'bg-rose-500 text-white animate-ping'
              : effectiveState === 'processing'
              ? 'bg-indigo-500 text-white animate-spin'
              : effectiveState === 'muted'
              ? 'bg-amber-500 text-slate-950'
              : effectiveState === 'error'
              ? 'bg-rose-600 text-white'
              : 'bg-emerald-400 text-slate-950'
          }`}
          style={{
            width: Math.max(10, dimensions.px * 0.28),
            height: Math.max(10, dimensions.px * 0.28),
          }}
        >
          {effectiveState === 'listening' ? (
            <Mic className={dimensions.icon} />
          ) : effectiveState === 'muted' ? (
            <VolumeX className={dimensions.icon} />
          ) : effectiveState === 'error' ? (
            <AlertTriangle className={dimensions.icon} />
          ) : null}
        </span>
      )}
    </div>
  );
};
