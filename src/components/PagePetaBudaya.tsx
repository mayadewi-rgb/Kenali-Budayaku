import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Compass,
  Check,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import {
  PETA_CULTURE_CARDS,
  PetaCardItem,
  petaAsliImg,
} from '../data/petaBudayaData';
import { sounds } from '../utils/audio';

interface PagePetaBudayaProps {
  onBack: () => void;
  onNext: () => void;
}

// 8 Geographically Accurate Region Targets with distinct label offset directions
// Anchors are dead-center on the actual island landmasses
interface MapRegionTarget {
  id: string;
  label: string;
  cx: number; // percentage width of map
  cy: number; // percentage height of map
  color: string;
  glow: string;
  labelDirection: 'top' | 'bottom' | 'left' | 'bottom-right';
}

const ACCURATE_REGIONS: MapRegionTarget[] = [
  {
    id: 'aceh',
    label: 'ACEH',
    cx: 7.5,
    cy: 21.5,
    color: '#EC4899', // Pink / Magenta
    glow: 'rgba(236, 72, 153, 0.95)',
    labelDirection: 'top',
  },
  {
    id: 'sumbar',
    label: 'SUMBAR',
    cx: 13.0,
    cy: 34.0,
    color: '#EAB308', // Golden Yellow
    glow: 'rgba(234, 179, 8, 0.95)',
    labelDirection: 'left',
  },
  {
    id: 'jawa',
    label: 'JAWA',
    cx: 37.5,
    cy: 75.5,
    color: '#EF4444', // Red / Coral
    glow: 'rgba(239, 68, 68, 0.95)',
    labelDirection: 'bottom',
  },
  {
    id: 'madura',
    label: 'MADURA',
    cx: 48.0,
    cy: 72.5,
    color: '#F97316', // Orange
    glow: 'rgba(249, 115, 22, 0.95)',
    labelDirection: 'top',
  },
  {
    id: 'bali',
    label: 'BALI',
    cx: 53.0,
    cy: 77.8,
    color: '#06B6D4', // Cyan / Turquoise
    glow: 'rgba(6, 182, 212, 0.95)',
    labelDirection: 'bottom-right',
  },
  {
    id: 'ntt',
    label: 'NTT',
    cx: 62.0,
    cy: 79.8,
    color: '#F59E0B', // Amber / Orange
    glow: 'rgba(245, 158, 11, 0.95)',
    labelDirection: 'bottom',
  },
  {
    id: 'sulsel',
    label: 'SULSEL',
    cx: 53.6,
    cy: 58.5,
    color: '#A855F7', // Purple / Violet
    glow: 'rgba(168, 85, 247, 0.95)',
    labelDirection: 'top',
  },
  {
    id: 'maluku_papua',
    label: 'MALUKU/PAPUA',
    cx: 76.5,
    cy: 47.5,
    color: '#3B82F6', // Ocean Blue
    glow: 'rgba(59, 130, 246, 0.95)',
    labelDirection: 'top',
  },
];

