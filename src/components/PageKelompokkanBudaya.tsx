import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Award,
  Layers,
  Check,
  BookOpen,
  Heart,
  MessageSquare,
  ShieldCheck,
  Users,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { PETA_CULTURE_CARDS, PetaCardItem } from '../data/petaBudayaData';
import { sounds } from '../utils/audio';

type CategoryType = 'Tradisi' | 'Kearifan Lokal' | 'Budaya Daerah';

interface CategoryBucket {
  id: CategoryType;
  title: string;
  badgeColor: string;
  borderColor: string;
  description: string;
  icon: string;
}

const CATEGORIES: CategoryBucket[] = [
  {
    id: 'Tradisi',
    title: 'TRADISI',
    badgeColor: 'from-amber-400 to-orange-500 text-slate-950',
    borderColor: 'border-amber-400',
    description: 'Kebiasaan atau perayaan turun-temurun yang dilestarikan oleh masyarakat.',
    icon: '🏮',
  },
  {
    id: 'Kearifan Lokal',
    title: 'KEARIFAN LOKAL',
    badgeColor: 'from-emerald-400 to-teal-500 text-slate-950',
    borderColor: 'border-emerald-400',
    description: 'Pandangan hidup & tata aturan bijak dalam menjaga kelestarian alam dan masyarakat.',
    icon: '🌱',
  },
  {
    id: 'Budaya Daerah',
    title: 'BUDAYA DAERAH',
    badgeColor: 'from-cyan-400 to-blue-500 text-slate-950',
    borderColor: 'border-cyan-400',
    description: 'Karya seni, tarian, bahasa, dan arsitektur khas yang menjadi identitas suku bangsa.',
    icon: '🏛️',
  },
];

interface OptionAttitude {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
}

const ATTITUDE_OPTIONS: OptionAttitude[] = [
  {
    id: 'A',
    label: 'A',
    text: 'Ikut tertawa bersama teman',
    isCorrect: false,
    feedback: 'Belum tepat. Menertawakan budaya lain dapat melukai perasaan dan merendahkan kehormatan sesama anak bangsa.',
  },
  {
    id: 'B',
    label: 'B',
    text: 'Membiarkan saja tanpa peduli',
    isCorrect: false,
    feedback: 'Kurang tepat. Sikap acuh tak acuh membiarkan ejekan terus terjadi. Kita perlu bersikap peduli dan saling mengingatkan.',
  },
  {
    id: 'C',
    label: 'C',
    text: 'Menghargai dan memahami budaya tersebut',
    isCorrect: true,
    feedback: '✓ SIKAP YANG TEPAT! Kita perlu menghargai dan memahami budaya yang berbeda, bukan menertawakan atau merendahkannya.',
  },
  {
    id: 'D',
    label: 'D',
    text: 'Mengatakan budaya kita lebih baik',
    isCorrect: false,
    feedback: 'Belum tepat. Menganggap budaya sendiri paling unggul dapat memicu etnosentrisme sempit dan merusak persatuan bangsa.',
  },
];

const REASONS = [
  {
    id: 'r1',
    title: 'Keunikan Luhur',
    text: 'Setiap budaya nusantara memiliki nilai sejarah, kearifan leluhur, dan filosofi yang mulia.',
  },
  {
    id: 'r2',
    title: 'Bhinneka Tunggal Ika',
    text: 'Perbedaan tradisi justru memperkaya khazanah keindahan dan kekuatan bangsa Indonesia.',
  },
  {
    id: 'r3',
    title: 'Menjaga Kerukunan',
    text: 'Saling menghargai menumbuhkan rasa persaudaraan dan mencegah perpecahan antarsuku.',
  },
];

interface PageKelompokkanBudayaProps {
  onBack: () => void;
  onNext: () => void;
  onRestart: () => void;
}

