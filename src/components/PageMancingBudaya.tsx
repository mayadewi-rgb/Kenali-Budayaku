import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  X,
  RotateCcw,
  ArrowRight,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import { MANCING_QUESTIONS, FishQuestion } from '../data/mancingBudayaData';
import { sounds } from '../utils/audio';
import underwaterBg from '../assets/images/underwater_sea_reef_1790432730813.jpg';

interface PageMancingBudayaProps {
  onBack: () => void;
  onNext: () => void;
}

// 4 Option fish swimming in the water
interface OptionFishState {
  label: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
  x: number; // percentage (10% to 90%)
  y: number; // percentage (28% to 78%)
  baseY: number;
  direction: 1 | -1; // 1 = moving right, -1 = moving left
  speed: number;
  color: string;
  badgeBg: string;
  icon: string;
  sinePhase: number;
}

const FISH_THEMES = [
  {
    color: '#F59E0B',
    badgeBg: 'bg-amber-500',
    icon: '🐠',
    border: 'border-amber-300',
  },
  {
    color: '#06B6D4',
    badgeBg: 'bg-cyan-500',
    icon: '🐟',
    border: 'border-cyan-300',
  },
  {
    color: '#10B981',
    badgeBg: 'bg-emerald-500',
    icon: '🐡',
    border: 'border-emerald-300',
  },
  {
    color: '#EC4899',
    badgeBg: 'bg-pink-500',
    icon: '🦈',
    border: 'border-pink-300',
  },
];

