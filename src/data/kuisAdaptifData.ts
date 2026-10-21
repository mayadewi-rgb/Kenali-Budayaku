export type DifficultyLevel = 'LEVEL 1 — DASAR' | 'LEVEL 2 — MENENGAH' | 'LEVEL 3 — ANALISIS';

export interface AdaptifQuestion {
  id: string;
  number: number;
  level: DifficultyLevel;
  topic: string;
  concept: string;
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string; // 'A' | 'B' | 'C' | 'D'
  explanation: string;
}

export interface StudentResultRow {
  id: string;
  no: number;
  name: string;
  kelas: string;
  correctCount: number;
  score: number;
  catatan: string;
}

// ---------------------------------------------------------------------------
// KUIS 5 TANTANGAN BUDAYA (STRUKTUR TINGKAT KESULITAN BERTAHAP)
// Materi: Tradisi, Kearifan Lokal, Budaya Daerah, Keberagaman & Pelestarian
// ---------------------------------------------------------------------------
export const KUIS_5_TANTANGAN_BUDAYA: AdaptifQuestion[] = [
  {
    id: 'soal_1',
    number: 1,
    level: 'LEVEL 1 — DASAR',
    topic: 'Mengenali Contoh Kearifan Lokal',
    concept: 'Identifikasi Praktik Konservasi Adat',
    question: 'Manakah di bawah ini yang merupakan contoh kearifan lokal masyarakat dalam menjaga kelestarian lingkungan dan ekosistem laut?',
    options: [
      { label: 'A', text: 'Sasi (aturan adat larangan memanen hasil laut sementara di Maluku & Papua)' },
      { label: 'B', text: 'Tari Saman dari dataran tinggi Gayo Aceh' },
      { label: 'C', text: 'Rumah Gadang dari Minangkabau Sumatera Barat' },
      { label: 'D', text: 'Pakaian adat baju Bodo dari Sulawesi Selatan' },
    ],
    correctAnswer: 'A',
    explanation: 'Sasi adalah contoh nyata kearifan lokal masyarakat adat Maluku dan Papua untuk menjaga siklus regenerasi terumbu karang dan populasi ikan laut.',
  },
  {
    id: 'soal_2',
    number: 2,
    level: 'LEVEL 2 — MENENGAH',
    topic: 'Karakteristik & Filosofi Kearifan Lokal',
    concept: 'Prinsip Keadilan & Keharmonisan Subak',
    question: 'Sistem pengairan sawah terasering "Subak" di Bali dapat digolongkan sebagai KEARIFAN LOKAL luhur bangsa karena...',
    options: [
      { label: 'A', text: 'Hanya digunakan untuk menyambut turis asing di hotel' },
      { label: 'B', text: 'Merupakan sistem tata kelola air mandiri berlandaskan keadilan, musyawarah bersama, dan keharmonisan alam (Tri Hita Karana)' },
      { label: 'C', text: 'Dibuat dengan mesin pompa bertenaga listrik modern dari luar negeri' },
      { label: 'D', text: 'Hanya boleh dinikmati oleh keluarga kerajaan atau bangsawan desa' },
    ],
    correctAnswer: 'B',
    explanation: 'Subak diakui UNESCO karena memadukan ketahanan pangan dengan filosofi Tri Hita Karana (keharmonisan dengan Tuhan, sesama manusia, dan alam).',
  },
  {
    id: 'soal_3',
    number: 3,
    level: 'LEVEL 2 — MENENGAH',
    topic: 'Membedakan Tradisi dan Kearifan Lokal',
    concept: 'Perbedaan Tradisi vs Kearifan Lokal',
    question: 'Pernyataan yang paling tepat mengenai perbedaan antara "Tradisi" dan "Kearifan Lokal" dalam masyarakat Indonesia adalah...',
    options: [
      { label: 'A', text: 'Tradisi tidak bernilai luhur, sedangkan kearifan lokal selalu modern' },
      { label: 'B', text: 'Tradisi berupa kebiasaan perayaan turun-temurun, sedangkan kearifan lokal memuat sistem nilai dan pengetahuan bijak dalam mengelola lingkungan hidup' },
      { label: 'C', text: 'Tradisi hanya ada di pulau Jawa, sedangkan kearifan lokal hanya ada di pulau terpencil' },
      { label: 'D', text: 'Tradisi bersifat asing dari luar negeri, sedangkan kearifan lokal berasal dari buku pemerintah' },
    ],
    correctAnswer: 'B',
    explanation: 'Tradisi berfokus pada adat kebiasaan perayaan bersama, sedangkan kearifan lokal (local wisdom) adalah pandangan hidup bijak dalam menjaga kelestarian alam dan relasi sosial.',
  },
  {
    id: 'soal_4',
    number: 4,
    level: 'LEVEL 3 — ANALISIS',
    topic: 'Menganalisis Sikap terhadap Kearifan Lingkungan',
    concept: 'Analisis Praktik Konservasi Berkelanjutan',
    question: 'Di suatu pesisir, tetua adat memberlakukan aturan tradisi pantang menangkap ikan selama musim pemijahan. Sikap yang tepat dan mencerminkan Profil Pelajar Pancasila adalah...',
    options: [
      { label: 'A', text: 'Menghargai dan mendukung aturan adat tersebut karena bertujuan menjaga regenerasi biota laut demi generasi mendatang' },
      { label: 'B', text: 'Mengabaikan aturan adat karena dianggap kuno dan membatasi penghasilan harian nelayan' },
      { label: 'C', text: 'Mencari celah hukum untuk menangkap ikan secara sembunyi-sembunyi di malam hari' },
      { label: 'D', text: 'Mengganti semua aturan adat dengan kebiasaan berburu bebas tanpa batas' },
    ],
    correctAnswer: 'A',
    explanation: 'Kearifan lokal konservasi selaras dengan tujuan pembangunan berkelanjutan (SDGs) serta pengamalan nilai keadilan dan kepedulian lingkungan hidup.',
  },
  {
    id: 'soal_5',
    number: 5,
    level: 'LEVEL 3 — ANALISIS',
    topic: 'Penerapan & Pelestarian Budaya di Era Digital',
    concept: 'Sikap Bhinneka Tunggal Ika & Aksi Nyata Pelajar',
    question: 'Di era digital saat ini, tindakan konkret apa yang paling dapat dilakukan oleh pelajar SMP untuk merawat keberagaman dan melestarikan budaya Nusantara?',
    options: [
      { label: 'A', text: 'Hanya menyukai produk budaya luar negeri dan menganggap tradisi daerah sendiri memalukan' },
      { label: 'B', text: 'Menghargai perbedaan suku/logat teman di sekolah dan memanfaatkan media digital untuk membuat konten kreatif tentang keindahan budaya Indonesia' },
      { label: 'C', text: 'Memicu perdebatan antarsuku di kolom komentar media sosial untuk membuktikan suku siapa yang terhebat' },
      { label: 'D', text: 'Membiarkan budaya daerah punah karena sudah ada teknologi modern' },
    ],
    correctAnswer: 'B',
    explanation: 'Mengamalkan semboyan Bhinneka Tunggal Ika secara inklusif dan mempromosikan budaya secara kreatif melalui media digital adalah wujud nyata pelestarian budaya.',
  },
];
