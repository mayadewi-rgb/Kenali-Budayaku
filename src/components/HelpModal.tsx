import React from 'react';
import { X, Hand, Maximize, Volume2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-slate-900 border-2 border-white/20 rounded-3xl p-6 shadow-2xl text-white select-none space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center">
              <Hand className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Panduan Media Sentuh IFP</h2>
              <p className="text-xs text-cyan-300">Pendidikan Pancasila Kelas VII</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-sm">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xl">👆</span>
            <div>
              <strong className="text-white block font-bold">Interaksi Sentuh Jari (IFP)</strong>
              <p className="text-xs text-slate-300">
                Semua tombol dan kartu didesain ekstra besar agar nyaman disentuh langsung dengan jari atau stylus di depan kelas.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xl">🔍</span>
            <div>
              <strong className="text-white block font-bold">Permainan Tebak Budaya (Halaman 2)</strong>
              <p className="text-xs text-slate-300">
                Ajak siswa mengamati gambar terlebih dahulu. Sentuh kartu untuk memunculkan nama budaya, asal daerah, dan fakta kearifan lokal dengan efek suara gembira.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <Maximize className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold">Mode Layar Penuh (Fullscreen)</strong>
              <p className="text-xs text-slate-300">
                Tekan tombol ikon kotak di pojok kanan atas untuk mengaktifkan tampilan layar penuh 16:9 seperti slide presentasi profesional.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <Volume2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold">Efek Suara Edukatif</strong>
              <p className="text-xs text-slate-300">
                Dilengkapi nada audio sintesis untuk respon sentuh interaktif. Guru dapat menonaktifkan suara kapan saja dengan tombol Mute.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm transition-all cursor-pointer shadow-lg active:scale-98"
        >
          Siap Memulai Pembelajaran!
        </button>
      </div>
    </div>
  );
};