export const PageMancingBudaya: React.FC<PageMancingBudayaProps> = ({
  onBack,
  onNext,
}) => {
  // Current question index (0 to 7 -> 8 questions)
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const activeQ: FishQuestion = MANCING_QUESTIONS[questionIndex] || MANCING_QUESTIONS[0];

  // Team scores
  const [scoreTeam1, setScoreTeam1] = useState<number>(0);
  const [scoreTeam2, setScoreTeam2] = useState<number>(0);

  // Sound toggle state
  const [soundOn, setSoundOn] = useState<boolean>(sounds.enabled);

  // Pause menu modal
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Catch outcome toast/modal: 'playing' | 'caught' | 'completed'
  const [gameState, setGameState] = useState<'playing' | 'caught' | 'completed'>('playing');

  // Caught details
  const [catchResult, setCatchResult] = useState<{
    team: 1 | 2;
    chosenLabel: string;
    chosenText: string;
    isCorrect: boolean;
    pointsEarned: number;
  } | null>(null);

  // Hook 1 (Kelompok 1 - Blue) & Hook 2 (Kelompok 2 - Orange) positions (in percentage of full screen)
  const [hook1, setHook1] = useState<{ x: number; y: number }>({ x: 25, y: 52 });
  const [hook2, setHook2] = useState<{ x: number; y: number }>({ x: 75, y: 52 });

  const hook1Ref = useRef<{ x: number; y: number }>({ x: 25, y: 52 });
  const hook2Ref = useRef<{ x: number; y: number }>({ x: 75, y: 52 });

  // Direction keys pressed for P1 and P2
  const p1DirsRef = useRef<Set<'up' | 'down' | 'left' | 'right'>>(new Set());
  const p2DirsRef = useRef<Set<'up' | 'down' | 'left' | 'right'>>(new Set());

  // Swimming fish for the 4 options of the active question
  const [fishes, setFishes] = useState<OptionFishState[]>([]);
  const fishesRef = useRef<OptionFishState[]>([]);
  fishesRef.current = fishes;

  // Initialize or re-initialize 4 swimming fish when questionIndex changes
  const initOptionFishes = useCallback((q: FishQuestion) => {
    // 4 vertical tiers spread cleanly across the pond: 30%, 45%, 60%, 75%
    const tiers = [30, 45, 60, 75];
    const initialFishes: OptionFishState[] = q.options.map((opt, idx) => {
      const theme = FISH_THEMES[idx % FISH_THEMES.length];
      const startX = 16 + idx * 22; // spread across pond
      const dir: 1 | -1 = idx % 2 === 0 ? 1 : -1;
      const speed = 0.14 + idx * 0.02;

      return {
        label: opt.label,
        text: opt.text,
        x: startX,
        y: tiers[idx],
        baseY: tiers[idx],
        direction: dir,
        speed,
        color: theme.color,
        badgeBg: theme.badgeBg,
        icon: theme.icon,
        sinePhase: idx * 1.5,
      };
    });

    setFishes(initialFishes);
  }, []);

  useEffect(() => {
    initOptionFishes(activeQ);
    // Reset hooks to their home positions
    setHook1({ x: 25, y: 52 });
    setHook2({ x: 75, y: 52 });
    hook1Ref.current = { x: 25, y: 52 };
    hook2Ref.current = { x: 75, y: 52 };
    p1DirsRef.current.clear();
    p2DirsRef.current.clear();
  }, [questionIndex, initOptionFishes, activeQ]);

  // Sync ref positions
  useEffect(() => {
    hook1Ref.current = hook1;
  }, [hook1]);
  useEffect(() => {
    hook2Ref.current = hook2;
  }, [hook2]);

  // Keyboard navigation for testing & accessibility (WASD for P1, Arrows for P2)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || isPaused) return;

      // P1 (WASD)
      if (e.key === 'w' || e.key === 'W') p1DirsRef.current.add('up');
      if (e.key === 's' || e.key === 'S') p1DirsRef.current.add('down');
      if (e.key === 'a' || e.key === 'A') p1DirsRef.current.add('left');
      if (e.key === 'd' || e.key === 'D') p1DirsRef.current.add('right');

      // P2 (Arrow Keys)
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        p2DirsRef.current.add('up');
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        p2DirsRef.current.add('down');
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        p2DirsRef.current.add('left');
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        p2DirsRef.current.add('right');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // P1 (WASD)
      if (e.key === 'w' || e.key === 'W') p1DirsRef.current.delete('up');
      if (e.key === 's' || e.key === 'S') p1DirsRef.current.delete('down');
      if (e.key === 'a' || e.key === 'A') p1DirsRef.current.delete('left');
      if (e.key === 'd' || e.key === 'D') p1DirsRef.current.delete('right');

      // P2 (Arrow Keys)
      if (e.key === 'ArrowUp') p2DirsRef.current.delete('up');
      if (e.key === 'ArrowDown') p2DirsRef.current.delete('down');
      if (e.key === 'ArrowLeft') p2DirsRef.current.delete('left');
      if (e.key === 'ArrowRight') p2DirsRef.current.delete('right');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, isPaused]);

  // Main game loop (Continuous 60FPS Movement & Rebutan Collision)
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) return;

    let animId: number;
    let stepCount = 0;

    const gameLoop = () => {
      stepCount++;

      // 1. Move Hook 1 (Kelompok 1)
      let h1x = hook1Ref.current.x;
      let h1y = hook1Ref.current.y;
      const speed = 0.62;

      if (p1DirsRef.current.has('left')) h1x -= speed;
      if (p1DirsRef.current.has('right')) h1x += speed;
      if (p1DirsRef.current.has('up')) h1y -= speed;
      if (p1DirsRef.current.has('down')) h1y += speed;

      h1x = Math.max(5, Math.min(95, h1x));
      h1y = Math.max(18, Math.min(84, h1y));

      hook1Ref.current = { x: h1x, y: h1y };
      setHook1({ x: h1x, y: h1y });

      // 2. Move Hook 2 (Kelompok 2)
      let h2x = hook2Ref.current.x;
      let h2y = hook2Ref.current.y;

      if (p2DirsRef.current.has('left')) h2x -= speed;
      if (p2DirsRef.current.has('right')) h2x += speed;
      if (p2DirsRef.current.has('up')) h2y -= speed;
      if (p2DirsRef.current.has('down')) h2y += speed;

      h2x = Math.max(5, Math.min(95, h2x));
      h2y = Math.max(18, Math.min(84, h2y));

      hook2Ref.current = { x: h2x, y: h2y };
      setHook2({ x: h2x, y: h2y });

      // 3. Move Option Fish (Horizontal swim across entire pond + gentle sinusoidal vertical bobbing)
      setFishes((prev) =>
        prev.map((fish) => {
          let nx = fish.x + fish.speed * fish.direction;
          let nd = fish.direction;

          if (nx > 89) {
            nx = 89;
            nd = -1;
          } else if (nx < 11) {
            nx = 11;
            nd = 1;
          }

          // Gentle natural bobbing
          const ny = fish.baseY + Math.sin(stepCount * 0.04 + fish.sinePhase) * 2.2;

          return { ...fish, x: nx, y: ny, direction: nd };
        })
      );

      // 4. Collision Detection between Hooks and the 4 Option Fishes (Rebutan Cepat!)
      const currentFishes = fishesRef.current;
      const hitRadius = 7.0; // Collision threshold

      let caughtTeam: 1 | 2 | null = null;
      let caughtFish: OptionFishState | null = null;

      for (const fish of currentFishes) {
        const d1 = Math.hypot(h1x - fish.x, h1y - fish.y);
        const d2 = Math.hypot(h2x - fish.x, h2y - fish.y);

        if (d1 < hitRadius && d2 < hitRadius) {
          caughtTeam = d1 <= d2 ? 1 : 2;
          caughtFish = fish;
          break;
        } else if (d1 < hitRadius) {
          caughtTeam = 1;
          caughtFish = fish;
          break;
        } else if (d2 < hitRadius) {
          caughtTeam = 2;
          caughtFish = fish;
          break;
        }
      }

      if (caughtTeam && caughtFish) {
        p1DirsRef.current.clear();
        p2DirsRef.current.clear();

        const isCorrect = caughtFish.label === activeQ.correctAnswer;
        const pts = isCorrect ? activeQ.points : 0;

        if (isCorrect) {
          sounds.playCatchSuccess();
          sounds.playReveal();
          if (caughtTeam === 1) {
            setScoreTeam1((prev) => prev + pts);
          } else {
            setScoreTeam2((prev) => prev + pts);
          }
          try {
            confetti({
              particleCount: 75,
              spread: 80,
              origin: { y: 0.4 },
              colors:
                caughtTeam === 1
                  ? ['#38BDF8', '#3B82F6', '#FBBF24']
                  : ['#FB923C', '#F97316', '#FBBF24'],
            });
          } catch {}
        } else {
          sounds.playWrongCatch();
        }

        setCatchResult({
          team: caughtTeam,
          chosenLabel: caughtFish.label,
          chosenText: caughtFish.text,
          isCorrect,
          pointsEarned: pts,
        });

        setGameState('caught');
        return; // Pause loop
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, isPaused, activeQ]);

  // Proceed to next question or complete battle
  const handleProceedNext = () => {
    sounds.playClick();
    setCatchResult(null);

    if (questionIndex >= 7) {
      sounds.playFanfare();
      setGameState('completed');
      try {
        confetti({
          particleCount: 160,
          spread: 120,
          origin: { y: 0.5 },
        });
      } catch {}
    } else {
      setQuestionIndex((prev) => prev + 1);
      setGameState('playing');
    }
  };

  // Restart battle from question 1
  const handleRestartBattle = () => {
    sounds.playClick();
    setQuestionIndex(0);
    setScoreTeam1(0);
    setScoreTeam2(0);
    setCatchResult(null);
    setIsPaused(false);
    setGameState('playing');
  };

  // Toggle sound
  const handleToggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setSoundOn(sounds.enabled);
  };

  // Multi-Touch Direction Handlers (with pointer capture for IFP screen)
  const handleP1DirDown = (e: React.PointerEvent, dir: 'up' | 'down' | 'left' | 'right') => {
    e.preventDefault();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    sounds.playClick();
    p1DirsRef.current.add(dir);
  };

  const handleP1DirUp = (dir: 'up' | 'down' | 'left' | 'right') => {
    p1DirsRef.current.delete(dir);
  };

  const handleP2DirDown = (e: React.PointerEvent, dir: 'up' | 'down' | 'left' | 'right') => {
    e.preventDefault();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
    sounds.playClick();
    p2DirsRef.current.add(dir);
  };

  const handleP2DirUp = (dir: 'up' | 'down' | 'left' | 'right') => {
    p2DirsRef.current.delete(dir);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden select-none text-white font-sans touch-none z-50 bg-slate-950">
      {/* ========================================================================= */}
      {/* 1. SATU KOLAM BESAR: SELURUH LAYAR IFP ADALAH KOLAM (100% W x 100% H)     */}
      {/* ========================================================================= */}
      {/* Background underwater photo covering edge-to-edge */}
      <img
        src={underwaterBg}
        alt="Kolam Mancing Budaya"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />

      {/* Sunbeams & Water Depth Atmospheric Lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-400/25 via-cyan-500/10 to-slate-950/75 pointer-events-none" />

      {/* Surface Water Caustic Shimmer Wave at Top */}
      <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-sky-200/30 via-cyan-300/15 to-transparent pointer-events-none" />
      <div className="absolute top-20 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent blur-[1px] pointer-events-none" />

      {/* Floating Animated Underwater Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: '8%', delay: '0s', dur: '8s', size: 'w-3 h-3' },
          { left: '18%', delay: '2s', dur: '9s', size: 'w-4 h-4' },
          { left: '32%', delay: '4s', dur: '7s', size: 'w-2 h-2' },
          { left: '46%', delay: '1s', dur: '10s', size: 'w-3 h-3' },
          { left: '62%', delay: '3s', dur: '8.5s', size: 'w-4 h-4' },
          { left: '74%', delay: '5s', dur: '9.5s', size: 'w-2.5 h-2.5' },
          { left: '88%', delay: '2.5s', dur: '7.5s', size: 'w-3.5 h-3.5' },
        ].map((b, i) => (
          <div
            key={i}
            className={`absolute bottom-0 rounded-full bg-cyan-200/40 border border-white/60 shadow-[0_0_8px_rgba(255,255,255,0.7)] anim-bubble ${b.size}`}
            style={{
              left: b.left,
              animationDelay: b.delay,
              animationDuration: b.dur,
            }}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 2. WATER SURFACE LEVEL: PERAHU NELAYAN P1 & P2 SLIDING HORIZONTALLY       */}
      {/* ========================================================================= */}
      <div className="absolute inset-x-0 top-20 h-16 pointer-events-none z-30">
        {/* Boat 1 (🔵 Kelompok 1) */}
        <div
          className="absolute top-0 transform -translate-x-1/2 transition-all duration-75 flex flex-col items-center"
          style={{ left: `${hook1.x}%` }}
        >
          <div className="px-2 py-0.5 rounded-full bg-blue-600 border border-white text-white text-[10px] font-black shadow-lg">
            🔵 P1
          </div>
          <div className="w-16 h-8 -mt-0.5">
            <svg viewBox="0 0 120 60" className="w-full h-full drop-shadow-xl">
              <path
                d="M 10,25 Q 60,55 110,25 L 95,48 Q 60,54 25,48 Z"
                fill="#92400E"
                stroke="#FDE047"
                strokeWidth="2.5"
              />
              <path d="M 20,36 Q 60,46 100,36" stroke="#78350F" strokeWidth="2" fill="none" />
              <circle cx="56" cy="20" r="7" fill="#FDE047" />
              <polygon points="40,16 72,16 56,3" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.5" />
              <path d="M 48,27 L 64,27 L 62,38 L 50,38 Z" fill="#2563EB" />
              <line x1="60" y1="24" x2="104" y2="10" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Boat 2 (🟠 Kelompok 2) */}
        <div
          className="absolute top-0 transform -translate-x-1/2 transition-all duration-75 flex flex-col items-center"
          style={{ left: `${hook2.x}%` }}
        >
          <div className="px-2 py-0.5 rounded-full bg-orange-600 border border-white text-white text-[10px] font-black shadow-lg">
            🟠 P2
          </div>
          <div className="w-16 h-8 -mt-0.5">
            <svg viewBox="0 0 120 60" className="w-full h-full drop-shadow-xl">
              <path
                d="M 10,25 Q 60,55 110,25 L 95,48 Q 60,54 25,48 Z"
                fill="#9A3412"
                stroke="#FB923C"
                strokeWidth="2.5"
              />
              <path d="M 20,36 Q 60,46 100,36" stroke="#7C2D12" strokeWidth="2" fill="none" />
              <circle cx="56" cy="20" r="7" fill="#FED7AA" />
              <polygon points="40,16 72,16 56,3" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
              <path d="M 48,27 L 64,27 L 62,38 L 50,38 Z" fill="#EA580C" />
              <line x1="52" y1="24" x2="8" y2="10" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FISHING LINES & HOOKS (2D INDEPENDENT CONTROL IN THE ENTIRE POND)      */}
      {/* ========================================================================= */}
      {/* Fishing Line 1 (P1 - Blue) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        <line
          x1={`${hook1.x}%`}
          y1="108px"
          x2={`${hook1.x}%`}
          y2={`${hook1.y}%`}
          stroke="#60A5FA"
          strokeWidth="2.5"
          strokeDasharray="4 2"
          className="drop-shadow-[0_0_10px_rgba(59,130,246,1)]"
        />
      </svg>
      {/* Hook 1 Bait Entity */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 transition-transform duration-75"
        style={{ left: `${hook1.x}%`, top: `${hook1.y}%` }}
      >
        <div className="relative flex items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-blue-500/50 animate-ping absolute" />
          <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-[0_0_20px_rgba(59,130,246,1)] flex items-center justify-center text-sm font-black text-white">
            🪝
          </div>
          <span className="absolute -bottom-4.5 px-2 py-0.5 rounded-full bg-blue-700/90 border border-white/60 text-white font-mono font-black text-[9px] shadow-md tracking-wider">
            KAIL P1
          </span>
        </div>
      </div>

      {/* Fishing Line 2 (P2 - Orange) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        <line
          x1={`${hook2.x}%`}
          y1="108px"
          x2={`${hook2.x}%`}
          y2={`${hook2.y}%`}
          stroke="#FB923C"
          strokeWidth="2.5"
          strokeDasharray="4 2"
          className="drop-shadow-[0_0_10px_rgba(249,115,22,1)]"
        />
      </svg>
      {/* Hook 2 Bait Entity */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 transition-transform duration-75"
        style={{ left: `${hook2.x}%`, top: `${hook2.y}%` }}
      >
        <div className="relative flex items-center justify-center">
          <div className="w-9 h-9 rounded-full bg-orange-500/50 animate-ping absolute" />
          <div className="w-8 h-8 rounded-full bg-orange-600 border-2 border-white shadow-[0_0_20px_rgba(249,115,22,1)] flex items-center justify-center text-sm font-black text-white">
            🪝
          </div>
          <span className="absolute -bottom-4.5 px-2 py-0.5 rounded-full bg-orange-700/90 border border-white/60 text-white font-mono font-black text-[9px] shadow-md tracking-wider">
            KAIL P2
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. 4 SWIMMING OPTION FISHES (A, B, C, D) IN THE POND ARENA                */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
        {fishes.map((fish) => {
          const isFacingRight = fish.direction === 1;

          return (
            <div
              key={fish.label}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 select-none pointer-events-none"
              style={{
                left: `${fish.x}%`,
                top: `${fish.y}%`,
              }}
            >
              {/* Fish Pill Body */}
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border-2 border-white shadow-2xl transition-all ${
                  isFacingRight ? 'flex-row' : 'flex-row-reverse'
                }`}
                style={{
                  backgroundColor: `${fish.color}F2`,
                  boxShadow: `0 6px 25px rgba(0,0,0,0.85), 0 0 20px ${fish.color}`,
                }}
              >
                {/* Animated Fish Emoji */}
                <span
                  className={`text-2xl sm:text-3xl filter drop-shadow transition-transform ${
                    isFacingRight ? 'scale-x-100' : '-scale-x-100'
                  }`}
                >
                  {fish.icon}
                </span>

                {/* Option Letter Badge [A, B, C, D] */}
                <span className="w-6 h-6 rounded-full bg-slate-950 text-white font-mono font-black text-xs flex items-center justify-center border border-white/60 shrink-0 shadow-md">
                  {fish.label}
                </span>

                {/* Option Answer Text */}
                <span className="font-extrabold text-xs sm:text-sm text-slate-950 uppercase tracking-wide whitespace-nowrap drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] max-w-[200px] sm:max-w-[300px] truncate">
                  {fish.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 5. TOP FLOATING OVERLAY: SCORES, COMPACT QUESTION, ACTION BUTTONS         */}
      {/* ========================================================================= */}
      <header className="absolute top-2 inset-x-0 z-40 px-3 sm:px-6 pointer-events-none flex items-start justify-between gap-2">
        {/* Left Side: Kelompok 1 Scoreboard */}
        <div className="pointer-events-auto flex items-center">
          <div className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-slate-950/80 backdrop-blur-md border-2 border-blue-400 shadow-[0_4px_25px_rgba(59,130,246,0.6)] flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-ping" />
                KELOMPOK 1
              </span>
              <span className="text-[9px] text-slate-300 font-semibold hidden md:inline">
                Pancing Kiri 🔵
              </span>
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-[10px] sm:text-xs font-bold text-amber-300">SKOR:</span>
              <span className="text-xl sm:text-2xl font-black text-white drop-shadow-[0_2px_10px_rgba(59,130,246,1)]">
                {scoreTeam1 < 10 ? `0${scoreTeam1}` : scoreTeam1}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Compact Hanging Question Card (Leaves 80%+ of the pond clear!) */}
        <div className="pointer-events-auto flex flex-col items-center max-w-xl sm:max-w-2xl w-full mx-2">
          <div className="w-full bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl px-4 py-2 shadow-[0_12px_35px_rgba(0,0,0,0.7)] border-2 border-amber-300 flex flex-col items-center text-center">
            {/* Top row: Soal badge, Points, Level */}
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                SOAL {questionIndex + 1} DARI 8
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-600 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider shadow-sm">
                +{activeQ.points} POIN
              </span>
              <span className="text-[10px] text-slate-500 font-bold hidden sm:inline">
                • {activeQ.levelLabel}
              </span>
            </div>

            {/* Bold Question Text */}
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug tracking-tight px-2 line-clamp-2">
              “{activeQ.question}”
            </h2>

            {/* Hint */}
            <div className="text-[10px] font-bold text-blue-900 flex items-center gap-1 mt-0.5">
              <span>🎣</span>
              <span>ARAHKAN KAIL & REBUT IKAN JAWABAN YANG TEPAT!</span>
            </div>
          </div>
        </div>

        {/* Right Side: Score Kelompok 2 + Amber Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Kelompok 2 Scoreboard */}
          <div className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-slate-950/80 backdrop-blur-md border-2 border-orange-400 shadow-[0_4px_25px_rgba(249,115,22,0.6)] flex items-center gap-2 sm:gap-3">
            <div className="flex items-baseline gap-1 font-mono order-2 sm:order-1">
              <span className="text-[10px] sm:text-xs font-bold text-amber-300">SKOR:</span>
              <span className="text-xl sm:text-2xl font-black text-white drop-shadow-[0_2px_10px_rgba(249,115,22,1)]">
                {scoreTeam2 < 10 ? `0${scoreTeam2}` : scoreTeam2}
              </span>
            </div>
            <div className="flex flex-col items-end order-1 sm:order-2">
              <span className="text-[10px] sm:text-xs font-black text-orange-300 uppercase tracking-wider flex items-center gap-1.5">
                KELOMPOK 2
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping" />
              </span>
              <span className="text-[9px] text-slate-300 font-semibold hidden md:inline">
                Pancing Kanan 🟠
              </span>
            </div>
          </div>

          {/* Action Buttons: Pause, Sound, Exit */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Pause */}
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black shadow-lg border-2 border-white flex items-center justify-center transition-all cursor-pointer"
              title={isPaused ? 'Lanjutkan' : 'Jeda Permainan'}
            >
              {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black shadow-lg border-2 border-white flex items-center justify-center transition-all cursor-pointer"
              title={soundOn ? 'Matikan Suara' : 'Nyalakan Suara'}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Exit */}
            <button
              onClick={onBack}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-rose-500 hover:bg-rose-400 active:scale-95 text-white font-black shadow-lg border-2 border-white flex items-center justify-center transition-all cursor-pointer"
              title="Keluar dari Mancing Budaya"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 6. BOTTOM FLOATING CONTROLLERS (OVERLAY DIRECTLY ON TOP OF WATER)         */}
      {/* ========================================================================= */}
      {/* KURSOR PANCING KELOMPOK 1 (BAWAH KIRI) */}
      <div className="absolute bottom-3 left-4 sm:left-6 z-40 select-none flex flex-col items-center">
        <span className="text-[11px] sm:text-xs font-black text-cyan-300 tracking-wider uppercase mb-1 drop-shadow flex items-center gap-1">
          <span>🔵</span>
          <span>PANCING KELOMPOK 1</span>
        </span>

        {/* D-Pad Controller */}
        <div className="bg-slate-950/80 backdrop-blur-md p-2 rounded-3xl border-2 border-blue-400 shadow-[0_4px_25px_rgba(59,130,246,0.6)] flex flex-col items-center">
          {/* ▲ UP */}
          <button
            disabled={gameState !== 'playing' || isPaused}
            onPointerDown={(e) => handleP1DirDown(e, 'up')}
            onPointerUp={() => handleP1DirUp('up')}
            onPointerCancel={() => handleP1DirUp('up')}
            onPointerLeave={() => handleP1DirUp('up')}
            className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-90 active:bg-cyan-400 text-white font-black text-xl flex items-center justify-center shadow-lg border-2 border-blue-300 transition-all cursor-pointer touch-none disabled:opacity-40"
            title="Gerak ke Atas (P1)"
          >
            ▲
          </button>

          {/* Middle Row: ◀ LEFT, P1, ▶ RIGHT */}
          <div className="flex items-center gap-1.5 my-1">
            <button
              disabled={gameState !== 'playing' || isPaused}
              onPointerDown={(e) => handleP1DirDown(e, 'left')}
              onPointerUp={() => handleP1DirUp('left')}
              onPointerCancel={() => handleP1DirUp('left')}
              onPointerLeave={() => handleP1DirUp('left')}
              className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-90 active:bg-cyan-400 text-white font-black text-xl flex items-center justify-center shadow-lg border-2 border-blue-300 transition-all cursor-pointer touch-none disabled:opacity-40"
              title="Gerak ke Kiri (P1)"
            >
              ◀
            </button>

            <div className="w-7 h-7 rounded-full bg-blue-950 border border-blue-400 flex items-center justify-center text-[10px] text-blue-300 font-mono font-bold shadow-inner">
              P1
            </div>

            <button
              disabled={gameState !== 'playing' || isPaused}
              onPointerDown={(e) => handleP1DirDown(e, 'right')}
              onPointerUp={() => handleP1DirUp('right')}
              onPointerCancel={() => handleP1DirUp('right')}
              onPointerLeave={() => handleP1DirUp('right')}
              className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-90 active:bg-cyan-400 text-white font-black text-xl flex items-center justify-center shadow-lg border-2 border-blue-300 transition-all cursor-pointer touch-none disabled:opacity-40"
              title="Gerak ke Kanan (P1)"
            >
              ▶
            </button>
          </div>

          {/* ▼ DOWN */}
          <button
            disabled={gameState !== 'playing' || isPaused}
            onPointerDown={(e) => handleP1DirDown(e, 'down')}
            onPointerUp={() => handleP1DirUp('down')}
            onPointerCancel={() => handleP1DirUp('down')}
            onPointerLeave={() => handleP1DirUp('down')}
            className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-90 active:bg-cyan-400 text-white font-black text-xl flex items-center justify-center shadow-lg border-2 border-blue-300 transition-all cursor-pointer touch-none disabled:opacity-40"
            title="Gerak ke Bawah (P1)"
          >
            ▼
          </button>
        </div>
      </div>

      {/* Floating Center Bottom Subtle Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-sm border border-white/10 text-[11px] text-cyan-200 font-bold">
        <span>🎮</span>
        <span>Rebutan Cepat Tangkap Ikan • Multi-touch IFP & Keyboard (WASD / Panah)</span>
      </div>

      {/* KURSOR PANCING KELOMPOK 2 (BAWAH KANAN) */}
      <div className="absolute bottom-3 right-4 sm:right-6 z-40 select-none flex flex-col items-center">
        <span className="text-[11px] sm:text-xs font-black text-orange-300 tracking-wider uppercase mb-1 drop-shadow flex items-center gap-1">
          <span>PANCING KELOMPOK 2</span>
          <span>🟠</span>
        </span>

        {/* D-Pad Controller */}
        <div className="bg-slate-950/80 backdrop-blur-md p-2 rounded-3xl border-2 border-orange-400 shadow-[0_4px_25px_rgba(249,115,22,0.6)] flex flex-col items-center">
          {/* ▲ UP */}
          <button
            disabled={gameState !== 'playing' || isPaused}
            onPointerDown={(e) => handleP2DirDown(e, 'up')}
            onPointerUp={() => handleP2DirUp('up')}
            onPointerCancel={() => handleP2DirUp('up')}
            onPointerLeave={() => handleP2DirUp('up')}
            className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-orange-600 hover:bg-orange-500 active:scale-90 active:bg-amber-400 text-white font-black text-xl flex items-center justify-center shadow-lg border-2 border-orange-300 transition-all cursor-pointer touch-none disabled:opacity-40"
            title="Gerak ke Atas (P2)"
          >
            ▲
          </button>

          {/* Middle Row: ◀ LEFT, P2, ▶ RIGHT */}
          <div className="flex items-center gap-1.5 my-1">
            <button
              disabled={gameState !== 'playing' || isPaused}
              onPointerDown={(e) => handleP2DirDown(e, 'left')}
              onPointerUp={() => handleP2DirUp('left')}
              onPointerCancel={() => handleP2DirUp('left')}
              onPointerLeave={() => handleP2DirUp('left')}
              className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-orange-600 hover:bg-orange-500 active:scale-90 active:bg-amber-400 text-white font-black text-xl flex items-center justify-center shadow-lg border-2 border-orange-300 transition-all cursor-pointer touch-none disabled:opacity-40"
              title="Gerak ke Kiri (P2)"
            >
              ◀
            </button>

            <div className="w-7 h-7 rounded-full bg-orange-950 border border-orange-400 flex items-center justify-center text-[10px] text-orange-300 font-mono font-bold shadow-inner">
              P2
            </div>

            <button
              disabled={gameState !== 'playing' || isPaused}
              onPointerDown={(e) => handleP2DirDown(e, 'right')}
              onPointerUp={() => handleP2DirUp('right')}
              onPointerCancel={() => handleP2DirUp('right')}
              onPointerLeave={() => handleP2DirUp('right')}
              className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-orange-600 hover:bg-orange-500 active:scale-90 active:bg-amber-400 text-white font-black text-xl flex items-center justify-center shadow-lg border-2 border-orange-300 transition-all cursor-pointer touch-none disabled:opacity-40"
              title="Gerak ke Kanan (P2)"
            >
              ▶
            </button>
          </div>

          {/* ▼ DOWN */}
          <button
            disabled={gameState !== 'playing' || isPaused}
            onPointerDown={(e) => handleP2DirDown(e, 'down')}
            onPointerUp={() => handleP2DirUp('down')}
            onPointerCancel={() => handleP2DirUp('down')}
            onPointerLeave={() => handleP2DirUp('down')}
            className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-orange-600 hover:bg-orange-500 active:scale-90 active:bg-amber-400 text-white font-black text-xl flex items-center justify-center shadow-lg border-2 border-orange-300 transition-all cursor-pointer touch-none disabled:opacity-40"
            title="Gerak ke Bawah (P2)"
          >
            ▼
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. CATCH FEEDBACK OVERLAY / MODAL                                         */}
      {/* ========================================================================= */}
      {gameState === 'caught' && catchResult && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div
            className={`relative w-full max-w-xl rounded-3xl p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.95)] border-4 flex flex-col items-center text-center space-y-3 animate-scaleUp ${
              catchResult.isCorrect
                ? 'bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 border-emerald-400'
                : 'bg-gradient-to-br from-rose-950 via-slate-900 to-slate-950 border-rose-400'
            }`}
          >
            {/* Result Icon */}
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-xl border-3 ${
                catchResult.isCorrect
                  ? 'bg-emerald-500 border-white text-slate-950'
                  : 'bg-rose-500 border-white text-white'
              }`}
            >
              {catchResult.isCorrect ? '🎉' : '❌'}
            </div>

            {/* Team Badge */}
            <div
              className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white shadow ${
                catchResult.team === 1 ? 'bg-blue-600' : 'bg-orange-600'
              }`}
            >
              PANCING KELOMPOK {catchResult.team} MENANGKAP:
            </div>

            {/* Caught Option details */}
            <div className="space-y-1">
              <div className="text-xl sm:text-2xl font-black text-white">
                [{catchResult.chosenLabel}] {catchResult.chosenText}
              </div>
              {catchResult.isCorrect ? (
                <div className="text-base sm:text-lg font-black text-amber-300 flex items-center justify-center gap-1">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>JAWABAN BENAR! +{catchResult.pointsEarned} POIN</span>
                </div>
              ) : (
                <div className="text-xs sm:text-sm font-bold text-rose-300">
                  KURANG TEPAT! Jawaban yang benar adalah:{' '}
                  <span className="text-amber-300 font-black">
                    [{activeQ.correctAnswer}]{' '}
                    {activeQ.options.find((o) => o.label === activeQ.correctAnswer)?.text}
                  </span>
                </div>
              )}
            </div>

            {/* Cultural Explanation */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-xs sm:text-[13px] text-slate-200 font-medium leading-relaxed max-w-lg">
              <span className="font-bold text-amber-300">Penjelasan Budaya: </span>
              {activeQ.explanation}
            </div>

            {/* Next Question Action Button */}
            <div className="pt-2">
              <button
                onClick={handleProceedNext}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl active:scale-95 transition-all cursor-pointer border-2 border-white flex items-center gap-2"
              >
                <span>{questionIndex >= 7 ? 'LIHAT HASIL AKHIR' : 'SOAL BERIKUTNYA'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. VICTORY / BATTLE COMPLETED MODAL (AFTER 8 QUESTIONS)                   */}
      {/* ========================================================================= */}
      {gameState === 'completed' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-4 border-amber-400 rounded-3xl p-6 shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 border-3 border-amber-400 text-amber-300 flex items-center justify-center mx-auto shadow-lg">
              <Trophy className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wide uppercase">
                MANCING BUDAYA SELESAI!
              </h2>
              <p className="text-xs text-cyan-200 font-bold">
                8 Tantangan Budaya Nusantara Telah Dituntaskan Bersama
              </p>
            </div>

            {/* Final Scoreboard */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              <div className="p-3 rounded-2xl bg-blue-950/80 border-2 border-blue-400 shadow-lg space-y-1">
                <span className="text-xs font-black text-blue-300 uppercase">
                  KELOMPOK 1
                </span>
                <div className="text-3xl font-black text-white font-mono">
                  {scoreTeam1}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-orange-950/80 border-2 border-orange-400 shadow-lg space-y-1">
                <span className="text-xs font-black text-orange-300 uppercase">
                  KELOMPOK 2
                </span>
                <div className="text-3xl font-black text-white font-mono">
                  {scoreTeam2}
                </div>
              </div>
            </div>

            {/* Appreciation Note */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/15 text-xs sm:text-sm text-amber-200 font-bold leading-relaxed max-w-md mx-auto">
              “LUAR BIASA! KALIAN SUDAH BERLATIH KETANGKASAN, BERPIKIR KRITIS, DAN MENGHARGAI KEBERAGAMAN BUDAYA INDONESIA.”
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRestartBattle}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ULANGI PERMAINAN</span>
              </button>

              <button
                onClick={() => {
                  sounds.playFanfare();
                  onNext();
                }}
                className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl active:scale-95 transition-all cursor-pointer border-2 border-white flex items-center justify-center gap-2"
              >
                <span>LANJUT KE KUIS ADAPTIF</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. PAUSE MODAL                                                            */}
      {/* ========================================================================= */}
      {isPaused && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border-3 border-amber-400 rounded-3xl p-5 text-center space-y-4 shadow-2xl animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center mx-auto text-amber-300 text-xl font-black">
              ⏸️
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">
              PERMAINAN DIJEDA
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setIsPaused(false)}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>LANJUTKAN PERMAINAN</span>
              </button>
              <button
                onClick={handleRestartBattle}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ULANGI DARI SOAL 1</span>
              </button>
              <button
                onClick={onBack}
                className="w-full py-2.5 rounded-xl bg-rose-600/80 hover:bg-rose-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>KELUAR KE MENU</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
