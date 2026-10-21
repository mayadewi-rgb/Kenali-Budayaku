import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Smartphone,
  ExternalLink,
  QrCode,
  Link as LinkIcon,
  KeyRound,
  Users,
  BarChart3,
  Download,
  Music,
  CheckCircle2,
  BookOpen,
  Info,
  Copy,
  Plus,
  Trash2,
  Layers,
  HelpCircle
} from 'lucide-react';
import {
  KUIS_5_TANTANGAN_BUDAYA,
  StudentResultRow
} from '../data/kuisAdaptifData';
import { sounds } from '../utils/audio';

interface PageKuisIndividuProps {
  onBack: () => void;
  onNextRefleksi?: () => void;
  onRestart: () => void;
}

type MainView = 'akses_hp' | 'rekap_hasil' | 'struktur_soal';

export const PageKuisIndividu: React.FC<PageKuisIndividuProps> = ({
  onBack,
  onNextRefleksi,
  onRestart,
}) => {
  // Current view tab
  const [currentView, setCurrentView] = useState<MainView>('akses_hp');

  // Input Link Kuis & PIN dari guru
  const [quizUrl, setQuizUrl] = useState<string>('');
  const [externalPin, setExternalPin] = useState<string>('');

  // QR Code State (hanya dibuat jika link kuis telah diisi oleh guru)
  const [qrCodeImg, setQrCodeImg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Background Music state
  const [isBgmOn, setIsBgmOn] = useState<boolean>(sounds.isBgmPlaying);

  // Tabel Rekap Hasil Belajar di Studio AI (dimulai kosong secara jujur)
  const [rekapRows, setRekapRows] = useState<StudentResultRow[]>([]);
  const [inputStudentName, setInputStudentName] = useState<string>('');
  const [inputStudentClass, setInputStudentClass] = useState<string>('VII A');
  const [inputStudentCorrect, setInputStudentCorrect] = useState<number>(5);
  const [inputStudentNote, setInputStudentNote] = useState<string>('Pemahaman sangat baik');

  // Generate QR Code HANYA jika guru sudah memasukkan URL
  useEffect(() => {
    const trimmed = quizUrl.trim();
    if (!trimmed) {
      setQrCodeImg(null);
      return;
    }

    try {
      const fullUrl =
        trimmed.startsWith('http://') || trimmed.startsWith('https://')
          ? trimmed
          : `https://${trimmed}`;

      QRCode.toDataURL(fullUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrCodeImg(url))
        .catch(() => setQrCodeImg(null));
    } catch {
      setQrCodeImg(null);
    }
  }, [quizUrl]);

  // Toggle Musik
  const handleToggleMusic = () => {
    sounds.playClick();
    const active = sounds.toggleBGM();
    setIsBgmOn(active);
  };

  // Salin Link Kuis
  const handleCopyLink = () => {
    if (!quizUrl.trim()) return;
    sounds.playClick();
    navigator.clipboard.writeText(quizUrl.trim());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Tambah baris rekap nilai secara manual oleh guru
  const handleAddRekapRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputStudentName.trim()) return;

    sounds.playClick();
    const newEntry: StudentResultRow = {
      id: `row-${Date.now()}`,
      no: rekapRows.length + 1,
      name: inputStudentName.trim(),
      kelas: inputStudentClass.trim() || 'VII A',
      correctCount: inputStudentCorrect,
      score: inputStudentCorrect * 20,
      catatan:
        inputStudentNote.trim() ||
        (inputStudentCorrect >= 4
          ? 'Pemahaman sangat baik'
          : inputStudentCorrect === 3
          ? 'Pemahaman baik'
          : 'Perlu penguatan konsep'),
    };

    setRekapRows((prev) => [...prev, newEntry]);
    setInputStudentName('');
  };

  // Hapus baris rekap
  const handleDeleteRow = (id: string) => {
    sounds.playClick();
    setRekapRows((prev) =>
      prev
        .filter((r) => r.id !== id)
        .map((r, idx) => ({ ...r, no: idx + 1 }))
    );
  };

  // Ekspor Rekap ke Berkas CSV Asli
  const handleExportCSV = () => {
    sounds.playClick();
    if (rekapRows.length === 0) return;

    const csvRows = [
      ['NO', 'NAMA', 'KELAS', 'BENAR', 'SKOR', 'CATATAN'],
      ...rekapRows.map((r) => [
        r.no,
        `"${r.name}"`,
        `"${r.kelas}"`,
        `${r.correctCount}/5`,
        r.score,
        `"${r.catatan}"`,
      ]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Rekap_Hasil_Belajar_Budaya_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFullUrl = () => {
    const trimmed = quizUrl.trim();
    if (!trimmed) return '#';
    return trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none px-2 sm:px-4 lg:px-6 py-1.5 md:py-2 text-white">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER                                                             */}
      {/* ========================================================================= */}
      <div className="relative z-30 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full shrink-0 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base md:text-lg font-black text-white tracking-wide">
                KUIS ADAPTIF — TANTANGAN BUDAYA INDONESIA
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] sm:text-[11px] font-bold border border-cyan-400/30">
                5 Soal Individual Bertahap
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-300 font-semibold hidden sm:block">
              “Studio AI sebagai Media Pembelajaran Utama • Platform Kuis sebagai Asesmen Individual”
            </p>
          </div>
        </div>

        {/* View Switcher & Audio Controls */}
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {/* Background Music Toggle */}
          <button
            onClick={handleToggleMusic}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              isBgmOn
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.6)] animate-pulse'
                : 'bg-white/5 text-slate-300 border-white/10 hover:text-white'
            }`}
            title="Nyalakan / Matikan Musik Latar (BGM)"
          >
            <Music className={`w-3.5 h-3.5 ${isBgmOn ? 'text-slate-950' : 'text-amber-400'}`} />
            <span>{isBgmOn ? 'Musik: ON 🎵' : 'Musik: OFF'}</span>
          </button>

          {/* Mode 1: Akses HP & Lobi */}
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentView('akses_hp');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              currentView === 'akses_hp'
                ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow'
                : 'bg-white/5 text-slate-300 border-white/10 hover:text-white'
            }`}
          >
            📱 Akses Kuis HP
          </button>

          {/* Rekap Hasil Belajar */}
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentView('rekap_hasil');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              currentView === 'rekap_hasil'
                ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow'
                : 'bg-white/5 text-slate-300 border-white/10 hover:text-white'
            }`}
          >
            📊 Rekap Hasil Belajar
          </button>

          {/* Struktur Soal */}
          <button
            onClick={() => {
              sounds.playClick();
              setCurrentView('struktur_soal');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              currentView === 'struktur_soal'
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow'
                : 'bg-white/5 text-slate-300 border-white/10 hover:text-white'
            }`}
          >
            📋 Struktur 5 Soal
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE                                                         */}
      {/* ========================================================================= */}
      <div className="relative z-10 flex-1 min-h-0 my-1 w-full max-w-7xl mx-auto overflow-hidden">
        {/* ======================================================================= */}
        {/* VIEW 1: MODE 1 — AKSES KUIS EKSTERNAL & LOBI PESERTA                    */}
        {/* ======================================================================= */}
        {currentView === 'akses_hp' && (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch animate-fadeIn">
            {/* SISI KIRI: KERJAKAN KUIS MELALUI HP */}
            <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl p-4 sm:p-5 border-2 border-white/20 shadow-2xl flex flex-col justify-between">
              {/* Header Bagian */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span>KERJAKAN KUIS MELALUI HP</span>
                  </span>
                  <span className="text-[11px] text-cyan-200 bg-white/10 px-2.5 py-0.5 rounded-full font-bold">
                    Mode 1 — Akses Eksternal
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  Tautan & PIN Kuis untuk Gawai Siswa
                </h2>
                <p className="text-xs text-slate-300">
                  Guru dapat memasukkan link dari Google Forms, Quizizz, Kahoot, atau sistem asesmen sekolah.
                </p>
              </div>

              {/* Form Input: LINK KUIS & PIN KUIS EKSTERNAL */}
              <div className="my-2 p-3 sm:p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                {/* 1. LINK KUIS */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>LINK KUIS:</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={quizUrl}
                      onChange={(e) => setQuizUrl(e.target.value)}
                      placeholder="Masukkan atau tempelkan link kuis eksternal..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/20 text-white font-bold text-xs focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                    />
                    {quizUrl.trim() && (
                      <button
                        onClick={handleCopyLink}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 flex items-center gap-1 transition-all cursor-pointer shrink-0"
                        title="Salin Link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isCopied ? 'Tersalin!' : 'Salin'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. PIN KUIS EKSTERNAL */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>PIN KUIS EKSTERNAL:</span>
                  </label>
                  <input
                    type="text"
                    value={externalPin}
                    onChange={(e) => setExternalPin(e.target.value)}
                    placeholder="Contoh: 123456"
                    className="w-full sm:w-64 px-3.5 py-2 rounded-xl bg-slate-950 border border-white/20 text-amber-300 font-mono font-black text-sm focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                  />
                  <p className="text-[10px] text-slate-400 italic pt-0.5">
                    * Masukkan PIN yang diberikan oleh platform kuis.
                  </p>
                </div>
              </div>

              {/* Area QR Code & Tombol Utama: BUKA KUIS DI HP */}
              <div className="p-3 sm:p-4 rounded-2xl bg-slate-950/70 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* QR Code Container */}
                <div className="flex items-center gap-3">
                  {qrCodeImg ? (
                    <div className="p-2 rounded-2xl bg-white shadow-xl shrink-0">
                      <img
                        src={qrCodeImg}
                        alt="QR Code Kuis Nyata"
                        className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900 border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-center p-2 text-slate-400 shrink-0">
                      <QrCode className="w-6 h-6 opacity-40 mb-1" />
                      <span className="text-[9px] font-bold text-amber-300 leading-tight">
                        Masukkan link kuis terlebih dahulu.
                      </span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="text-xs font-black">
                      {qrCodeImg ? (
                        <span className="text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>QR CODE AKTIF & DAPAT DIPINDAI</span>
                        </span>
                      ) : (
                        <span className="text-slate-300 font-bold">
                          QR Code Tidak Dibuat Sebelum URL Tersedia
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      QR Code di samping benar-benar memuat URL yang guru masukkan di atas. Kamera HP siswa akan langsung membuka kuis tanpa kesalahan ketik.
                    </p>
                    {externalPin.trim() && (
                      <div className="inline-block px-2.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-mono font-black text-xs border border-amber-400/40">
                        PIN KUIS: {externalPin}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tombol Utama: BUKA KUIS DI HP */}
                {quizUrl.trim() ? (
                  <a
                    href={getFullUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer border-2 border-amber-200 active:scale-95 shrink-0"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>📱 BUKA KUIS DI HP</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 text-slate-400 font-bold text-xs border border-white/10 cursor-not-allowed shrink-0"
                  >
                    📱 Masukkan Link Kuis Terlebih Dahulu
                  </button>
                )}
              </div>
            </div>

            {/* SISI KANAN: LOBI PESERTA & INTEGRASI TRANSPARAN */}
            <div className="lg:col-span-5 bg-slate-900/90 rounded-3xl p-4 sm:p-5 border-2 border-white/20 shadow-2xl flex flex-col justify-between">
              {/* Header Lobi */}
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>LOBI PESERTA</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Platform Eksternal</span>
                </div>
                <h3 className="text-base font-black text-white">
                  Status Kehadiran Siswa
                </h3>
              </div>

              {/* Status Transparan & Jujur (Tanpa Data Fiktif) */}
              <div className="my-auto p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/15 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center mx-auto">
                  <Users className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs sm:text-sm font-black text-amber-300 tracking-wide uppercase">
                    PESERTA AKAN TERLIHAT SETELAH BERGABUNG DI PLATFORM KUIS.
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                    Daftar peserta dikelola oleh platform kuis eksternal.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300 flex items-start gap-2 text-left leading-relaxed">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    Studio AI berfungsi sebagai <strong>media pembelajaran utama</strong> di layar IFP, sedangkan platform kuis berfungsi sebagai <strong>asesmen individual</strong>.
                  </span>
                </div>
              </div>

              {/* Tombol: LIHAT HASIL KUIS */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                {quizUrl.trim() ? (
                  <a
                    href={getFullUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>📊 LIHAT HASIL KUIS DI PLATFORM</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    onClick={() => setCurrentView('rekap_hasil')}
                    className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-black text-xs sm:text-sm border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <span>📊 Buka Rekap Hasil Belajar di Studio AI</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* VIEW 2: REKAP HASIL BELAJAR (NO | NAMA | KELAS | BENAR | SKOR | CATATAN) */}
        {/* ======================================================================= */}
        {currentView === 'rekap_hasil' && (
          <div className="h-full bg-slate-900/90 rounded-3xl p-4 sm:p-5 border-2 border-white/20 shadow-2xl flex flex-col justify-between overflow-hidden animate-fadeIn">
            {/* Header Rekap */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pb-2 border-b border-white/10 shrink-0">
              <div>
                <h2 className="text-base sm:text-lg font-black text-amber-300">
                  REKAP HASIL BELAJAR
                </h2>
                <p className="text-xs text-slate-300">
                  Pencatatan capaian kuis individual siswa dari platform eksternal atau penilaian guru.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {quizUrl.trim() && (
                  <a
                    href={getFullUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Buka Platform Kuis</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <button
                  onClick={handleExportCSV}
                  disabled={rekapRows.length === 0}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    rekapRows.length > 0
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer shadow'
                      : 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
                  }`}
                  title="Unduh Tabel Nilai ke File CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>⬇️ EKSPOR CSV</span>
                </button>
              </div>
            </div>

            {/* Form Catat Nilai Siswa (Input Cepat Guru) */}
            <form
              onSubmit={handleAddRekapRow}
              className="my-2 p-2.5 rounded-2xl bg-black/40 border border-white/10 grid grid-cols-1 sm:grid-cols-6 gap-2 items-center text-xs shrink-0"
            >
              <input
                type="text"
                required
                placeholder="Nama Siswa"
                value={inputStudentName}
                onChange={(e) => setInputStudentName(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/20 text-white font-bold text-xs focus:outline-none focus:border-amber-400"
              />
              <input
                type="text"
                placeholder="Kelas (VII A)"
                value={inputStudentClass}
                onChange={(e) => setInputStudentClass(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/20 text-white font-bold text-xs focus:outline-none focus:border-amber-400"
              />
              <div className="flex items-center gap-1">
                <span className="text-slate-400 font-bold">Benar:</span>
                <select
                  value={inputStudentCorrect}
                  onChange={(e) => setInputStudentCorrect(Number(e.target.value))}
                  className="px-2 py-1.5 rounded-xl bg-slate-950 border border-white/20 text-emerald-400 font-black text-xs focus:outline-none"
                >
                  <option value={5}>5 / 5 (100)</option>
                  <option value={4}>4 / 5 (80)</option>
                  <option value={3}>3 / 5 (60)</option>
                  <option value={2}>2 / 5 (40)</option>
                  <option value={1}>1 / 5 (20)</option>
                  <option value={0}>0 / 5 (0)</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Catatan Capaian"
                value={inputStudentNote}
                onChange={(e) => setInputStudentNote(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/20 text-white font-bold text-xs focus:outline-none focus:border-amber-400 sm:col-span-2"
              />
              <button
                type="submit"
                className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Catat Hasil</span>
              </button>
            </form>

            {/* Struktur Tabel: NO | NAMA | KELAS | BENAR | SKOR | CATATAN */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 my-1 border border-white/10 rounded-2xl bg-black/20">
              {rekapRows.length > 0 ? (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/15 bg-white/5 text-[11px] text-amber-300 uppercase sticky top-0">
                      <th className="py-2 px-3">NO</th>
                      <th className="py-2 px-3">NAMA</th>
                      <th className="py-2 px-3">KELAS</th>
                      <th className="py-2 px-3 text-center">BENAR</th>
                      <th className="py-2 px-3 text-center">SKOR</th>
                      <th className="py-2 px-3">CATATAN</th>
                      <th className="py-2 px-3 text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {rekapRows.map((row) => (
                      <tr key={row.id} className="hover:bg-white/5">
                        <td className="py-2 px-3 text-slate-400">{row.no}</td>
                        <td className="py-2 px-3 font-bold text-white">{row.name}</td>
                        <td className="py-2 px-3 text-slate-300">{row.kelas}</td>
                        <td className="py-2 px-3 text-center font-bold text-emerald-400">
                          {row.correctCount} / 5
                        </td>
                        <td className="py-2 px-3 text-center font-black text-amber-300">
                          {row.score}
                        </td>
                        <td className="py-2 px-3 text-cyan-200">{row.catatan}</td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => handleDeleteRow(row.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Hapus baris"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* Pesan Jujur Saat Belum Ada Data */
                <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-2 text-slate-400">
                  <BarChart3 className="w-10 h-10 opacity-30 text-amber-400" />
                  <p className="text-xs sm:text-sm font-semibold max-w-md">
                    “Data hasil akan muncul setelah kuis selesai dan hasil dari platform eksternal dimasukkan/dihubungkan.”
                  </p>
                  <span className="text-[11px] text-slate-500">
                    Gunakan tombol di atas untuk melihat rekap di platform kuis eksternal atau masukkan data nilai secara manual.
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Bar Rekap */}
            <div className="pt-2 border-t border-white/10 shrink-0 flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Total Peserta Tercatat: <strong>{rekapRows.length} Siswa</strong></span>
              <button
                onClick={() => setCurrentView('akses_hp')}
                className="text-cyan-300 hover:text-white underline text-xs cursor-pointer"
              >
                ← Kembali ke Pengaturan Akses Kuis HP
              </button>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* VIEW 3: STRUKTUR KUIS (5 TANTANGAN BUDAYA BERTAHAP)                    */}
        {/* ======================================================================= */}
        {currentView === 'struktur_soal' && (
          <div className="h-full bg-slate-900/90 rounded-3xl p-4 sm:p-5 border-2 border-white/20 shadow-2xl flex flex-col justify-between overflow-hidden animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
              <div>
                <h2 className="text-base sm:text-lg font-black text-amber-300">
                  STRUKTUR KUIS 5 TANTANGAN BUDAYA
                </h2>
                <p className="text-xs text-slate-300">
                  Materi: Tradisi, Kearifan Lokal, Budaya Daerah, Keberagaman Budaya Indonesia, dan Pelestarian Budaya.
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-400/40">
                Level Dasar → Menengah → Analisis
              </span>
            </div>

            {/* List 5 Soal */}
            <div className="flex-1 min-h-0 my-2 overflow-y-auto space-y-2.5 pr-1">
              {KUIS_5_TANTANGAN_BUDAYA.map((q) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-400">
                      TANTANGAN {q.number}: {q.topic}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10 text-cyan-200">
                      {q.level}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-white leading-relaxed">
                    “{q.question}”
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {q.options.map((opt) => (
                      <div
                        key={opt.label}
                        className={`p-2 rounded-xl border flex items-start gap-2 ${
                          opt.label === q.correctAnswer
                            ? 'bg-emerald-950/60 border-emerald-400/70 text-emerald-200 font-bold'
                            : 'bg-white/5 border-white/10 text-slate-300'
                        }`}
                      >
                        <span className="font-black text-xs">{opt.label}.</span>
                        <span className="text-[11px] leading-tight">{opt.text}</span>
                        {opt.label === q.correctAnswer && (
                          <span className="text-[10px] bg-emerald-500 text-slate-950 px-1.5 rounded font-black ml-auto shrink-0">
                            KUNCI
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-cyan-200/90 pt-1 border-t border-white/10 flex items-start gap-1.5">
                    <span className="font-bold shrink-0">Pembahasan:</span>
                    <span>{q.explanation}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Bar Soal */}
            <div className="pt-2 border-t border-white/10 shrink-0 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>5 Butir Soal Siap Digunakan di Google Form / Quizizz / Lembar Kerja</span>
              <button
                onClick={() => setCurrentView('akses_hp')}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all cursor-pointer"
              >
                Buka Pengaturan Akses HP ➜
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM NAVIGATION BAR                                                  */}
      {/* ========================================================================= */}
      <div className="relative z-30 flex items-center justify-between pt-1 pb-0 max-w-7xl mx-auto w-full shrink-0 px-1">
        <button
          onClick={() => {
            sounds.playClick();
            onBack();
          }}
          className="group flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-black text-xs sm:text-sm border border-white/20 shadow-md active:scale-95 transition-all cursor-pointer"
          title="Kembali ke Halaman Mancing Budaya"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-1 transition-transform" />
          <span>← MANCING BUDAYA</span>
        </button>

        {/* Center Information */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 font-semibold bg-white/5 px-4 py-1.5 rounded-xl border border-white/10">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Asesmen Individual Bertahap • Pendidikan Pancasila SMP Fase D</span>
        </div>

        {/* Next to Refleksi button */}
        {onNextRefleksi ? (
          <button
            onClick={() => {
              sounds.playFanfare();
              onNextRefleksi();
            }}
            className="group flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 hover:from-emerald-300 hover:to-cyan-500 text-white font-black text-xs sm:text-sm shadow-[0_6px_20px_rgba(16,185,129,0.4)] border border-emerald-200/80 active:scale-95 transition-all cursor-pointer"
            title="Lanjut ke Halaman Refleksi Pembelajaran"
          >
            <span>LANJUT → REFLEKSI 🌿</span>
            <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
          </button>
        ) : (
          <button
            onClick={() => {
              sounds.playFanfare();
              onRestart();
            }}
            className="group flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>↺ KE HALAMAN AWAL</span>
          </button>
        )}
      </div>
    </div>
  );
};
