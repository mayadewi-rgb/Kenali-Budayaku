import reogImg from '../assets/images/reog_ponorogo_jawa_1790430743909.jpg';
import niasImg from '../assets/images/lompat_batu_nias_1790430761422.jpg';
import torajaImg from '../assets/images/rambu_solo_toraja_1790430775501.jpg';
import pasolaImg from '../assets/images/pasola_sumba_ntt_1790430789676.jpg';

export interface TebakBudayaCard {
  id: string;
  number: string;
  image: string;
  name: string;
  region: string;
  category: string; // "Tradisi" | "Kearifan Lokal" | "Budaya Daerah"
  shortFact: string;
  island: string;
  clues: string[];
}

export const TEBAK_BUDAYA_CARDS: TebakBudayaCard[] = [
  {
    id: 'reog',
    number: '01',
    image: reogImg,
    name: 'REOG PONOROGO',
    region: 'Ponorogo, Jawa Timur',
    category: 'Tradisi & Budaya Daerah',
    shortFact: 'Tari pertunjukan tradisional yang menampilkan topeng kepala singa bermahkotakan bulu merak raksasa (Dadak Merak) seberat puluhan kilogram yang digigit dengan kekuatan gigi penarinya.',
    island: 'Jawa',
    clues: ['Topeng raksasa bulu merak', 'Kostum khas penari Jawa', 'Kesenian rakyat legendaris'],
  },
  {
    id: 'fahombo',
    number: '02',
    image: niasImg,
    name: 'LOMPAT BATU (FAHOMBO)',
    region: 'Nias, Sumatra Utara',
    category: 'Tradisi & Kearifan Lokal',
    shortFact: 'Ritual kedewasaan pemuda suku Nias dengan melompati susunan batu piramida megalitik setinggi lebih dari 2 meter sebagai lambang keberanian fisik, ketangkasan, dan kehormatan.',
    island: 'Sumatra',
    clues: ['Piramida batu megalitikum', 'Baju perang adat Nias', 'Tradisi uji ketangkasan'],
  },
  {
    id: 'rambu-solo',
    number: '03',
    image: torajaImg,
    name: "RAMBU SOLO'",
    region: 'Tana Toraja, Sulawesi Selatan',
    category: 'Tradisi & Budaya Daerah',
    shortFact: 'Upacara pemakaman adat masyarakat Toraja sebagai penghormatan terakhir mengantar arwah leluhur, diiringi prosesi kerbau belang (Tedong Bonga) di pelataran rumah adat Tongkonan.',
    island: 'Sulawesi',
    clues: ['Rumah adat Tongkonan beratap perahu', 'Tenun adat Toraja', 'Prosesi adat penghormatan leluhur'],
  },
  {
    id: 'pasola',
    number: '04',
    image: pasolaImg,
    name: 'PASOLA',
    region: 'Sumba Barat, Nusa Tenggara Timur (NTT)',
    category: 'Tradisi & Kearifan Lokal',
    shortFact: 'Permainan ketangkasan saling melempar lembing kayu di atas kuda yang dipacu kencang di padang savana, diadakan bersamaan dengan musim keluarnya cacing laut Nyale sebagai doa kesuburan panen.',
    island: 'Nusa Tenggara',
    clues: ['Kuda savana Sumba', 'Kain tenun ikat khas Sumba', 'Tradisi menyambut musim tanam'],
  },
];

export const REASON_OPTIONS = [
  'Bentuk pakaian',
  'Gerakan/tarian',
  'Lingkungan/tempat',
  'Tradisi masyarakat',
  'Belum tahu',
];
