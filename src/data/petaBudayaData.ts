import subakImg from '../assets/images/subak_bali_sawah_1790429467066.jpg';
import samanImg from '../assets/images/tari_saman_aceh_1790429482412.jpg';
import sekatenImg from '../assets/images/sekaten_tradisi_jawa_1790429449126.jpg';
import sasiImg from '../assets/images/sasi_maluku_papua_1790429499537.jpg';
import karapanImg from '../assets/images/karapan_sapi_madura_1790431155818.jpg';
import gadangImg from '../assets/images/rumah_gadang_sumatra_1790430416441.jpg';
import tongkonanImg from '../assets/images/tongkonan_toraja_sulawesi_1790430400308.jpg';
import pasolaImg from '../assets/images/pasola_sumba_ntt_1790430789676.jpg';
import petaAsliImg from '../assets/images/peta_asli_indonesia_lengkap_1790431824164.jpg';

export { petaAsliImg };

export interface PetaCardItem {
  id: string;
  name: string;
  targetRegionId: string;
  regionName: string;
  image: string;
  colorBorder: string;
  colorBg: string;
  badgeColor: string;
  category: 'Tradisi' | 'Kearifan Lokal' | 'Budaya Daerah';
}

export interface RegionTarget {
  id: string;
  label: string;
  provinceLabel: string;
  cx: string;
  cy: string;
  hintDirection: string;
}

export const PETA_CULTURE_CARDS: PetaCardItem[] = [
  {
    id: 'subak',
    name: 'SUBAK',
    targetRegionId: 'bali',
    regionName: 'Bali',
    image: subakImg,
    colorBorder: 'border-emerald-400',
    colorBg: 'from-emerald-500/20 to-teal-600/30',
    badgeColor: 'bg-emerald-500 text-white',
    category: 'Kearifan Lokal',
  },
  {
    id: 'tari_saman',
    name: 'TARI SAMAN',
    targetRegionId: 'aceh',
    regionName: 'Aceh',
    image: samanImg,
    colorBorder: 'border-cyan-400',
    colorBg: 'from-cyan-500/20 to-blue-600/30',
    badgeColor: 'bg-cyan-500 text-slate-950 font-black',
    category: 'Budaya Daerah',
  },
  {
    id: 'sekaten',
    name: 'SEKATEN',
    targetRegionId: 'jawa',
    regionName: 'Jawa',
    image: sekatenImg,
    colorBorder: 'border-amber-400',
    colorBg: 'from-amber-500/20 to-yellow-600/30',
    badgeColor: 'bg-amber-400 text-slate-950 font-black',
    category: 'Tradisi',
  },
  {
    id: 'sasi',
    name: 'SASI',
    targetRegionId: 'maluku_papua',
    regionName: 'Maluku / Papua',
    image: sasiImg,
    colorBorder: 'border-teal-400',
    colorBg: 'from-teal-500/20 to-cyan-600/30',
    badgeColor: 'bg-teal-500 text-white',
    category: 'Kearifan Lokal',
  },
  {
    id: 'karapan_sapi',
    name: 'KARAPAN SAPI',
    targetRegionId: 'madura',
    regionName: 'Madura',
    image: karapanImg,
    colorBorder: 'border-orange-500',
    colorBg: 'from-orange-500/20 to-amber-600/30',
    badgeColor: 'bg-orange-500 text-white',
    category: 'Tradisi',
  },
  {
    id: 'rumah_gadang',
    name: 'RUMAH GADANG',
    targetRegionId: 'sumbar',
    regionName: 'Sumatra Barat',
    image: gadangImg,
    colorBorder: 'border-rose-400',
    colorBg: 'from-rose-500/20 to-pink-600/30',
    badgeColor: 'bg-rose-500 text-white',
    category: 'Budaya Daerah',
  },
  {
    id: 'tongkonan',
    name: 'TONGKONAN',
    targetRegionId: 'sulsel',
    regionName: 'Sulawesi Selatan',
    image: tongkonanImg,
    colorBorder: 'border-indigo-400',
    colorBg: 'from-indigo-500/20 to-purple-600/30',
    badgeColor: 'bg-indigo-500 text-white',
    category: 'Budaya Daerah',
  },
  {
    id: 'pasola',
    name: 'PASOLA',
    targetRegionId: 'ntt',
    regionName: 'Nusa Tenggara Timur',
    image: pasolaImg,
    colorBorder: 'border-yellow-400',
    colorBg: 'from-yellow-500/20 to-amber-600/30',
    badgeColor: 'bg-yellow-400 text-slate-950 font-black',
    category: 'Tradisi',
  },
];

export const REGION_TARGETS: RegionTarget[] = [
  {
    id: 'aceh',
    label: 'ACEH',
    provinceLabel: 'Ujung Utara Sumatra',
    cx: '10%',
    cy: '20%',
    hintDirection: 'Kawasan paling utara Sumatra',
  },
  {
    id: 'sumbar',
    label: 'SUMBAR',
    provinceLabel: 'Sumatra Barat',
    cx: '16%',
    cy: '52%',
    hintDirection: 'Bagian barat Pulau Sumatra',
  },
  {
    id: 'jawa',
    label: 'JAWA',
    provinceLabel: 'Pulau Jawa',
    cx: '32%',
    cy: '79%',
    hintDirection: 'Pulau Jawa',
  },
  {
    id: 'madura',
    label: 'MADURA',
    provinceLabel: 'Pulau Madura',
    cx: '43%',
    cy: '67%',
    hintDirection: 'Sebelah timur laut Jawa',
  },
  {
    id: 'bali',
    label: 'BALI',
    provinceLabel: 'Pulau Bali',
    cx: '50%',
    cy: '82%',
    hintDirection: 'Sebelah timur Jawa',
  },
  {
    id: 'sulsel',
    label: 'SULSEL',
    provinceLabel: 'Sulawesi Selatan',
    cx: '56%',
    cy: '58%',
    hintDirection: 'Bagian selatan Sulawesi',
  },
  {
    id: 'ntt',
    label: 'NTT',
    provinceLabel: 'Nusa Tenggara Timur',
    cx: '64%',
    cy: '83%',
    hintDirection: 'Sebelah timur Bali',
  },
  {
    id: 'maluku_papua',
    label: 'MALUKU/PAPUA',
    provinceLabel: 'Wilayah Timur Indonesia',
    cx: '84%',
    cy: '48%',
    hintDirection: 'Wilayah timur Indonesia',
  },
];

export const MAP_REASON_OPTIONS = [
  'Pernah melihat atau mendengarnya',
  'Mengenali ciri budayanya',
  'Mengetahui daerah asalnya',
  'Hasil diskusi kelompok',
  'Masih menebak',
];
