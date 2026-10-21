import sekatenImg from '../assets/images/sekaten_tradisi_jawa_1790429449126.jpg';
import subakImg from '../assets/images/subak_bali_sawah_1790429467066.jpg';
import samanImg from '../assets/images/tari_saman_aceh_1790429482412.jpg';
import sasiImg from '../assets/images/sasi_maluku_papua_1790429499537.jpg';

export interface CultureItem {
  id: string;
  cardIndex: number;
  name: string;
  region: string;
  shortFact: string;
  detailedFact: string;
  pancasilaValue: string;
  pancasilaSila: string;
  image: string;
  accentColor: string;
  badgeBg: string;
  borderActive: string;
  glowColor: string;
  hint: string;
  iconName: string;
}

export const CULTURES_DATA: CultureItem[] = [
  {
    id: 'sekaten',
    cardIndex: 1,
    name: 'SEKATEN',
    region: 'Surakarta & Yogyakarta (Jawa)',
    shortFact: 'Tradisi masyarakat Jawa yang berkaitan dengan peringatan Maulid Nabi.',
    detailedFact: 'Sekaten dimeriahkan dengan arak-arakan Gunungan hasil bumi dan lantunan gamelan pusaka (Kyai Gunturmadu & Nagawilaga) sebagai lambang rasa syukur dan dakwah damai.',
    pancasilaValue: 'Nilai Religiusitas & Gotong Royong',
    pancasilaSila: 'Sila ke-1 (Ketuhanan) & Sila ke-3 (Persatuan)',
    image: sekatenImg,
    accentColor: '#F59E0B', // Bright Amber / Yellow-Orange
    badgeBg: 'from-amber-500 to-orange-500',
    borderActive: 'border-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    hint: 'Gamelan sakral & gunungan makanan khas keraton Jawa.',
    iconName: 'Sparkles',
  },
  {
    id: 'subak',
    cardIndex: 2,
    name: 'SUBAK',
    region: 'Bali',
    shortFact: 'Kearifan lokal masyarakat Bali dalam mengatur sistem pengairan sawah.',
    detailedFact: 'Subak berakar pada filosofi Tri Hita Karana (harmoni dengan Sang Pencipta, sesama manusia, dan alam). Mengatur pembagian air secara adil dan demokratis.',
    pancasilaValue: 'Keadilan Sosial & Harmoni Alam',
    pancasilaSila: 'Sila ke-4 (Musyawarah) & Sila ke-5 (Keadilan Sosial)',
    image: subakImg,
    accentColor: '#10B981', // Fresh Emerald Green
    badgeBg: 'from-emerald-500 to-teal-500',
    borderActive: 'border-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    hint: 'Terasering sawah bertingkat & pembagian air gotong royong.',
    iconName: 'Droplets',
  },
  {
    id: 'tari-saman',
    cardIndex: 3,
    name: 'TARI SAMAN',
    region: 'Gayo, Aceh',
    shortFact: 'Tari tradisional masyarakat Gayo, Aceh.',
    detailedFact: 'Dikenal sebagai "Tari Tangan Seribu", diakui UNESCO sebagai Warisan Budaya Takbenda. Menuntut konsentrasi, kekompakan, dan kecepatan gerak tanpa iringan musik alat.',
    pancasilaValue: 'Persatuan & Kedisiplinan Tinggi',
    pancasilaSila: 'Sila ke-3 (Persatuan Indonesia)',
    image: samanImg,
    accentColor: '#3B82F6', // Electric Blue
    badgeBg: 'from-blue-600 to-indigo-600',
    borderActive: 'border-blue-400',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    hint: 'Tari tepuk tangan & dada dengan gerak serempak cepat.',
    iconName: 'Flame',
  },
  {
    id: 'sasi',
    cardIndex: 4,
    name: 'SASI',
    region: 'Maluku & Papua',
    shortFact: 'Kearifan lokal masyarakat Maluku dan Papua dalam menjaga sumber daya alam.',
    detailedFact: 'Aturan adat melarang penangkapan ikan/biota laut tertentu (seperti teripang & lola) selama periode waktu tertentu, agar populasi alam dapat berkembang biak lestari.',
    pancasilaValue: 'Kearifan Ekologis & Ketaatan Hukum Adat',
    pancasilaSila: 'Sila ke-2 (Kemanusiaan Beradab) & Sila ke-5 (Keadilan Sosial)',
    image: sasiImg,
    accentColor: '#06B6D4', // Vibrant Turquoise / Cyan
    badgeBg: 'from-cyan-500 to-teal-500',
    borderActive: 'border-cyan-400',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    hint: 'Tanda adat kayu janur kelapa pelindung laut & ikan.',
    iconName: 'Waves',
  },
];
