import React, { useState } from 'react';
import { Volume2, VolumeX, Maximize, Minimize, HelpCircle, Sparkles, Music } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderNavProps {
  currentPage: number;
  totalPages: number;
  onPageSelect: (page: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenHelp: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentPage,
  totalPages,
  onPageSelect,
  soundEnabled,
  onToggleSound,
  isFullscreen,
  onToggleFullscreen,
  onOpenHelp,
}) => {
  const [isMusicOn, setIsMusicOn] = useState<boolean>(sounds.isBgmPlaying);

  const handleToggleMusic = () => {
    sounds.playClick();
    const active = sounds.toggleBGM();
    setIsMusicOn(active);
  };

  const pageTitles = [
    'Pembuka',
    'Tebak Budaya',
    'Peta Budaya',
    'Diskusikan',
    'Mancing Budaya',
    'Kuis Adaptif',
    'Refleksi',
  ];

  return (
    <header className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-1.5 bg-slate-900/70 backdrop-blur-md border-b border-white/10 text-white select-none shrink-0">
      {/* Zone 1: Brand title & curriculum level */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center shadow-md shadow-amber-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-xs sm:text-sm tracking-wide text-white drop-shadow-sm flex items-center gap-2">
            KENALI BUDAYAKU, HARGAI BUDAYAMU
          </span>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-cyan-300 font-medium">
            <span>Pendidikan Pancasila</span>
            <span aria-hidden="true">·</span>
            <span>Kelas VII SMP</span>
          </div>
        </div>
      </div>

      {/* Zone 2: Slide Stepper / Slide Dots (Touch optimized for IFP) */}
      <nav className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-white/10 shadow-inner">
        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          const isActive = currentPage === pageNum;
          return (
            <button
              key={pageNum}
              onClick={() => {
                sounds.playClick();
                onPageSelect(pageNum);
              }}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white shadow-sm shadow-orange-500/25 scale-[1.02]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title={`Buka Halaman ${pageNum}: ${pageTitles[idx]}`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                isActive ? 'bg-white text-orange-600' : 'bg-white/20 text-slate-200'
              }`}>
                {pageNum}
              </span>
              <span className="hidden md:inline whitespace-nowrap">{pageTitles[idx]}</span>
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Interactive Flat Panel Tools (Sound, Fullscreen, Help) */}
      <div className="flex items-center gap-1.5">
        {/* Audio Sound Effects Toggle */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleSound();
          }}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
            soundEnabled
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
              : 'bg-slate-800 border-white/10 text-slate-400 hover:text-slate-200'
          }`}
          title={soundEnabled ? 'Matikan Efek Suara' : 'Nyalakan Efek Suara'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="text-[11px] hidden sm:inline">{soundEnabled ? 'Efek ON' : 'Mute'}</span>
        </button>

        {/* Background Music Toggle */}
        <button
          onClick={handleToggleMusic}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
            isMusicOn
              ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.6)] animate-pulse'
              : 'bg-slate-800 border-white/10 text-slate-400 hover:text-slate-200'
          }`}
          title={isMusicOn ? 'Matikan Musik Latar (BGM)' : 'Nyalakan Musik Latar (BGM)'}
        >
          <Music className={`w-4 h-4 ${isMusicOn ? 'text-slate-950' : ''}`} />
          <span className="text-[11px] hidden sm:inline">{isMusicOn ? 'Musik ON' : 'Musik OFF'}</span>
        </button>

        {/* Petunjuk Penggunaan */}
        <button
          onClick={() => {
            sounds.playClick();
            onOpenHelp();
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/30 transition-all cursor-pointer"
          title="Petunjuk Penggunaan Layar Sentuh IFP"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-[11px] hidden sm:inline">Panduan</span>
        </button>

        {/* Fullscreen Button for IFP */}
        <button
          onClick={() => {
            sounds.playClick();
            onToggleFullscreen();
          }}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-white/20 border border-white/15 text-white transition-all cursor-pointer"
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh IFP'}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
