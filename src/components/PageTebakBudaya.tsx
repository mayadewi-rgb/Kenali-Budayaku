import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  MapPin,
  HelpCircle,
  CheckCircle2,
  RotateCcw,
  MessageCircleQuestion,
  Volume2,
  Tag,
  BookOpen,
  Check
} from 'lucide-react';
import { TEBAK_BUDAYA_CARDS, REASON_OPTIONS, TebakBudayaCard } from '../data/tebakBudayaData';
import { sounds } from '../utils/audio';

interface PageTebakBudayaProps {
  onBack: () => void;
  onNext: () => void;
}

export const PageTebakBudaya: React.FC<PageTebakBudayaProps> = ({ onBack, onNext }) => {
  // Selected card for active modal/interaction
  const [activeCard, setActiveCard] = useState<TebakBudayaCard | null>(null);
  
  // Phase of active card interaction:
  // 'initial' | 'prompt' (shows "Menurutmu, budaya apakah ini? [SAYA TAHU] [LIHAT JAWABAN]") | 'know_verbal' | 'revealed'
  const [interactionPhase, setInteractionPhase] = useState<'prompt' | 'know_verbal' | 'revealed'>('prompt');
  
  // Selected reason for the thinking question
  const [selectedReasons, setSelectedReasons] = useState<Record<string, string>>({});

  // Track cards that have been revealed
  const [revealedCardIds, setRevealedCardIds] = useState<Set<string>>(new Set());

  // Handle touching one of the 4 cards
  const handleCardTouch = (card: TebakBudayaCard) => {
    sounds.playClick();
    setActiveCard(card);
    if (revealedCardIds.has(card.id)) {
      setInteractionPhase('revealed');
    } else {
      setInteractionPhase('prompt');
    }
  };

  // Student clicks "SAYA TAHU"
  const handleSayKnow = () => {
    sounds.playFanfare();
    setInteractionPhase('know_verbal');
  };

  // Student clicks "LIHAT JAWABAN"
  const handleRevealAnswer = () => {
    sounds.playReveal();
    if (activeCard) {
      const nextSet = new Set(revealedCardIds);
      nextSet.add(activeCard.id);
      setRevealedCardIds(nextSet);

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#06B6D4', '#EC4899', '#3B82F6'],
        });
      } catch {
        // Safe fallback
      }
    }
    setInteractionPhase('revealed');
  };

  // Student selects a reason for thinking question
  const handleSelectReason = (reason: string) => {
    if (!activeCard) return;
    sounds.playClick();
    setSelectedReasons((prev) => ({
      ...prev,
      [activeCard.id]: reason,
    }));
  };

  // Student clicks "COBA YANG LAIN"
  const handleTryAnother = () => {
    sounds.playClick();
    setActiveCard(null);
    setInteractionPhase('prompt');
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none px-3 sm:px-6 lg:px-8 py-2 md:py-3 text-white">
      {/* TOP HEADER: Minimal & Compact (Giving maximum space to photos) */}
      <div className="relative z-10 flex flex-col items-center text-center shrink-0 pt-0.5 pb-0.5">
        <div className="flex items-center justify-center gap-2.5">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-md">
            TEBAK BUDAYA!
          </h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs sm:text-sm font-black shadow-sm">
            {revealedCardIds.size} / 4 TELAH DITEBAK
          </span>
        </div>
        <p className="text-xs sm:text-sm font-medium text-slate-300 drop-shadow-sm mt-0.5">
          “Sentuh gambar, lalu tebak budayanya.”
        </p>
      </div>

      {/* CENTER: 4 ENLARGED PICTURE CARDS IN 2 × 2 GRID (FOTO MEMENUHI KARTU, NO TOOLTIPS) */}
      <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center p-1 sm:p-2 overflow-hidden w-full">
        <div className="w-full max-w-5xl xl:max-w-6xl h-full max-h-[78vh] grid grid-cols-2 grid-rows-2 gap-4 sm:gap-5 md:gap-6 mx-auto px-2">
          {TEBAK_BUDAYA_CARDS.map((card) => {
            const isRevealed = revealedCardIds.has(card.id);
            const isSelected = activeCard?.id === card.id;

            return (
              <div
                key={card.id}
                onClick={() => handleCardTouch(card)}
                className={`group relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer border-3 sm:border-4 transition-all duration-300 transform active:scale-98 shadow-xl flex items-center justify-center bg-slate-950 ${
                  isSelected
                    ? 'border-amber-400 ring-4 ring-amber-300/50 scale-[1.01] shadow-[0_10px_35px_rgba(245,158,11,0.5)]'
                    : isRevealed
                    ? 'border-emerald-400 shadow-[0_8px_25px_rgba(16,185,129,0.35)] hover:border-emerald-300'
                    : 'border-white/25 hover:border-cyan-300 hover:shadow-[0_10px_30px_rgba(6,182,212,0.35)]'
                }`}
              >
                {/* Layer 1: Ambient Blurred Background from the culture image */}
                <div className="absolute inset-0 bg-slate-950 overflow-hidden pointer-events-none">
                  <img
                    src={card.image}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover blur-xl scale-110 opacity-35 group-hover:opacity-45 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-black/40" />
                </div>

                {/* Layer 2: Main Cultural Photo - FILLS ALMOST ENTIRE CARD, 100% UNCROPPED */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-2 sm:p-3 pointer-events-none">
                  <img
                    src={card.image}
                    alt={`Budaya Indonesia ${card.number}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain object-center drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-103"
                  />
                </div>

                {/* Layer 3: Small Number Badge (01, 02, 03, 04) - Pojok Kiri Atas */}
                <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-20 px-2.5 sm:px-3 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/25 text-white font-black text-xs sm:text-sm tracking-wider shadow-lg flex items-center gap-1.5 pointer-events-none">
                  <span className="text-amber-400 font-mono font-black">{card.number}</span>
                </div>

                {/* Layer 4: Small Check Badge if already revealed - Pojok Kanan Atas (Kecil, Tidak Menutupi Foto) */}
                {isRevealed && (
                  <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-20 px-2.5 py-1 rounded-xl bg-emerald-500/95 backdrop-blur-sm text-white font-black text-xs tracking-wider shadow-md flex items-center gap-1 pointer-events-none">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>✓ Sudah</span>
                  </div>
                )}

                {/* Layer 5: Touch Invitation Hint - Thin Translucent Overlay at Bottom */}
                <div className="absolute bottom-2 inset-x-2 sm:bottom-2.5 z-20 flex justify-center pointer-events-none">
                  <div className={`px-3.5 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md flex items-center gap-1.5 transition-colors ${
                    isRevealed
                      ? 'bg-emerald-950/75 border border-emerald-400/40 text-emerald-200'
                      : 'bg-slate-950/70 border border-white/20 text-cyan-200 group-hover:border-amber-400/80 group-hover:text-amber-300'
                  }`}>
                    {isRevealed ? (
                      <span>✓ Sudah Ditebak</span>
                    ) : (
                      <span>☝ Sentuh untuk Tebak</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM NAVIGATION: Sleek & Compact */}
      <div className="relative z-10 flex items-center justify-between pt-1 pb-1 w-full max-w-5xl xl:max-w-6xl mx-auto shrink-0 px-2">
        {/* Back Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="h-10 sm:h-11 px-5 sm:px-6 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-extrabold text-xs sm:text-sm border border-white/20 shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
          <span>← KEMBALI</span>
        </button>

        {/* Next Button: LANJUT → PETA BUDAYA */}
        <button
          onClick={() => {
            sounds.playFanfare();
            onNext();
          }}
          className="h-10 sm:h-11 px-6 sm:px-7 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 hover:from-cyan-300 hover:via-sky-400 hover:to-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-[0_4px_18px_rgba(14,165,233,0.4)] border border-cyan-200/80 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
        >
          <span>LANJUT → PETA BUDAYA</span>
          <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE OVERLAY / MODAL: AMATI → TEBAK → DISKUSIKAN → LIHAT JAWABAN */}
      {/* ========================================================================= */}
      {activeCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveCard(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-3 border-amber-400/80 rounded-3xl overflow-hidden shadow-2xl text-white select-none max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative aspect-[16/9] w-full max-h-[35vh] overflow-hidden bg-slate-950 shrink-0 flex items-center justify-center">
              {/* Blurred backdrop */}
              <img
                src={activeCard.image}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-lg scale-110 opacity-30 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30 pointer-events-none" />

              {/* Crisp uncropped cultural image */}
              <img
                src={activeCard.image}
                alt="Budaya Terpilih"
                referrerPolicy="no-referrer"
                className="relative z-10 w-full h-full object-contain p-2"
              />

              {/* Number Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/20 text-white font-black text-sm shadow-md">
                KARTU <span className="text-amber-400">{activeCard.number}</span>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setActiveCard(null)}
                className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-black/60 hover:bg-rose-600 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
                title="Tutup & Coba yang Lain"
              >
                ✕
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
              {/* STEP 1: INITIAL QUESTION ("Menurutmu, budaya apakah ini?") & DUA TOMBOL */}
              {interactionPhase === 'prompt' && (
                <div className="flex flex-col items-center text-center space-y-4 py-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center">
                    <MessageCircleQuestion className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      “Menurutmu, budaya apakah ini?”
                    </h2>
                    <p className="text-xs sm:text-sm text-cyan-200 font-medium">
                      Diskusikan sejenak dengan teman sebangku atau kelompokmu sebelum membuka rahasianya!
                    </p>
                  </div>

                  {/* DUA TOMBOL UTAMA: "SAYA TAHU" & "LIHAT JAWABAN" */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
                    {/* Tombol: SAYA TAHU */}
                    <button
                      onClick={handleSayKnow}
                      className="w-full flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-base shadow-lg active:scale-95 transition-all cursor-pointer border border-emerald-300/40"
                    >
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                      <span>SAYA TAHU</span>
                    </button>

                    {/* Tombol: LIHAT JAWABAN */}
                    <button
                      onClick={handleRevealAnswer}
                      className="w-full flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-base shadow-lg active:scale-95 transition-all cursor-pointer border border-amber-200"
                    >
                      <HelpCircle className="w-5 h-5 text-slate-950" />
                      <span>LIHAT JAWABAN</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 1.5: SAYA TAHU VERBAL DISCUSS PHASE */}
              {interactionPhase === 'know_verbal' && (
                <div className="flex flex-col items-center text-center space-y-4 py-2 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black text-emerald-300">
                      Hebat! Kamu Sudah Punya Dugaan!
                    </h3>
                    <p className="text-sm text-slate-200">
                      Sampaikan dugaanmu secara lisan kepada guru dan teman di kelas:
                    </p>
                    <div className="p-3 bg-white/10 rounded-xl border border-white/15 text-amber-300 font-extrabold text-sm sm:text-base">
                      “Sebutkan: Apa nama budayanya dan dari daerah mana?”
                    </div>
                  </div>

                  <button
                    onClick={handleRevealAnswer}
                    className="w-full max-w-sm flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-base shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    <span>COCOKKAN JAWABANKU SEKARANG ➜</span>
                  </button>
                </div>
              )}

              {/* STEP 2: REVEALED ANSWER PANEL + THINKING QUESTION */}
              {interactionPhase === 'revealed' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* INFORMATION PANEL */}
                  <div className="p-4 rounded-2xl bg-white/10 border-2 border-amber-400/60 space-y-2">
                    {/* Jenis Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
                      <Tag className="w-3 h-3" />
                      <span>JENIS: {activeCard.category}</span>
                    </div>

                    {/* NAMA BUDAYA */}
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide flex items-center gap-2">
                      <span>{activeCard.name}</span>
                      <Sparkles className="w-5 h-5 text-yellow-400 shrink-0" />
                    </h2>

                    {/* ASAL DAERAH */}
                    <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-sm sm:text-base">
                      <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Asal Daerah: {activeCard.region}</span>
                    </div>

                    {/* SATU FAKTA SINGKAT */}
                    <div className="mt-2 pt-2 border-t border-white/15 text-xs sm:text-sm text-slate-200 leading-relaxed bg-black/20 p-2.5 rounded-xl">
                      <strong className="text-amber-300 block mb-0.5">Fakta Budaya:</strong>
                      “{activeCard.shortFact}”
                    </div>
                  </div>

                  {/* TAMBAHKAN UNSUR BERPIKIR: PERTANYAAN PILIHAN ALASAN */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/90 border border-white/15 space-y-2.5">
                    <div className="space-y-0.5">
                      <div className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Unsur Berpikir Kritis Siswa</span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-white">
                        “Apa yang membuatmu yakin bahwa budaya ini berasal dari daerah tersebut?”
                      </p>
                    </div>

                    {/* 5 Pilihan Alasan Sederhana (Touch-friendly pada IFP) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {REASON_OPTIONS.map((option) => {
                        const isChosen = selectedReasons[activeCard.id] === option;
                        return (
                          <button
                            key={option}
                            onClick={() => handleSelectReason(option)}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer text-left ${
                              isChosen
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-2 border-emerald-300 shadow-md scale-[1.02]'
                                : 'bg-white/5 hover:bg-white/15 text-slate-200 border border-white/10'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                isChosen ? 'border-white bg-white text-emerald-600' : 'border-slate-400'
                              }`}>
                                {isChosen && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                              </span>
                              <span>{option}</span>
                            </span>
                            {isChosen && <Check className="w-4 h-4 text-white shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback if reason selected */}
                    {selectedReasons[activeCard.id] && (
                      <div className="text-[11px] sm:text-xs text-emerald-300 font-semibold flex items-center gap-1.5 pt-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Alasanmu tercatat! Pengamatan yang sangat jeli dan kritis. 👏</span>
                      </div>
                    )}
                  </div>

                  {/* TOMBOL: COBA YANG LAIN */}
                  <div className="pt-1 flex justify-center">
                    <button
                      onClick={handleTryAnother}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm sm:text-base transition-all cursor-pointer shadow-lg active:scale-95"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>COBA YANG LAIN</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
