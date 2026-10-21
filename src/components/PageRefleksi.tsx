import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Heart,
  Compass,
  CheckCircle2,
  Users,
  Award,
  BookOpen,
  Send
} from 'lucide-react';
import { sounds } from '../utils/audio';

interface PageRefleksiProps {
  onBack: () => void;
  onRestart: () => void;
}

export const PageRefleksi: React.FC<PageRefleksiProps> = ({ onBack, onRestart }) => {
  const [selectedCommitments, setSelectedCommitments] = useState<string[]>([]);
  const [customNote, setCustomNote] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const commitmentOptions = [
    {
      id: 'c1',
      title: 'Menghargai Keberagaman Teman',
      desc: 'Tidak membeda-bedakan teman yang memiliki suku, logat bicara, atau tradisi yang berbeda di sekolah.',
      icon: '🤝',
    },
    {
      id: 'c2',
      title: 'Meneladani Kearifan Lokal',
      desc: 'Menerapkan nilai bijak Subak & Sasi dengan bergotong royong, hemat air, dan tidak merusak lingkungan.',
      icon: '🌱',
    },
    {
      id: 'c3',
      title: 'Bangga Mengenal Budaya Nusantara',
      desc: 'Mempelajari dan memperkenalkan tarian, rumah adat, serta tradisi luhur Indonesia kepada lingkungan sekitar.',
      icon: '🏛️',
    },
    {
      id: 'c4',
      title: 'Promosi Budaya di Era Digital',
      desc: 'Menggunakan media sosial secara bijak untuk menyebarkan konten positif tentang kekayaan budaya Indonesia.',
      icon: '📱',
    },
  ];

  const handleToggleCommitment = (id: string) => {
    sounds.playClick();
    setSelectedCommitments((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveReflection = () => {
    sounds.playFanfare();
    setIsSaved(true);
    try {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
      });
    } catch {}
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none px-3 sm:px-6 lg:px-8 py-2 md:py-3 text-white">
      {/* Header */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-1 max-w-4xl mx-auto shrink-0 pt-0.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 shadow-sm">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span className="text-xs sm:text-sm font-black tracking-wider uppercase">
            REFLEKSI & PENGUATAN PROFIL PELAJAR PANCASILA
          </span>
        </div>

        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-md">
            “Merajut Nilai Kearifan Nusantara dalam Diri Kita”
          </h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Pilihlah tekad dan komitmen nyata yang ingin kalian terapkan dalam kehidupan sehari-hari di sekolah dan masyarakat.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 min-h-0 my-auto flex flex-col justify-center max-w-5xl mx-auto w-full py-1 sm:py-2 overflow-hidden">
        {!isSaved ? (
          <div className="space-y-3">
            {/* 4 Commitment Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {commitmentOptions.map((opt) => {
                const isSelected = selectedCommitments.includes(opt.id);

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleToggleCommitment(opt.id)}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none flex items-start gap-3 active:scale-98 ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-[1.01]'
                        : 'bg-slate-900/80 border-white/20 hover:border-amber-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl shrink-0 p-1 bg-white/10 rounded-xl">
                      {opt.icon}
                    </span>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-black text-xs sm:text-sm text-white truncate">
                          {opt.title}
                        </h3>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-emerald-500 border-emerald-300 text-white'
                              : 'border-white/30'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Teacher / Class note box */}
            <div className="p-3 rounded-2xl bg-black/30 border border-white/15 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-cyan-200">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                <span>
                  <strong>Kesimpulan:</strong> Kebhinekaan Indonesia adalah anugerah luhur yang harus senantiasa kita rawat dengan gotong royong dan saling menghormati.
                </span>
              </div>

              <button
                onClick={handleSaveReflection}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-all cursor-pointer shrink-0"
              >
                Simpan Komitmen Kami ✓
              </button>
            </div>
          </div>
        ) : (
          /* Saved Celebration Screen */
          <div className="w-full max-w-xl mx-auto bg-slate-900/95 border-3 border-emerald-400 rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto">
              <Award className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-amber-300">
                KOMITMEN BUDAYA TERSIMPAN!
              </h2>
              <p className="text-sm sm:text-base text-slate-200">
                “Bhinneka Tunggal Ika — Berbeda-beda tetapi tetap satu jua.”
              </p>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-xs sm:text-sm text-emerald-200 font-medium">
              Kalian telah menuntaskan seluruh rangkaian pembelajaran interaktif: dari Tebak Budaya, Peta Nusantara, Kelompokkan Budaya, Battle Mancing Budaya, hingga Kuis Adaptif Mandiri dengan gemilang!
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsSaved(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-white/20 transition-all cursor-pointer"
              >
                Ubah Komitmen
              </button>

              <button
                onClick={() => {
                  sounds.playFanfare();
                  onRestart();
                }}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl transition-all cursor-pointer border-2 border-amber-200"
              >
                ↺ KEMBALI KE HALAMAN UTAMA
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="relative z-10 flex items-center justify-between pt-1 pb-0.5 max-w-5xl mx-auto w-full shrink-0">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-black text-xs sm:text-sm border border-white/20 shadow-md active:scale-95 transition-all cursor-pointer"
          title="Kembali ke Halaman Kuis Adaptif"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
          <span>← KUIS ADAPTIF</span>
        </button>

        <button
          onClick={() => {
            sounds.playFanfare();
            onRestart();
          }}
          className="group flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>↺ KE HALAMAN AWAL</span>
        </button>
      </div>
    </div>
  );
};