export const PagePetaBudaya: React.FC<PagePetaBudayaProps> = ({ onBack, onNext }) => {
  // Matched items mapping: regionId -> PetaCardItem
  const [matchedPairs, setMatchedPairs] = useState<Record<string, PetaCardItem>>({});

  // Team Turn: 1 or 2 (Battle 2 Kelompok!)
  const [turnTeam, setTurnTeam] = useState<1 | 2>(1);

  // Scores for Kelompok 1 (Blue) & Kelompok 2 (Orange)
  const [scoreTeam1, setScoreTeam1] = useState<number>(0);
  const [scoreTeam2, setScoreTeam2] = useState<number>(0);

  // Animated +10 Poin score popup
  const [scorePopup, setScorePopup] = useState<{ team: 1 | 2; id: number } | null>(null);

  // Sound toggle state
  const [soundOn, setSoundOn] = useState<boolean>(sounds.enabled);

  // Active Drag State using Pointer Events (100% reliable for IFP Touch & Stylus)
  const [draggingCard, setDraggingCard] = useState<PetaCardItem | null>(null);
  const [dragPointerPos, setDragPointerPos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  // Initial light sweep trigger
  const [showLightSweep, setShowLightSweep] = useState<boolean>(true);

  // Proximity sound gate so ting only plays once per target approach
  const hasPlayedTingRef = useRef<boolean>(false);

  // Floating feedback toast ("BENAR! 🎉" or "BELUM TEPAT 🤔")
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'warning';
    text: string;
    subtext?: string;
  } | null>(null);

  // Completion state (all 8 cards matched)
  const isAllCompleted = Object.keys(matchedPairs).length === PETA_CULTURE_CARDS.length;

  // DOM Refs for each of the 8 drop zone elements
  const dropZoneRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Map container ref
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Feedback timer ref
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Disable initial light sweep after 2.4s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLightSweep(false);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  const showFeedback = (type: 'success' | 'warning', text: string, subtext?: string) => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
    }
    setFeedback({ type, text, subtext });
    feedbackTimerRef.current = setTimeout(() => {
      setFeedback(null);
    }, 2400);
  };

  const handleToggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setSoundOn(sounds.enabled);
  };

  // Find which region drop zone intersects with client coordinates (x, y)
  // Collision targets the exact geographic center beacon dot!
  const getIntersectingRegion = useCallback(
    (clientX: number, clientY: number): string | null => {
      for (const region of ACCURATE_REGIONS) {
        if (matchedPairs[region.id]) continue;

        const el = dropZoneRefs.current[region.id];
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        // Generous touch hit zone (+45px padding) around the geographic beacon
        const hitPadding = 45;
        if (
          clientX >= rect.left - hitPadding &&
          clientX <= rect.right + hitPadding &&
          clientY >= rect.top - hitPadding &&
          clientY <= rect.bottom + hitPadding
        ) {
          return region.id;
        }
      }
      return null;
    },
    [matchedPairs]
  );

  // Calculate distance between pointer and a specific region geographic center
  const getDistanceToRegion = useCallback(
    (regionId: string, clientX: number, clientY: number): number => {
      const el = dropZoneRefs.current[regionId];
      if (!el) return 9999;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      return Math.hypot(clientX - centerX, clientY - centerY);
    },
    []
  );

  // -------------------------------------------------------------
  // REAL TOUCH DRAG AND DROP ENGINE (POINTER EVENTS FOR IFP)
  // -------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent, card: PetaCardItem) => {
    const isAlreadyMatched = Object.values(matchedPairs).some((m) => m.id === card.id);
    if (isAlreadyMatched) return;

    e.preventDefault();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}

    // Exciting Pop Sound on card pickup!
    sounds.playPop();
    hasPlayedTingRef.current = false;

    setDraggingCard(card);
    setDragPointerPos({ x: e.clientX, y: e.clientY });
    setHoveredRegionId(null);
  };

  // Global pointer move and pointer up listeners during active drag
  useEffect(() => {
    if (!draggingCard) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      e.preventDefault();
      setDragPointerPos({ x: e.clientX, y: e.clientY });
      const regionId = getIntersectingRegion(e.clientX, e.clientY);
      setHoveredRegionId(regionId);

      // Play proximity chime when approaching the correct target
      if (draggingCard.targetRegionId) {
        const dist = getDistanceToRegion(draggingCard.targetRegionId, e.clientX, e.clientY);
        if (dist < 140 && !hasPlayedTingRef.current) {
          sounds.playTing();
          hasPlayedTingRef.current = true;
        } else if (dist > 180) {
          hasPlayedTingRef.current = false;
        }
      }
    };

    const handleWindowPointerUp = (e: PointerEvent) => {
      e.preventDefault();
      const targetRegionId = getIntersectingRegion(e.clientX, e.clientY);

      if (targetRegionId) {
        if (draggingCard.targetRegionId === targetRegionId) {
          // CORRECT MATCH!
          sounds.playCatchSuccess();
          const targetConfig = ACCURATE_REGIONS.find((r) => r.id === targetRegionId);

          showFeedback(
            'success',
            `🎉 HEBAT! +10 POIN`,
            `${draggingCard.name} → ${targetConfig?.label || ''}`
          );

          // Award +10 points to active team!
          if (turnTeam === 1) {
            setScoreTeam1((prev) => prev + 10);
            setScorePopup({ team: 1, id: Date.now() });
          } else {
            setScoreTeam2((prev) => prev + 10);
            setScorePopup({ team: 2, id: Date.now() });
          }

          setTimeout(() => {
            setScorePopup(null);
          }, 1800);

          setMatchedPairs((prev) => {
            const next = { ...prev, [targetRegionId]: draggingCard };
            if (Object.keys(next).length === PETA_CULTURE_CARDS.length) {
              sounds.playFanfare();
              setTimeout(() => {
                try {
                  confetti({
                    particleCount: 180,
                    spread: 130,
                    origin: { y: 0.5 },
                  });
                } catch {}
              }, 250);
            }
            return next;
          });

          try {
            confetti({
              particleCount: 65,
              spread: 80,
              origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
              colors: ['#F59E0B', '#10B981', '#06B6D4', '#EC4899', '#3B82F6'],
            });
          } catch {}

          // Switch turn to other team!
          setTurnTeam((prev) => (prev === 1 ? 2 : 1));
        } else {
          // WRONG MATCH - 0 points, warm encouragement
          sounds.playWrongCatch();
          showFeedback('warning', '💡 BELUM TEPAT', 'Coba perhatikan posisi wilayahnya dan diskusikan kembali!');
        }
      }

      setDraggingCard(null);
      setDragPointerPos(null);
      setHoveredRegionId(null);
      hasPlayedTingRef.current = false;
    };

    const handleWindowPointerCancel = () => {
      setDraggingCard(null);
      setDragPointerPos(null);
      setHoveredRegionId(null);
      hasPlayedTingRef.current = false;
    };

    window.addEventListener('pointermove', handleWindowPointerMove, { passive: false });
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerCancel);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerCancel);
    };
  }, [draggingCard, getIntersectingRegion, getDistanceToRegion, turnTeam]);

  // Reset all matches & scores
  const handleReset = () => {
    sounds.playClick();
    setMatchedPairs({});
    setScoreTeam1(0);
    setScoreTeam2(0);
    setTurnTeam(1);
    setScorePopup(null);
    setDraggingCard(null);
    setDragPointerPos(null);
    setHoveredRegionId(null);
    setFeedback(null);
  };

  const currentScore = Object.keys(matchedPairs).length;

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden select-none bg-slate-950 text-white font-sans flex flex-col justify-between z-40 touch-none">
      {/* ========================================================================= */}
      {/* 1. ATMOSPHERIC BACKDROP & DRAMATIC SUNBEAMS                               */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#04162e] via-[#031022] to-[#010813] pointer-events-none" />

      {/* Initial Light Sweep across screen on open */}
      {showLightSweep && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/40 to-transparent pointer-events-none anim-light-sweep z-50" />
      )}

      {/* Sunbeams radiating from above */}
      <div className="absolute -top-40 left-1/4 w-[480px] h-[130vh] bg-gradient-to-b from-cyan-200/25 via-blue-400/10 to-transparent blur-3xl transform -rotate-15 pointer-events-none anim-sunbeam" />
      <div
        className="absolute -top-40 right-1/4 w-[420px] h-[130vh] bg-gradient-to-b from-amber-200/20 via-sky-400/10 to-transparent blur-3xl transform -rotate-6 pointer-events-none anim-sunbeam"
        style={{ animationDelay: '3s' }}
      />

      {/* ========================================================================= */}
      {/* 2. TOP HEADER: KELOMPOK 1 (LEFT) • BANNER (CENTER) • KELOMPOK 2 (RIGHT)   */}
      {/* ========================================================================= */}
      <header className="relative z-30 w-full px-3 sm:px-6 pt-2 pb-1 shrink-0 flex items-center justify-between gap-3">
        {/* ================= LEFT SIDE: KELOMPOK 1 (BLUE THEME) ================= */}
        <div className="flex items-center gap-2">
          <div
            className={`relative px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 border-2 sm:border-3 transition-all duration-300 flex items-center gap-2.5 sm:gap-3 shadow-[0_6px_25px_rgba(59,130,246,0.6)] ${
              turnTeam === 1
                ? 'border-cyan-300 ring-4 ring-cyan-400/50 scale-105 shadow-[0_0_30px_rgba(6,182,212,0.8)]'
                : 'border-blue-500/70 opacity-90'
            }`}
          >
            {/* Traditional Phinisi Boat Icon */}
            <div className="w-9 h-8 sm:w-10 sm:h-9 shrink-0 flex items-center justify-center anim-boat-bob">
              <svg viewBox="0 0 60 40" className="w-full h-full drop-shadow-md">
                <path
                  d="M 6,24 Q 30,34 54,24 L 46,33 Q 30,36 12,33 Z"
                  fill="#92400e"
                  stroke="#fde047"
                  strokeWidth="1.5"
                />
                <line x1="22" y1="6" x2="22" y2="25" stroke="#fef08a" strokeWidth="2" />
                <line x1="36" y1="8" x2="36" y2="25" stroke="#fef08a" strokeWidth="2" />
                <path d="M 22,7 L 10,20 L 22,20 Z" fill="#38bdf8" opacity="0.95" />
                <path d="M 36,9 L 24,21 L 36,21 Z" fill="#60a5fa" opacity="0.95" />
                <path d="M 36,10 L 48,22 L 36,22 Z" fill="#93c5fd" opacity="0.95" />
              </svg>
            </div>

            {/* Kelompok 1 Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-xs font-black text-cyan-300 uppercase tracking-wider">
                  KELOMPOK 1
                </span>
                {turnTeam === 1 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 text-[8px] font-black uppercase tracking-wider animate-pulse">
                    GILIRAN
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-[10px] sm:text-xs font-bold text-amber-300">⭐ SKOR:</span>
                <span className="text-xl sm:text-2xl font-black text-white drop-shadow-[0_2px_10px_rgba(59,130,246,1)] transition-transform duration-300">
                  {scoreTeam1 < 10 ? `0${scoreTeam1}` : scoreTeam1}
                </span>
              </div>
            </div>

            {/* +10 Popup Floating Notification */}
            {scorePopup?.team === 1 && (
              <div className="absolute -top-7 left-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs shadow-2xl anim-score-float border-2 border-white whitespace-nowrap z-50">
                +10 POIN ✨
              </div>
            )}
          </div>
        </div>

        {/* ================= CENTER: ORNATE CARVED WOODEN BANNER ================= */}
        <div className="relative flex flex-col items-center text-center max-w-xl sm:max-w-2xl px-5 sm:px-8 py-2 rounded-2xl bg-gradient-to-b from-[#854d0e] via-[#713f12] to-[#451a03] border-2 sm:border-3 border-[#fde047] shadow-[0_12px_35px_rgba(0,0,0,0.85)]">
          {/* Left & Right Decorative Golden Carvings */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-xl sm:text-2xl text-amber-300 drop-shadow pointer-events-none">
            ⚜️
          </div>
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 text-xl sm:text-2xl text-amber-300 drop-shadow pointer-events-none">
            ⚜️
          </div>

          <h1 className="text-base sm:text-lg md:text-xl font-black text-amber-300 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] uppercase leading-none">
            PASANGKAN BUDAYANYA!
          </h1>

          <p className="text-[10px] sm:text-[11px] font-bold text-amber-100 leading-tight mt-1 drop-shadow hidden sm:block">
            Seret kartu budaya ke daerah asalnya. Diskusikan dengan kelompokmu sebelum meletakkan kartu.
          </p>

          {/* Active Turn Notification Ribbon */}
          <div
            className="mt-1 flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-wider uppercase shadow-inner border transition-all duration-300"
            style={{
              backgroundColor: turnTeam === 1 ? 'rgba(30, 58, 138, 0.95)' : 'rgba(154, 52, 18, 0.95)',
              borderColor: turnTeam === 1 ? '#60a5fa' : '#fb923c',
              color: turnTeam === 1 ? '#93c5fd' : '#fed7aa',
              boxShadow: turnTeam === 1 ? '0 0 12px rgba(59,130,246,0.6)' : '0 0 12px rgba(249,115,22,0.6)',
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: turnTeam === 1 ? '#38bdf8' : '#fb923c' }}
            />
            <span>PETUALANGAN NUSANTARA • GILIRAN: KELOMPOK {turnTeam}</span>
          </div>
        </div>

        {/* ================= RIGHT SIDE: KELOMPOK 2 (ORANGE THEME) + CONTROLS ================= */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Kelompok 2 Card */}
          <div
            className={`relative px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-orange-950 via-slate-900 to-orange-900 border-2 sm:border-3 transition-all duration-300 flex items-center gap-2.5 sm:gap-3 shadow-[0_6px_25px_rgba(249,115,22,0.6)] ${
              turnTeam === 2
                ? 'border-amber-300 ring-4 ring-amber-400/50 scale-105 shadow-[0_0_30px_rgba(249,115,22,0.8)]'
                : 'border-orange-500/70 opacity-90'
            }`}
          >
            <div className="flex flex-col text-right">
              <div className="flex items-center justify-end gap-1.5">
                {turnTeam === 2 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[8px] font-black uppercase tracking-wider animate-pulse">
                    GILIRAN
                  </span>
                )}
                <span className="text-[10px] sm:text-xs font-black text-orange-300 uppercase tracking-wider">
                  KELOMPOK 2
                </span>
              </div>
              <div className="flex items-baseline justify-end gap-1 font-mono">
                <span className="text-[10px] sm:text-xs font-bold text-amber-300">⭐ SKOR:</span>
                <span className="text-xl sm:text-2xl font-black text-white drop-shadow-[0_2px_10px_rgba(249,115,22,1)] transition-transform duration-300">
                  {scoreTeam2 < 10 ? `0${scoreTeam2}` : scoreTeam2}
                </span>
              </div>
            </div>

            {/* Traditional House Icon (Rumah Adat / Tongkonan / Gadang) */}
            <div className="w-9 h-8 sm:w-10 sm:h-9 shrink-0 flex items-center justify-center anim-boat-bob">
              <svg viewBox="0 0 60 40" className="w-full h-full drop-shadow-md">
                <path
                  d="M 6,10 Q 30,22 54,10 L 46,20 Q 30,16 14,20 Z"
                  fill="#ea580c"
                  stroke="#fde047"
                  strokeWidth="1.5"
                />
                <path d="M 12,18 L 48,18 L 44,28 L 16,28 Z" fill="#9a3412" stroke="#fbbf24" strokeWidth="1" />
                <line x1="20" y1="28" x2="20" y2="36" stroke="#fde047" strokeWidth="2" />
                <line x1="30" y1="28" x2="30" y2="36" stroke="#fde047" strokeWidth="2" />
                <line x1="40" y1="28" x2="40" y2="36" stroke="#fde047" strokeWidth="2" />
                <line x1="14" y1="36" x2="46" y2="36" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            {/* +10 Popup Floating Notification */}
            {scorePopup?.team === 2 && (
              <div className="absolute -top-7 left-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-xs shadow-2xl anim-score-float border-2 border-white whitespace-nowrap z-50">
                +10 POIN ✨
              </div>
            )}
          </div>

          {/* Sound Toggle (Amber circle matching screenshot) */}
          <button
            onClick={handleToggleSound}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black shadow-lg border-2 border-white flex items-center justify-center transition-all cursor-pointer"
            title={soundOn ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 fill-current" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Exit / Menu (Red circle with X matching screenshot) */}
          <button
            onClick={onBack}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-black shadow-lg border-2 border-white flex items-center justify-center transition-all cursor-pointer"
            title="Keluar ke Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. CENTER: GEOGRAPHICALLY ACCURATE RELIEF MAP ARENA                       */}
      {/* 100% Locked Coordinate System: Container aspect ratio = 1376 / 768        */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 min-h-0 w-full px-2 sm:px-4 flex items-center justify-center overflow-hidden my-0.5">
        <div
          ref={mapContainerRef}
          className={`relative max-w-full max-h-full aspect-[1376/768] rounded-3xl overflow-hidden border-2 sm:border-3 border-cyan-400/50 bg-[#07192f] shadow-[0_15px_60px_rgba(0,0,0,0.95)] flex items-center justify-center transition-all duration-700 ${
            isAllCompleted ? 'ring-8 ring-amber-400/80 shadow-[0_0_80px_rgba(251,191,36,0.6)]' : ''
          }`}
          style={{
            width: 'min(100%, calc((100vh - 225px) * 1376 / 768))',
            height: 'min(100%, calc(100vw * 768 / 1376))',
          }}
        >
          {/* Authentic Real Geographic Relief Map of Indonesia (Zero letterboxing) */}
          <img
            src={petaAsliImg}
            alt="Peta Asli Indonesia Lengkap"
            referrerPolicy="no-referrer"
            className="w-full h-full object-fill pointer-events-none filter saturate-[1.22] contrast-[1.12]"
          />

          {/* Ocean depth subtle atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20 pointer-events-none" />

          {/* Living Environment: Gentle Clouds */}
          <div className="absolute top-[12%] left-0 w-64 h-24 bg-white/20 blur-xl rounded-full pointer-events-none anim-cloud-1" />
          <div className="absolute top-[38%] left-0 w-80 h-28 bg-cyan-100/15 blur-2xl rounded-full pointer-events-none anim-cloud-2" />

          {/* Living Environment: Gliding Sea Birds */}
          <div className="absolute top-[68%] left-0 pointer-events-none z-15 anim-bird-glide text-xs text-white/70 select-none">
            🕊️
          </div>
          <div
            className="absolute top-[28%] left-0 pointer-events-none z-15 anim-bird-glide text-xs text-white/60 select-none"
            style={{ animationDelay: '18s' }}
          >
            🕊️
          </div>

          {/* Adventure Ships (Kapal Phinisi Kecil) */}
          <div
            className="absolute left-[34%] top-[48%] pointer-events-none z-15 anim-boat-bob select-none opacity-85"
            title="Kapal Phinisi Nusantara"
          >
            <div className="w-6 h-5">
              <svg viewBox="0 0 60 40" className="w-full h-full drop-shadow">
                <path d="M 6,24 Q 30,34 54,24 L 46,33 Q 30,36 12,33 Z" fill="#78350f" stroke="#fde047" strokeWidth="1" />
                <line x1="24" y1="8" x2="24" y2="25" stroke="#fef08a" strokeWidth="1.5" />
                <path d="M 24,9 L 14,20 L 24,20 Z" fill="#ffffff" opacity="0.9" />
                <path d="M 24,10 L 34,20 L 24,20 Z" fill="#38bdf8" opacity="0.9" />
              </svg>
            </div>
          </div>

          <div
            className="absolute left-[70%] top-[56%] pointer-events-none z-15 anim-boat-bob select-none opacity-80"
            style={{ animationDelay: '1.8s' }}
            title="Perahu Nelayan Tradisional"
          >
            <div className="w-5 h-4">
              <svg viewBox="0 0 60 40" className="w-full h-full drop-shadow">
                <path d="M 6,24 Q 30,34 54,24 L 46,33 Q 30,36 12,33 Z" fill="#9a3412" stroke="#fbbf24" strokeWidth="1" />
                <line x1="30" y1="8" x2="30" y2="25" stroke="#fef08a" strokeWidth="1.5" />
                <path d="M 30,9 L 40,20 L 30,20 Z" fill="#f97316" opacity="0.9" />
              </svg>
            </div>
          </div>

          {/* Antique Parchment Scroll Badge: KARTU TERPASANG */}
          <div className="absolute top-3 right-4 z-30 pointer-events-none select-none">
            <div className="relative flex flex-col items-center justify-center px-4 py-1.5 sm:py-2 bg-gradient-to-b from-[#fef3c7] via-[#fde68a] to-[#d97706] rounded-xl border-2 border-[#b45309] shadow-[0_8px_25px_rgba(0,0,0,0.85)]">
              <div className="absolute -top-1.5 inset-x-2 h-2 bg-[#92400e] rounded-full border border-[#fde68a]" />
              <div className="absolute -bottom-1.5 inset-x-2 h-2 bg-[#92400e] rounded-full border border-[#fde68a]" />
              <span className="text-[9px] sm:text-[10px] font-black text-[#78350f] uppercase tracking-wider">
                KARTU TERPASANG
              </span>
              <div className="font-mono text-xl sm:text-2xl font-black text-[#451a03] leading-none mt-0.5">
                {currentScore} / {PETA_CULTURE_CARDS.length}
              </div>
            </div>
          </div>

          {/* Golden Nautical Compass Rose (U, B, T, S) */}
          <div className="absolute top-20 right-8 pointer-events-none z-20 flex flex-col items-center opacity-85">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <span className="absolute -top-2.5 font-bold font-mono text-[11px] text-amber-300">U</span>
              <span className="absolute -bottom-2.5 font-bold font-mono text-[11px] text-amber-300">S</span>
              <span className="absolute -left-2.5 font-bold font-mono text-[11px] text-amber-300">B</span>
              <span className="absolute -right-2.5 font-bold font-mono text-[11px] text-amber-300">T</span>

              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                <circle cx="50" cy="50" r="32" stroke="#fde047" strokeWidth="1.5" fill="none" opacity="0.6" />
                <polygon points="50,12 55,45 88,50 55,55 50,88 45,55 12,50 45,45" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                <polygon points="50,12 50,50 45,45" fill="#fef08a" />
                <polygon points="88,50 50,50 55,45" fill="#fef08a" />
                <polygon points="50,88 50,50 55,55" fill="#ca8a04" />
                <polygon points="12,50 50,50 45,55" fill="#ca8a04" />
                <circle cx="50" cy="50" r="4" fill="#78350f" stroke="#fde047" strokeWidth="1" />
              </svg>
            </div>
          </div>

          {/* Ocean Labels */}
          <div className="absolute inset-0 pointer-events-none z-15 font-sans font-black tracking-widest text-[9px] sm:text-[10px] text-cyan-200/60 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            <span className="absolute left-[31%] top-[21%]">LAUT CINA SELATAN</span>
            <span className="absolute left-[63%] top-[29%]">LAUT SULAWESI</span>
            <span className="absolute left-[82%] top-[32%] text-sky-200/75">SAMUDERA PASIFIK</span>
            <span className="absolute left-[68%] top-[54%]">LAUT BANDA</span>
            <span className="absolute left-[83%] top-[66%]">LAUT ARAFURA</span>
            <span className="absolute left-[67%] top-[72%]">LAUT TIMOR</span>
            <span className="absolute left-[13%] top-[62%] text-sky-200/75">SAMUDERA HINDIA</span>
          </div>

          {/* Floating Compact Feedback Toast */}
          {feedback && (
            <div
              className={`absolute top-4 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-2xl font-black flex items-center gap-2.5 shadow-2xl backdrop-blur-md border animate-bounce-subtle ${
                feedback.type === 'success'
                  ? 'bg-emerald-600/95 border-emerald-300 text-white shadow-[0_0_30px_rgba(16,185,129,0.9)]'
                  : 'bg-amber-500/95 border-amber-300 text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.9)]'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-slate-950" />
              )}
              <div className="flex flex-col text-left">
                <span className="tracking-wide text-xs sm:text-sm font-black">{feedback.text}</span>
                {feedback.subtext && (
                  <span className="text-[10px] font-bold opacity-90">{feedback.subtext}</span>
                )}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* 8 GEOGRAPHICALLY PRECISE MARKERS WITH SEPARATED ANCHOR & LABEL    */}
          {/* Central Anchor Dot = 100% on the Island Land                      */}
          {/* Label + Stem = Positioned to not obscure the island               */}
          {/* ================================================================= */}
          {ACCURATE_REGIONS.map((region) => {
            const matchedCard = matchedPairs[region.id];
            const isHovered = hoveredRegionId === region.id;
            const isTargetOfCurrentCard = draggingCard && draggingCard.targetRegionId === region.id;

            // Proximity calculation for intelligent target guidance
            let isClose = false;
            let isVeryClose = false;
            if (isTargetOfCurrentCard && dragPointerPos) {
              const dist = getDistanceToRegion(region.id, dragPointerPos.x, dragPointerPos.y);
              if (dist < 55) {
                isVeryClose = true;
              } else if (dist < 140) {
                isClose = true;
              }
            }

            return (
              <div
                key={region.id}
                className="absolute pointer-events-none select-none z-30"
                style={{ left: `${region.cx}%`, top: `${region.cy}%` }}
              >
                {/* ========================================================= */}
                {/* 1. TITIK TARGET GEOGRAFIS (ANCHOR BEACON ON REAL LAND)     */}
                {/* Collision detection targets this exact geographic point!  */}
                {/* ========================================================= */}
                <div
                  ref={(el) => {
                    dropZoneRefs.current[region.id] = el;
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center justify-center cursor-pointer"
                  style={{ width: '38px', height: '38px' }}
                >
                  {/* Radiant halo when this region is the active target */}
                  {isTargetOfCurrentCard && !matchedCard && (
                    <div
                      className={`absolute rounded-full transition-all duration-300 pointer-events-none ${
                        isVeryClose
                          ? 'w-16 h-16 animate-ping opacity-95'
                          : isClose
                          ? 'w-12 h-12 animate-pulse opacity-85'
                          : 'w-9 h-9 animate-ping opacity-65'
                      }`}
                      style={{
                        backgroundColor: region.glow,
                        boxShadow: `0 0 25px ${region.color}`,
                      }}
                    />
                  )}

                  {/* Concentric outer ring */}
                  <div
                    className="absolute w-7 h-7 rounded-full border border-white/60 animate-ping opacity-40 pointer-events-none"
                    style={{ animationDuration: '3s' }}
                  />

                  {/* Center Geographic Anchor Point (● Titik Pusat Daratan) */}
                  <div
                    className={`relative w-4 h-4 rounded-full border-2 border-white shadow-2xl flex items-center justify-center anim-marker-pulse transition-all duration-200 ${
                      isTargetOfCurrentCard ? 'ring-4 ring-white animate-pulse scale-110' : ''
                    }`}
                    style={{
                      backgroundColor: region.color,
                      boxShadow: isTargetOfCurrentCard
                        ? `0 0 25px ${region.color}, 0 0 45px ${region.glow}`
                        : `0 0 16px ${region.color}, 0 0 30px ${region.glow}`,
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-inner" />
                  </div>
                </div>

                {/* ========================================================= */}
                {/* 2. LABEL NAMA WILAYAH & CONNECTOR STEM (SEPARATED)        */}
                {/* Positioned cleanly without blocking the island!           */}
                {/* ========================================================= */}
                {matchedCard ? (
                  /* ================= LOCKED MATCHED CULTURAL BADGE ================= */
                  <div className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/95 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.95)] text-white font-black text-xs sm:text-sm animate-scaleUp scale-105 z-40 whitespace-nowrap">
                    <img
                      src={matchedCard.image}
                      alt={matchedCard.name}
                      className="w-5 h-5 rounded-full object-cover border border-emerald-300"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] sm:text-xs font-black text-emerald-300 leading-tight">
                        {matchedCard.name}
                      </span>
                      <span className="text-[9px] text-slate-300 font-bold leading-none">
                        📍 {region.label}
                      </span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                ) : (
                  /* ================= UNMATCHED LABEL WITH CONNECTOR STEM ================= */
                  <>
                    {/* Glowing Connector Stem */}
                    {region.labelDirection === 'top' && (
                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-gradient-to-t from-white to-transparent pointer-events-none drop-shadow" />
                    )}
                    {region.labelDirection === 'bottom' && (
                      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[2px] h-3 bg-gradient-to-b from-white to-transparent pointer-events-none drop-shadow" />
                    )}
                    {region.labelDirection === 'left' && (
                      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 h-[2px] w-3.5 bg-gradient-to-l from-white to-transparent pointer-events-none drop-shadow" />
                    )}
                    {region.labelDirection === 'bottom-right' && (
                      <div className="absolute top-2 left-2 w-3.5 h-[2px] bg-gradient-to-r from-white to-transparent rotate-45 pointer-events-none drop-shadow" />
                    )}

                    {/* Region Label Badge Container */}
                    <div
                      className={`absolute pointer-events-none whitespace-nowrap transition-all duration-200 ${
                        region.labelDirection === 'top'
                          ? 'bottom-5 left-1/2 -translate-x-1/2'
                          : region.labelDirection === 'bottom'
                          ? 'top-5 left-1/2 -translate-x-1/2'
                          : region.labelDirection === 'left'
                          ? 'right-5 top-1/2 -translate-y-1/2'
                          : 'top-4 left-4'
                      }`}
                    >
                      <div
                        className={`px-2.5 py-0.5 rounded-full border shadow-2xl transition-all flex items-center gap-1 ${
                          isHovered || isVeryClose
                            ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-300 scale-110 shadow-[0_0_35px_rgba(251,191,36,1)]'
                            : isClose
                            ? 'bg-cyan-400 text-slate-950 border-white ring-2 ring-cyan-200 scale-105'
                            : isTargetOfCurrentCard
                            ? 'bg-slate-950/95 border-amber-300 text-amber-200 ring-2 ring-amber-400/60'
                            : 'bg-slate-950/90 border-white/40 text-white'
                        }`}
                        style={{
                          boxShadow: `0 4px 15px rgba(0,0,0,0.9)`,
                        }}
                      >
                        <span className="text-[10px] sm:text-xs font-black tracking-wider">
                          {isHovered || isVeryClose
                            ? `✨ LETAKKAN DI SINI! ✨`
                            : isClose
                            ? `DEKAT! ✨ ${region.label}`
                            : isTargetOfCurrentCard
                            ? `✨ TARGET: ${region.label} ✨`
                            : region.label}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. BOTTOM DOCK: WOODEN BAMBOO FRAME + 8 KARTU BUDAYA PARCHMENT CARDS     */}
      {/* ========================================================================= */}
      <footer className="relative z-30 w-full px-3 sm:px-6 pb-2 pt-1 shrink-0">
        <div className="relative bg-gradient-to-r from-[#451a03] via-[#78350f] to-[#451a03] p-2 rounded-2xl border-2 sm:border-3 border-[#d97706] shadow-[0_10px_40px_rgba(0,0,0,0.95)] flex flex-col gap-1 max-w-7xl mx-auto">
          {/* Corner Tropical Leaves Embellishments */}
          <div className="absolute -top-3 -left-3 text-2xl pointer-events-none drop-shadow">
            🌿
          </div>
          <div className="absolute -top-3 -right-3 text-2xl pointer-events-none drop-shadow">
            🌿
          </div>

          {/* 8 Cards in a clean, parchment-styled collectible horizontal row */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2">
            {PETA_CULTURE_CARDS.map((card) => {
              const isMatched = Object.values(matchedPairs).some((m) => m.id === card.id);
              const isBeingDragged = draggingCard?.id === card.id;

              return (
                <div
                  key={card.id}
                  onPointerDown={(e) => handlePointerDown(e, card)}
                  style={{ touchAction: 'none' }}
                  className={`group relative flex flex-col items-center justify-between p-1.5 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing select-none ${
                    isMatched
                      ? 'bg-[#fef3c7]/30 border-[#b45309]/30 opacity-30 cursor-not-allowed pointer-events-none'
                      : isBeingDragged
                      ? 'opacity-30 scale-95 border-amber-400'
                      : 'bg-gradient-to-b from-[#fef3c7] via-[#fffbeb] to-[#fde68a] hover:from-white hover:to-amber-100 text-[#451a03] border-[#d97706] hover:border-amber-300 hover:scale-[1.05] hover:-translate-y-1 shadow-md hover:shadow-xl active:scale-95'
                  }`}
                  title={isMatched ? 'Sudah terpasang di peta' : `Sentuh & seret ${card.name}`}
                >
                  {/* Photo thumbnail with rounded border */}
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-[#b45309]/30 mb-1 pointer-events-none">
                    <img
                      src={card.image}
                      alt={card.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {isMatched && (
                      <div className="absolute inset-0 bg-emerald-700/85 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Culture Name */}
                  <span className="font-black text-[10px] sm:text-[11px] leading-tight text-center truncate w-full pointer-events-none text-[#451a03] group-hover:text-amber-900">
                    {card.name}
                  </span>

                  {/* Label: Tahan & Seret */}
                  <span className="text-[9px] font-bold pointer-events-none text-[#92400e] flex items-center gap-0.5">
                    {isMatched ? '✓ Terpasang' : 'Tahan & Seret 👆'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 5. FLOATING DRAG GHOST (FOLLOWS FINGER / POINTER DURING DRAG)             */}
      {/* ========================================================================= */}
      {draggingCard && dragPointerPos && (
        <div
          className="fixed z-50 pointer-events-none select-none transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{
            left: `${dragPointerPos.x}px`,
            top: `${dragPointerPos.y}px`,
          }}
        >
          {/* Card Ghost with Golden Aura & Trail Effect */}
          <div className="relative">
            <div className="absolute -top-3 -right-3 text-amber-300 text-lg animate-ping">
              ✨
            </div>
            <div className="absolute -bottom-2 -left-2 text-yellow-300 text-base animate-pulse">
              💫
            </div>

            <div className="w-32 sm:w-36 p-2 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-black shadow-[0_20px_60px_rgba(0,0,0,0.95)] border-3 border-white scale-115 flex flex-col items-center gap-1 ring-4 ring-amber-300/80">
              <img
                src={draggingCard.image}
                alt={draggingCard.name}
                className="w-full h-16 sm:h-20 object-cover rounded-xl border border-slate-900/30"
              />
              <span className="text-xs sm:text-sm font-black text-center leading-tight text-slate-950">
                {draggingCard.name}
              </span>
              <span className="text-[9px] bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                CARI DAERAH ASALNYA! 🗺️
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. ALL 8 COMPLETED GRAND VICTORY MODAL                                    */}
      {/* ========================================================================= */}
      {isAllCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-3 border-amber-400 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-400 text-amber-300 flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <Trophy className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wide uppercase">
                🎉 PETUALANGAN NUSANTARA SELESAI!
              </h2>
              <p className="text-sm sm:text-base text-slate-200 font-bold leading-relaxed">
                “Hebat! Kalian telah menjelajahi berbagai tradisi dan budaya Indonesia.”
              </p>
            </div>

            {/* Battle Scores comparison */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto my-2">
              <div className="p-3 rounded-2xl bg-blue-950/80 border-2 border-blue-400 shadow-lg space-y-1">
                <span className="text-xs font-black text-blue-300 uppercase">KELOMPOK 1</span>
                <div className="text-3xl font-black text-white font-mono">⭐ {scoreTeam1} POIN</div>
              </div>

              <div className="p-3 rounded-2xl bg-orange-950/80 border-2 border-orange-400 shadow-lg space-y-1">
                <span className="text-xs font-black text-orange-300 uppercase">KELOMPOK 2</span>
                <div className="text-3xl font-black text-white font-mono">⭐ {scoreTeam2} POIN</div>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-cyan-200 font-bold bg-white/5 py-2 rounded-xl border border-white/10">
              KARTU TERPASANG: 8 / 8 • KERJA SAMA KELOMPOK LUAR BIASA!
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-sm border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>ULANGI PERMAINAN</span>
              </button>

              <button
                onClick={() => {
                  sounds.playFanfare();
                  onNext();
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm sm:text-base shadow-xl active:scale-95 transition-all cursor-pointer border-2 border-white flex items-center justify-center gap-2"
              >
                <span>LANJUT KE MANCING BUDAYA 🎣</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