export const PageKelompokkanBudaya: React.FC<PageKelompokkanBudayaProps> = ({
  onBack,
  onNext,
  onRestart,
}) => {
  // 3-Stage Workflow: 1. kelompokkan -> 2. diskusi_nilai -> 3. integrasi_imtaq
  const [currentStage, setCurrentStage] = useState<'kelompokkan' | 'diskusi_nilai' | 'integrasi_imtaq'>('kelompokkan');

  // Stage 1 State: Mapping cardId -> CategoryType
  const [categorizedCards, setCategorizedCards] = useState<Record<string, CategoryType>>({});
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);

  // Stage 2 State: Selected attitude & selected reason
  const [selectedAttitudeId, setSelectedAttitudeId] = useState<string | null>(null);
  const [selectedReasonId, setSelectedReasonId] = useState<string | null>(null);

  const selectedCard = PETA_CULTURE_CARDS.find((c) => c.id === selectedCardId);
  const isCompletedStage1 = Object.keys(categorizedCards).length === PETA_CULTURE_CARDS.length;

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, card: PetaCardItem) => {
    e.dataTransfer.setData('text/plain', card.id);
    setSelectedCardId(card.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, category: CategoryType) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain') || selectedCardId;
    if (!cardId) return;
    const card = PETA_CULTURE_CARDS.find((c) => c.id === cardId);
    if (!card) return;

    processPlacement(card, category);
  };

  const handleCardClick = (card: PetaCardItem) => {
    sounds.playClick();
    if (selectedCardId === card.id) {
      setSelectedCardId(null);
    } else {
      setSelectedCardId(card.id);
      setFeedback({
        text: `Sentuh salah satu kolom (Tradisi / Kearifan Lokal / Budaya Daerah) untuk menempatkan "${card.name}".`,
        isError: false,
      });
    }
  };

  const processPlacement = (card: PetaCardItem, category: CategoryType) => {
    if (card.category === category) {
      sounds.playReveal();
      const next = {
        ...categorizedCards,
        [card.id]: category,
      };
      setCategorizedCards(next);
      setSelectedCardId(null);
      setFeedback({
        text: `✓ BENAR! "${card.name}" merupakan bagian dari ${category}!`,
        isError: false,
      });

      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.6 },
        });
      } catch {}

      if (Object.keys(next).length === PETA_CULTURE_CARDS.length) {
        sounds.playFanfare();
        try {
          confetti({
            particleCount: 90,
            spread: 100,
            origin: { y: 0.5 },
          });
        } catch {}
      }
    } else {
      sounds.playClick();
      setFeedback({
        text: `BELUM TEPAT, COBA LAGI! Diskusikan sifat dan karakteristik dari "${card.name}".`,
        isError: true,
      });
    }
  };

  const handleSelectCategory = (category: CategoryType) => {
    if (!selectedCard) {
      sounds.playClick();
      setFeedback({
        text: 'Sentuh salah satu kartu budaya di bawah terlebih dahulu!',
        isError: false,
      });
      return;
    }
    processPlacement(selectedCard, category);
  };

  const handleResetStage1 = () => {
    sounds.playClick();
    setCategorizedCards({});
    setSelectedCardId(null);
    setFeedback(null);
  };

  const handleAttitudeSelect = (opt: OptionAttitude) => {
    sounds.playClick();
    setSelectedAttitudeId(opt.id);
    if (opt.isCorrect) {
      sounds.playReveal();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none px-3 sm:px-6 lg:px-8 py-2 md:py-3 text-white">
      {/* ========================================================
          TOP HEADER: JUDUL "DISKUSIKAN", SUBJUDUL & 3 TAHAP NAV
          ======================================================== */}
      <div className="relative z-10 flex flex-col items-center text-center shrink-0 pt-0.5 pb-1">
        {/* Main Title & Subtitle */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-md">
              DISKUSIKAN
            </h1>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
            <p className="text-xs sm:text-sm font-bold text-amber-200 drop-shadow-sm">
              “Kenali Budayanya, Pahami Nilainya, Hargai Perbedaannya”
            </p>
          </div>
        </div>

        {/* 3 Step Interactive Progress Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5">
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentStage('kelompokkan');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              currentStage === 'kelompokkan'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-102 ring-2 ring-amber-300/40'
                : isCompletedStage1
                ? 'bg-emerald-950/80 border border-emerald-400/50 text-emerald-300'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-950 text-amber-400 text-[10px] flex items-center justify-center font-black">
              1
            </span>
            <span>Tahap 1: Kelompokkan</span>
            {isCompletedStage1 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <span className="text-slate-500 font-bold">→</span>

          <button
            onClick={() => {
              sounds.playClick();
              setCurrentStage('diskusi_nilai');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              currentStage === 'diskusi_nilai'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-102 ring-2 ring-amber-300/40'
                : selectedAttitudeId === 'C'
                ? 'bg-emerald-950/80 border border-emerald-400/50 text-emerald-300'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-950 text-amber-400 text-[10px] flex items-center justify-center font-black">
              2
            </span>
            <span>Tahap 2: Diskusi Nilai</span>
            {selectedAttitudeId === 'C' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          <span className="text-slate-500 font-bold">→</span>

          <button
            onClick={() => {
              sounds.playClick();
              setCurrentStage('integrasi_imtaq');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
              currentStage === 'integrasi_imtaq'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-102 ring-2 ring-amber-300/40'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-950 text-amber-400 text-[10px] flex items-center justify-center font-black">
              3
            </span>
            <span>Tahap 3: Nilai Imtaq</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          TAHAP 1: KELOMPOKKAN BUDAYA ("MASUK KATEGORI MANA?")
          ======================================================== */}
      {currentStage === 'kelompokkan' && (
        <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-between py-1 overflow-hidden w-full max-w-6xl mx-auto">
          {/* Subheader Prompt & Counter */}
          <div className="flex items-center justify-between px-2 pb-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-black text-xs">
                MASUK KATEGORI MANA?
              </span>
              <p className="text-xs text-slate-200 hidden sm:inline">
                Tarik atau ketuk kartu budaya, lalu masukkan ke kolom yang tepat!
              </p>
            </div>
            <div className="text-xs font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-400/40 px-2.5 py-0.5 rounded-full">
              {Object.keys(categorizedCards).length} / {PETA_CULTURE_CARDS.length} Terkelompokkan
            </div>
          </div>

          {/* 3 Target Columns: Tradisi, Kearifan Lokal, Budaya Daerah */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 h-full max-h-[46vh] min-h-[220px]">
            {CATEGORIES.map((cat) => {
              const itemsInCat = PETA_CULTURE_CARDS.filter(
                (c) => categorizedCards[c.id] === cat.id
              );

              return (
                <div
                  key={cat.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, cat.id)}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`flex flex-col justify-between p-3 rounded-2xl md:rounded-3xl border-2 transition-all bg-slate-900/90 shadow-xl cursor-pointer ${
                    selectedCard
                      ? 'hover:scale-[1.02] border-amber-300 ring-2 ring-amber-300/40'
                      : `${cat.borderColor} border-white/20`
                  }`}
                >
                  {/* Column Header */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cat.icon}</span>
                        <h2 className="text-sm sm:text-base font-black text-white">
                          {cat.title}
                        </h2>
                      </div>
                      <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-cyan-300 font-bold">
                        {itemsInCat.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                      {cat.description}
                    </p>
                  </div>

                  {/* Placed Items List in this category */}
                  <div className="my-2 flex-1 min-h-0 overflow-y-auto space-y-1.5 p-1.5 bg-black/25 rounded-xl border border-white/5">
                    {itemsInCat.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 p-1.5 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-xs"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <span className="truncate">{item.name}</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />
                      </div>
                    ))}

                    {itemsInCat.length === 0 && (
                      <div className="h-full flex items-center justify-center text-[11px] text-slate-400 italic">
                        Letakkan kartu di sini
                      </div>
                    )}
                  </div>

                  {/* Drop Target Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCategory(cat.id);
                    }}
                    className={`w-full py-1.5 rounded-xl text-xs font-black transition-all ${
                      selectedCard
                        ? 'bg-amber-400 text-slate-950 shadow-md animate-pulse cursor-pointer'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {selectedCard ? `Masukkan ke ${cat.title}` : `Kolom ${cat.title}`}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Feedback Banner */}
          <div className="w-full mt-2">
            {feedback ? (
              <div
                className={`p-2 rounded-xl text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border ${
                  feedback.isError
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-cyan-500/20 border-cyan-400/40 text-cyan-200'
                }`}
              >
                <span>{feedback.text}</span>
              </div>
            ) : (
              <div className="p-1.5 rounded-xl text-center text-xs text-slate-300 bg-white/5 border border-white/10">
                💡 <strong>Sentuh atau seret kartu</strong> di bawah ke kolom tujuan yang tepat!
              </div>
            )}
          </div>

          {/* Card Tray (Unplaced Cards with Drag and Drop) */}
          <div className="w-full mt-1.5">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 px-1">
              {PETA_CULTURE_CARDS.map((card) => {
                const isPlaced = !!categorizedCards[card.id];
                const isSelected = selectedCardId === card.id;

                return (
                  <div
                    key={card.id}
                    draggable={!isPlaced}
                    onDragStart={(e) => handleDragStart(e, card)}
                    onClick={() => !isPlaced && handleCardClick(card)}
                    className={`px-3 py-1.5 rounded-xl border-2 flex items-center gap-2 shrink-0 transition-all ${
                      isPlaced
                        ? 'bg-emerald-950/40 border-emerald-500/30 opacity-40 cursor-default'
                        : isSelected
                        ? 'bg-amber-400 text-slate-950 border-white ring-4 ring-amber-300 scale-105 cursor-pointer shadow-lg'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border-white/20 cursor-grab active:cursor-grabbing hover:scale-102'
                    }`}
                    title={isPlaced ? `${card.name} sudah dikelompokkan` : `Sentuh / Seret ${card.name}`}
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-md object-cover"
                    />
                    <span className="font-extrabold text-xs">{card.name}</span>
                    {isPlaced && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Completion Callout Banner if all placed */}
          {isCompletedStage1 && (
            <div className="mt-2 p-3 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-teal-900/90 to-slate-900/90 border-2 border-emerald-400 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-10 h-10 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center font-black shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-emerald-300">
                    Hebat! Seluruh Budaya Telah Dikelompokkan dengan Benar!
                  </h3>
                  <p className="text-xs text-slate-200">
                    Sekarang mari kita pikirkan bagaimana sikap kita terhadap budaya yang berbeda.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playFanfare();
                  setCurrentStage('diskusi_nilai');
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                LANJUT → DISKUSI NILAI ➜
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          TAHAP 2: DISKUSI NILAI & SIKAP
          ======================================================== */}
      {currentStage === 'diskusi_nilai' && (
        <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-between py-1 overflow-y-auto w-full max-w-5xl mx-auto">
          {/* Kasus Kontekstual Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border-2 border-cyan-400/50 shadow-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-black uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Kasus Nyata dalam Kehidupan</span>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-400/30 text-amber-200 font-extrabold text-sm sm:text-base leading-relaxed">
              “Kamu melihat budaya daerah lain yang belum pernah kamu kenal. Temanmu mengatakan budaya tersebut aneh dan menertawakannya.”
            </div>

            <h2 className="text-base sm:text-lg font-black text-white pt-1">
              Pertanyaan: <span className="text-amber-300">“Apa sikap yang sebaiknya kamu lakukan?”</span>
            </h2>
          </div>

          {/* 4 Pilihan Jawaban (A, B, C, D) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-2.5">
            {ATTITUDE_OPTIONS.map((opt) => {
              const isSelected = selectedAttitudeId === opt.id;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleAttitudeSelect(opt)}
                  className={`p-3 rounded-xl border-2 flex items-start gap-3 text-left transition-all cursor-pointer active:scale-98 ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-950/90 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                        : 'bg-rose-950/90 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                      : 'bg-slate-900/80 hover:bg-slate-800/90 border-white/20'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-rose-400 text-slate-950'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {opt.label}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-white">
                      {opt.text}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Hasil Pilihan Jawaban */}
          {selectedAttitudeId && (
            <div className="space-y-3 animate-fadeIn">
              {selectedAttitudeId === 'C' ? (
                /* Jawaban C (Benar) */
                <div className="p-3.5 rounded-2xl bg-emerald-950/80 border-2 border-emerald-400 text-left shadow-lg space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-black text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>✓ SIKAP YANG TEPAT</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    “Kita perlu menghargai dan memahami budaya yang berbeda, bukan menertawakan atau merendahkannya.”
                  </p>

                  {/* Pertanyaan Lanjutan: Mengapa kamu memilih sikap tersebut? */}
                  <div className="pt-2 border-t border-emerald-400/30">
                    <div className="text-xs font-black text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      <span>Mengapa kamu memilih sikap tersebut? (Diskusikan di Kelas):</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {REASONS.map((r) => {
                        const isReasonSelected = selectedReasonId === r.id;
                        return (
                          <div
                            key={r.id}
                            onClick={() => {
                              sounds.playClick();
                              setSelectedReasonId(r.id);
                            }}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                              isReasonSelected
                                ? 'bg-amber-400/20 border-amber-400 text-white shadow-md'
                                : 'bg-black/30 border-white/15 text-slate-300 hover:border-amber-300/50'
                            }`}
                          >
                            <div className="text-xs font-black text-amber-300 mb-0.5 flex items-center justify-between">
                              <span>{r.title}</span>
                              {isReasonSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                            </div>
                            <p className="text-[11px] leading-tight text-slate-200">
                              {r.text}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* Jawaban Salah (A, B, D) */
                <div className="p-3 rounded-2xl bg-rose-950/80 border-2 border-rose-400 text-left shadow-lg space-y-1">
                  <div className="flex items-center gap-2 text-rose-300 font-black text-sm">
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>BELUM TEPAT — MARI KITA PIKIRKAN LAGI</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200">
                    {ATTITUDE_OPTIONS.find((o) => o.id === selectedAttitudeId)?.feedback}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action button to Stage 3 */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                sounds.playFanfare();
                setCurrentStage('integrasi_imtaq');
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <span>LANJUT → INTEGRASI NILAI IMTAQ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          TAHAP 3: INTEGRASI NILAI IMTAQ (Q.S. AL-HUJURAT : 11)
          ======================================================== */}
      {currentStage === 'integrasi_imtaq' && (
        <div className="relative z-10 flex-1 min-h-0 flex flex-col justify-between py-1 overflow-y-auto w-full max-w-5xl mx-auto space-y-2">
          {/* Main Card Nilai Imtaq */}
          <div className="p-3.5 sm:p-4 rounded-3xl bg-gradient-to-b from-[#064e3b]/95 via-[#042f2e]/90 to-slate-950/95 border-3 border-emerald-400/70 shadow-2xl text-slate-100 space-y-2.5">
            {/* Header Imtaq */}
            <div className="flex items-center justify-between pb-2 border-b border-emerald-400/30">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-md">
                  <BookOpen className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs font-black text-emerald-300 uppercase tracking-wider">
                    Nilai Imtaq & Budi Pekerti
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-amber-300">
                    Q.S. AL-HUJURAT AYAT 11
                  </h2>
                </div>
              </div>

              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Pedoman Menghargai Keragaman</span>
              </div>
            </div>

            {/* Arabic Verse (Ayat Arab) */}
            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-400/40 text-center shadow-inner">
              <p
                className="text-lg sm:text-xl md:text-2xl text-amber-200 font-semibold leading-[2] tracking-wide select-text"
                style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
                dir="rtl"
              >
                يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَسْخَرْ قَوْمٌ مِنْ قَوْمٍ عَسَىٰ أَنْ يَكُونُوا خَيْرًا مِنْهُمْ وَلَا نِسَاءٌ مِنْ نِسَاءٍ عَسَىٰ أَنْ يَكُنَّ خَيْرًا مِنْهُنَّ ۖ وَلَا تَلْمِزُوا أَنْفُسَكُمْ وَلَا تَنَابَزُوا بِالْأَلْقَابِ ۖ بِئْسَ الِاسْمُ الْفُسُوقُ بَعْدَ الْإِيمَانِ ۚ وَمَنْ لَمْ يَتُبْ فَأُولَٰئِكَ هُمُ الظَّالِمُونَ
              </p>
            </div>

            {/* Terjemah Relevan */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-400/20 text-xs sm:text-sm text-slate-200 italic leading-relaxed text-center">
              “Janganlah suatu kaum mengolok-olok kaum yang lain, jangan saling mencela, dan jangan memanggil dengan gelar-gelar yang buruk.”
            </div>

            {/* 3 Kata Kunci Visual (Bold, Glowing Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-2xl bg-rose-950/70 border-2 border-rose-400/80 text-center shadow-md">
                <div className="text-xl mb-0.5">🚫</div>
                <div className="text-xs sm:text-sm font-black text-rose-300">
                  JANGAN MENGOLOK-OLOK
                </div>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  Menghindari ejekan pada upacara, tarian, atau bahasa daerah lain.
                </p>
              </div>

              <div className="p-2.5 rounded-2xl bg-amber-950/70 border-2 border-amber-400/80 text-center shadow-md">
                <div className="text-xl mb-0.5">🤝</div>
                <div className="text-xs sm:text-sm font-black text-amber-300">
                  JANGAN MERENDAHKAN
                </div>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  Mengakui martabat dan keistimewaan luhur setiap suku bangsa.
                </p>
              </div>

              <div className="p-2.5 rounded-2xl bg-emerald-950/70 border-2 border-emerald-400/80 text-center shadow-md">
                <div className="text-xl mb-0.5">💖</div>
                <div className="text-xs sm:text-sm font-black text-emerald-300">
                  SALING MENGHARGAI
                </div>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  Menjaga persaudaraan dalam bingkai Bhinneka Tunggal Ika.
                </p>
              </div>
            </div>

            {/* Pertanyaan Reflektif & Ruang Jawaban Lisan */}
            <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 uppercase">
                  <MessageSquare className="w-4 h-4" />
                  <span>Pertanyaan Refleksi Kelas:</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-100 font-bold">
                  “Bagaimana nilai Q.S. Al-Hujurat ayat 11 dapat kita terapkan ketika menemukan budaya yang berbeda?”
                </p>
                <p className="text-[11px] text-slate-300">
                  Sampaikan pendapatmu secara lisan kepada guru dan teman di depan kelas!
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shrink-0 shadow-md">
                <Sparkles className="w-4 h-4" />
                <span>Diskusi Lisan Kelas</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          BOTTOM NAVIGATION BAR (PROPOSIONAL & TOUCH FRIENDLY)
          ======================================================== */}
      <div className="relative z-10 flex items-center justify-between pt-1 pb-0.5 max-w-6xl mx-auto w-full shrink-0">
        {/* Tombol Kiri: Navigasi Mundur */}
        <button
          onClick={() => {
            sounds.playClick();
            if (currentStage === 'integrasi_imtaq') {
              setCurrentStage('diskusi_nilai');
            } else if (currentStage === 'diskusi_nilai') {
              setCurrentStage('kelompokkan');
            } else {
              onBack();
            }
          }}
          className="group flex items-center gap-2 px-5 py-2 sm:py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-extrabold text-xs sm:text-sm border border-white/20 shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
          <span>
            {currentStage === 'kelompokkan'
              ? '← PETA BUDAYA'
              : currentStage === 'diskusi_nilai'
              ? '← KELOMPOKKAN'
              : '← DISKUSI NILAI'}
          </span>
        </button>

        {/* Tombol Tengah: Reset (Hanya di Tahap 1) */}
        {currentStage === 'kelompokkan' && (
          <button
            onClick={handleResetStage1}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 border border-white/15 transition-all cursor-pointer active:scale-95"
            title="Ulangi Pengelompokan Budaya"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
            <span>Reset Kategori</span>
          </button>
        )}

        {/* Tombol Kanan: Navigasi Maju */}
        {currentStage === 'kelompokkan' ? (
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentStage('diskusi_nilai');
            }}
            className="group flex items-center gap-2 px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>TAHAP 2: DISKUSI NILAI</span>
            <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : currentStage === 'diskusi_nilai' ? (
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentStage('integrasi_imtaq');
            }}
            className="group flex items-center gap-2 px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>TAHAP 3: NILAI IMTAQ</span>
            <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <button
            onClick={() => {
              sounds.playFanfare();
              onNext();
            }}
            className="group flex items-center gap-2 px-6 sm:px-7 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg border border-yellow-200 active:scale-95 transition-all cursor-pointer"
            title="Lanjut ke Permainan Mancing Budaya"
          >
            <span>LANJUT → MANCING BUDAYA 🎣</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
};
