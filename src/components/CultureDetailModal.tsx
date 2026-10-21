import React from 'react';
import { X, MapPin, Sparkles, Award, ShieldCheck, CheckCircle } from 'lucide-react';
import { CultureItem } from '../data/cultures';
import { sounds } from '../utils/audio';

interface CultureDetailModalProps {
  item: CultureItem | null;
  onClose: () => void;
}

export const CultureDetailModal: React.FC<CultureDetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-slate-900 border-2 border-white/20 rounded-3xl overflow-hidden shadow-2xl text-white select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image with Scrim */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Close Button (Large IFP touch target) */}
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 w-12 h-12 rounded-2xl bg-black/60 hover:bg-rose-600 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
            title="Tutup Jendela"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 text-cyan-300 font-extrabold text-sm mb-1">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>{item.region}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white drop-shadow-md">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Requested Fact */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fakta Budaya</span>
            </div>
            <p className="text-base text-slate-100 font-semibold">
              “{item.shortFact}”
            </p>
          </div>

          {/* In-depth Context */}
          <div className="text-sm text-slate-300 leading-relaxed">
            {item.detailedFact}
          </div>

          {/* Pancasila & Character Values */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-800/80 border border-amber-400/30 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/40">
              <Award className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-black text-amber-300">
                Kaitan dengan Nilai Pancasila ({item.pancasilaSila})
              </div>
              <div className="text-sm font-bold text-white">
                {item.pancasilaValue}
              </div>
              <p className="text-xs text-slate-300">
                Mencerminkan jati diri bangsa yang beriman, berkeadilan, menjunjung persatuan, dan bersatu dalam gotong royong.
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mengerti & Kembali</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
