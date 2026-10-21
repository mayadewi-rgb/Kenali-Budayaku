import React, { useState } from 'react';
import {
  Play,
  Sparkles,
  Compass,
  BookOpen,
  Target,
  X,
  Heart,
  ShieldCheck,
  Award,
  ChevronRight,
} from 'lucide-react';
import { sounds } from '../utils/audio';

// Background Panorama Petualangan Budaya Nusantara yang cinematic & hidup
import indonesiaAdventureBg from '../assets/images/indonesia_adventure_bg_1790528717820.jpg';

interface PageOpeningProps {
  onStart: () => void;
}

export const PageOpening: React.FC<PageOpeningProps> = ({ onStart }) => {
  const [showImtaqModal, setShowImtaqModal] = useState<boolean>(false);
  const [showTujuanModal, setShowTujuanModal] = useState<boolean>(false);

  const handleOpenImtaq = () => {
    sounds.playReveal();
    setShowImtaqModal(true);
  };

  const handleOpenTujuan = () => {
    sounds.playClick();
    setShowTujuanModal(true);
  };

  const handleStart = () => {
    sounds.playFanfare();
    onStart();
  };

  return (
    <div className="relative w-full h-full max-h-screen overflow-hidden select-none text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 box-border">
      {/* ========================================================
          BACKGROUND: SATU PANORAMA NUSANTARA CINEMATIC (HERO UTAMA)
          Menampilkan pemandangan megah Indonesia yang lapang & cerah
          ======================================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Foto Panorama Nusantara Cinematic */}
        <img
          src={indonesiaAdventureBg}
          alt="Panorama Alam dan Budaya Nusantara Indonesia"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-100"
        />

        {/* Gradasi Halus Atas (Melindungi keterbacaan teks judul & identitas) */}
        <div className="absolute inset-x-0 top-0 h-64 sm:h-72 bg-gradient-to-b from-[#020617]/85 via-[#020617]/40 to-transparent" />

        {/* Gradasi Halus Bawah (Melindungi keterbacaan tombol aksi di bawah) */}
        <div className="absolute inset-x-0 bottom-0 h-56 sm:h-64 bg-gradient-to-t from-[#020617]/90 via-[#020617]/45 to-transparent" />

        {/* Golden Horizon Glow Halus */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-36 bg-amber-400/10 blur-3xl pointer-events-none" />

        {/* Ornamen Lembut Batik Nusantara di Latar Belakang */}
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#fde047_1.2px,transparent_1.2px)] [background-size:32px_32px]" />
      </div>

      {/* ========================================================
          BAGIAN ATAS: IDENTITAS, JUDUL BESAR & SUBJUDUL
          Sempurna dalam Safe Area, bebas overflow, 2 baris tegas
          ======================================================== */}
      <header className="relative z-10 flex flex-col items-center text-center shrink-0 pt-1 sm:pt-3">
        {/* Identitas Pembelajaran, Bendera Merah Putih & Tagline */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          {/* Badge Kurikulum & Bendera Merah Putih */}
          <div className="inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-slate-950/75 border border-emerald-400/40 shadow-lg backdrop-blur-md">
            {/* Bendera Merah Putih Elegan */}
            <div className="w-5 h-3.5 rounded-xs overflow-hidden flex flex-col border border-white/40 shadow-sm shrink-0">
              <div className="h-1/2 bg-[#ef4444]" />
              <div className="h-1/2 bg-white" />
            </div>

            <span className="text-xs sm:text-sm font-black tracking-wider text-emerald-300 uppercase">
              Pendidikan Pancasila | Kelas VII
            </span>

            <span className="hidden sm:inline-block w-1 h-3 rounded bg-emerald-400/30" />

            <span className="hidden sm:inline-block text-[11px] font-black px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
              Kurikulum Merdeka
            </span>
          </div>

          {/* Tagline Elegan */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-slate-950/65 border border-white/20 text-amber-100 text-xs sm:text-sm font-bold backdrop-blur-md shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="tracking-wide">
              “Kenali • Pahami • Hargai • Lestarikan”
            </span>
          </div>
        </div>

        {/* Judul Besar: Maksimal 2 Baris, Sempurna di Safe Area */}
        <div className="w-full max-w-5xl px-3">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] drop-shadow-[0_6px_20px_rgba(0,0,0,0.9)]">
            {/* Baris 1: Golden Yellow */}
            <span className="block bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              KENALI BUDAYAKU,
            </span>
            {/* Baris 2: Putih / Cyan Terang */}
            <span className="block bg-gradient-to-r from-white via-cyan-100 to-sky-200 bg-clip-text text-transparent">
              HARGAI BUDAYAMU
            </span>
          </h1>
        </div>

        {/* Subjudul */}
        <div className="mt-2 sm:mt-2.5 flex items-center justify-center gap-3">
          <span className="h-[2px] w-6 sm:w-12 bg-gradient-to-r from-transparent to-amber-300/80" />
          <p className="text-xs sm:text-base md:text-lg lg:text-xl font-bold text-amber-100 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            Lestarilah Tradisi dan Budaya Lokal
          </p>
          <span className="h-[2px] w-6 sm:w-12 bg-gradient-to-l from-transparent to-amber-300/80" />
        </div>
      </header>

      {/* ========================================================
          BAGIAN TENGAH: RUANG LAPANG TOTAL (NEGATIVE SPACE)
          Memberi panggung 100% pada panorama alam & pulau Nusantara
          Panel box, kartu, teks deskripsi panjang telah dihapus total!
          ======================================================== */}
      <div className="relative z-10 flex-1 min-h-0 pointer-events-none" />

      {/* ========================================================
          BAGIAN BAWAH: 3 TOMBOL UTAMA (PROPORSI RAPI, LAPANG & TOUCH-FRIENDLY)
          1. Kiri: NILAI IMTAQ (Q.S. Al-Hujurat : 11)
          2. Tengah: MULAI JELAJAH BUDAYA (Hero Button Utama)
          3. Kanan: TUJUAN PEMBELAJARAN
          Tidak saling bertabrakan, tidak terpotong tepi layar.
          ======================================================== */}
      <footer className="relative z-10 shrink-0 pb-1 sm:pb-3 w-full max-w-6xl mx-auto px-2">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-6">
          {/* 1. TOMBOL NILAI IMTAQ (Kiri) */}
          <div className="w-full md:w-auto flex justify-center md:justify-start">
            <button
              onClick={handleOpenImtaq}
              className="group relative w-full sm:w-72 md:w-64 lg:w-72 flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 hover:bg-emerald-950/90 border-2 border-emerald-400/50 hover:border-emerald-300 shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:shadow-[0_10px_28px_rgba(16,185,129,0.4)] backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95 text-left"
              title="Buka Nilai Imtaq Q.S. Al-Hujurat Ayat 11"
            >
              {/* Ikon Al-Qur'an */}
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 font-black shadow-md shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              {/* Teks Informasi */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-emerald-300 uppercase">
                    Nilai Imtaq
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-400/30 text-emerald-100 font-bold">
                    Qur'ani
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-white truncate group-hover:text-emerald-200 transition-colors">
                  Q.S. Al-Hujurat : 11
                </div>
                <div className="text-[10px] sm:text-[11px] text-emerald-200/85 font-medium flex items-center gap-1">
                  <span>Sentuh untuk Membaca</span>
                  <ChevronRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>

          {/* 2. TOMBOL UTAMA: MULAI JELAJAH BUDAYA (Tengah - Heroic, Golden, Glowing) */}
          <div className="w-full md:w-auto flex justify-center shrink-0">
            <button
              onClick={handleStart}
              className="group relative flex items-center justify-center gap-3 sm:gap-4 px-8 sm:px-10 py-3.5 sm:py-4.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 hover:from-amber-300 hover:via-yellow-300 hover:to-orange-400 text-slate-950 font-black text-base sm:text-lg md:text-xl tracking-wider shadow-[0_10px_35px_rgba(245,158,11,0.6)] hover:shadow-[0_12px_45px_rgba(245,158,11,0.8)] border-3 sm:border-4 border-yellow-100 active:scale-95 transition-all duration-150 cursor-pointer"
              title="Mulai Jelajah Budaya Nusantara"
            >
              {/* Pulsing ring aura */}
              <span className="absolute -inset-1 rounded-full bg-amber-400/40 blur-md group-hover:bg-amber-300/60 transition-all pointer-events-none animate-pulse" />

              {/* Play Icon Badge */}
              <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950 text-amber-400 shadow-inner group-hover:scale-110 transition-transform shrink-0">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-400 ml-0.5" />
              </div>

              {/* Main Button Text */}
              <span className="relative drop-shadow-sm font-black whitespace-nowrap">
                MULAI JELAJAH BUDAYA
              </span>

              {/* Compass Icon */}
              <Compass className="relative w-5 h-5 sm:w-6 sm:h-6 text-slate-900 group-hover:rotate-45 transition-transform duration-300 shrink-0" />
            </button>
          </div>

          {/* 3. TOMBOL TUJUAN PEMBELAJARAN (Kanan) */}
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <button
              onClick={handleOpenTujuan}
              className="group relative w-full sm:w-72 md:w-64 lg:w-72 flex items-center gap-3 p-3 rounded-2xl bg-slate-950/80 hover:bg-sky-950/90 border-2 border-cyan-400/50 hover:border-cyan-300 shadow-[0_8px_24px_rgba(0,0,0,0.6)] hover:shadow-[0_10px_28px_rgba(14,165,233,0.4)] backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95 text-left"
              title="Buka Tujuan Pembelajaran Pendidikan Pancasila"
            >
              {/* Ikon Target */}
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 text-slate-950 font-black shadow-md shrink-0 group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>

              {/* Teks Informasi */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-cyan-300 uppercase">
                    Tujuan Belajar
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-400/30 text-cyan-100 font-bold">
                    Capaian
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-extrabold text-white truncate group-hover:text-cyan-200 transition-colors">
                  Tujuan Pembelajaran
                </div>
                <div className="text-[10px] sm:text-[11px] text-cyan-200/85 font-medium flex items-center gap-1">
                  <span>Sentuh untuk Melihat</span>
                  <ChevronRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </footer>

      {/* ========================================================
          MODAL 1: NILAI IMTAQ (Q.S. AL-HUJURAT AYAT 11)
          ======================================================== */}
      {showImtaqModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowImtaqModal(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#064e3b] via-[#042f2e] to-[#0f172a] border-3 border-emerald-400/70 shadow-[0_20px_60px_rgba(16,185,129,0.4)] p-5 sm:p-7 text-slate-100 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-emerald-400/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow-lg">
                  <BookOpen className="w-7 h-7 text-slate-950" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-black uppercase tracking-wider">
                    Nilai Imtaq & Budi Pekerti
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
                    Q.S. Al-Hujurat Ayat 11
                  </h2>
                </div>
              </div>

              {/* Tombol Tutup */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowImtaqModal(false);
                }}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-rose-500/80 hover:text-white flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
                title="Tutup Modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Konten Modal: Teks Arab Berharakat */}
            <div className="my-4 space-y-4">
              {/* Ayat Al-Qur'an Arab */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/70 border-2 border-emerald-400/40 text-center shadow-inner">
                <p
                  className="text-xl sm:text-2xl md:text-3xl text-amber-200 font-semibold leading-[2.2] tracking-wide select-text"
                  style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
                  dir="rtl"
                >
                  يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَسْخَرْ قَوْمٌ مِنْ قَوْمٍ عَسَىٰ أَنْ يَكُونُوا خَيْرًا مِنْهُمْ وَلَا نِسَاءٌ مِنْ نِسَاءٍ عَسَىٰ أَنْ يَكُنَّ خَيْرًا مِنْهُنَّ ۖ وَلَا تَلْمِزُوا أَنْفُسَكُمْ وَلَا تَنَابَزُوا بِالْأَلْقَابِ ۖ بِئْسَ الِاسْمُ الْفُسُوقُ بَعْدَ الْإِيمَانِ ۚ وَمَنْ لَمْ يَتُبْ فَأُولَٰئِكَ هُمُ الظَّالِمُونَ
                </p>
              </div>

              {/* Terjemahan Bahasa Indonesia */}
              <div className="p-4 rounded-2xl bg-black/30 border border-emerald-400/20">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Artinya:</span>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed italic">
                  “Wahai orang-orang yang beriman! Janganlah suatu kaum mengolok-olok kaum yang lain (karena) boleh jadi mereka (yang diperolok-olokkan) lebih baik dari mereka (yang mengolok-olok), dan jangan pula perempuan-perempuan (mengolok-olokkan) perempuan lain (karena) boleh jadi perempuan (yang diperolok-olokkan) lebih baik dari perempuan (yang mengolok-olok). Janganlah kamu saling mencela satu sama lain dan janganlah saling memanggil dengan gelar-gelar yang buruk. Seburuk-buruk panggilan adalah (panggilan) yang buruk (fasik) setelah beriman. Dan barangsiapa tidak bertobat, maka mereka itulah orang-orang yang zalim.”
                </p>
              </div>

              {/* Kandungan Nilai Pembelajaran */}
              <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-start gap-3">
                <Heart className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 fill-amber-400/20" />
                <div className="text-xs sm:text-sm text-amber-100 leading-relaxed">
                  <strong className="text-amber-300 block font-bold mb-0.5">
                    Nilai Karakter & Hubungan dengan Keragaman Budaya:
                  </strong>
                  Ayat ini mengajarkan kita untuk{' '}
                  <span className="font-bold text-amber-200">
                    tidak merendahkan, mengejek, atau mengolok-olok tradisi dan budaya suku lain
                  </span>. Setiap suku bangsa di Indonesia memiliki keistimewaan dan martabat luhur yang wajib kita hormati bersama.
                </div>
              </div>
            </div>

            {/* Footer Modal: Tombol Tutup Besar */}
            <div className="pt-2 border-t border-emerald-400/20 flex justify-end">
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowImtaqModal(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                ✕ TUTUP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL 2: TUJUAN PEMBELAJARAN (REVISI RUMUSAN CAPAIAN BARU)
          Latar biru navy gelap, panel & kartu biru gelap border biru toska
          ======================================================== */}
      {showTujuanModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowTujuanModal(false)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#041a2e] via-[#091e3a] to-[#020b18] border-3 border-cyan-400/75 shadow-[0_20px_60px_rgba(6,182,212,0.45)] p-5 sm:p-7 md:p-8 text-slate-100 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-cyan-400/40 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/30 shrink-0">
                  <Target className="w-7 h-7 sm:w-8 sm:h-8 text-slate-950" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-black uppercase tracking-wider border border-cyan-400/30">
                    Kurikulum Merdeka • Kelas VII
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-cyan-300 tracking-tight mt-0.5">
                    Tujuan Pembelajaran
                  </h2>
                </div>
              </div>

              {/* Tombol Tutup */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowTujuanModal(false);
                }}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 hover:bg-rose-500/80 hover:text-white flex items-center justify-center text-slate-300 transition-colors cursor-pointer shrink-0"
                title="Tutup Modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Kalimat Pengantar */}
            <div className="pt-4 pb-2">
              <p className="text-sm sm:text-base md:text-lg font-semibold text-cyan-100 leading-relaxed">
                Setelah mengikuti rangkaian aktivitas interaktif ini, murid diharapkan mampu:
              </p>
            </div>

            {/* Konten Modal: 3 Kartu Tujuan Pembelajaran (Simetris, Proporsional & Kontras Tinggi) */}
            <div className="my-2 space-y-3.5 sm:space-y-4">
              {/* KARTU 1 — MEMAHAMI KEBERAGAMAN BUDAYA */}
              <div className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-[#071e36]/90 border-2 border-cyan-400/50 hover:border-cyan-300 shadow-md shadow-cyan-950/50 transition-all">
                {/* Penanda Visual Angka 1 + Ikon Kompas / Peta */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 font-black text-lg sm:text-xl flex items-center justify-center shadow-md shadow-cyan-400/30">
                    1
                  </div>
                  <div className="mt-1.5 p-1 rounded-lg bg-cyan-400/10 text-cyan-300">
                    <Compass className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-black text-cyan-200 tracking-wide uppercase mb-1 flex items-center gap-2">
                    TUJUAN 1 — MEMAHAMI KEBERAGAMAN BUDAYA
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-slate-100 font-medium leading-relaxed">
                    Murid mampu memahami contoh tradisi, kearifan lokal, dan budaya daerah yang terdapat di lingkungan sekitar maupun di berbagai wilayah Indonesia.
                  </p>
                </div>
              </div>

              {/* KARTU 2 — MENGKLASIFIKASIKAN BUDAYA */}
              <div className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-[#071e36]/90 border-2 border-cyan-400/50 hover:border-cyan-300 shadow-md shadow-cyan-950/50 transition-all">
                {/* Penanda Visual Angka 2 + Ikon Kategori / Layer */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 text-slate-950 font-black text-lg sm:text-xl flex items-center justify-center shadow-md shadow-teal-400/30">
                    2
                  </div>
                  <div className="mt-1.5 p-1 rounded-lg bg-teal-400/10 text-teal-300">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-black text-cyan-200 tracking-wide uppercase mb-1 flex items-center gap-2">
                    TUJUAN 2 — MENGKLASIFIKASIKAN BUDAYA
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-slate-100 font-medium leading-relaxed">
                    Murid mampu mengklasifikasikan contoh budaya berdasarkan karakteristik tradisi, kearifan lokal, dan budaya daerah.
                  </p>
                </div>
              </div>

              {/* KARTU 3 — MEREFLEKSIKAN NILAI MENGHARGAI KEBERAGAMAN */}
              <div className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-[#071e36]/90 border-2 border-cyan-400/50 hover:border-cyan-300 shadow-md shadow-cyan-950/50 transition-all">
                {/* Penanda Visual Angka 3 + Ikon Hati / Imtaq */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 font-black text-lg sm:text-xl flex items-center justify-center shadow-md shadow-amber-400/30">
                    3
                  </div>
                  <div className="mt-1.5 p-1 rounded-lg bg-amber-400/10 text-amber-300">
                    <Heart className="w-4 h-4 fill-amber-300/30" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-black text-cyan-200 tracking-wide uppercase mb-1 flex items-center gap-2">
                    TUJUAN 3 — MEREFLEKSIKAN NILAI MENGHARGAI KEBERAGAMAN
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-slate-100 font-medium leading-relaxed">
                    Murid mampu merefleksikan pentingnya menghargai keberagaman budaya serta menghubungkannya dengan nilai Q.S. Al-Hujurat ayat 11.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Modal: Profil Pelajar Pancasila & Tombol Tutup */}
            <div className="pt-3 mt-2 border-t border-cyan-400/30 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-xs sm:text-sm text-cyan-200/90 flex items-center gap-2 font-medium">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
                <span>Dimensi Profil Pelajar Pancasila: Berkebinekaan Global & Berakhlak Mulia</span>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowTujuanModal(false);
                }}
                className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-cyan-500/25 transition-all cursor-pointer active:scale-95 text-center"
              >
                ✕ TUTUP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
