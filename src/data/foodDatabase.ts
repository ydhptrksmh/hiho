import { FoodRating } from '../types';

export const foodDatabase: FoodRating[] = [
  {
    name: 'Sate Kambing Bumbu Kecap',
    category: 'Daging & Olahan Hewani',
    portion: '5 tusuk (sekitar 75 gram)',
    diabetes: {
      status: 'moderate',
      note: 'Kecap manis mengandung gula tinggi. Ganti dengan bumbu garam bawang tipis.',
    },
    hypertension: {
      status: 'avoid',
      note: 'Tinggi lemak jenuh dan garam marinasi yang memicu resistensi vaskular mendadak.',
    },
    gout: {
      status: 'avoid',
      note: 'Kambing tergolong daging merah tinggi purin. Memperparah peradangan sendi.',
    },
    gerd: {
      status: 'avoid',
      note: 'Lemak pekat kambing dan cabai rawit kecap memperlambat pengosongan lambung dan merelaksasi LES.',
    },
  },
  {
    name: 'Ikan Kembung Panggang / Pepes',
    category: 'Ikan Laut & Protein Sehat',
    portion: '1 ekor ukuran sedang (100 gram)',
    diabetes: {
      status: 'safe',
      note: 'Sangat aman, indeks glikemik 0. Protein tinggi menstabilkan pelepasan insulin.',
    },
    hypertension: {
      status: 'safe',
      note: 'Kaya asam lemak omega-3 alami yang membantu melebarkan pembuluh darah.',
    },
    gout: {
      status: 'moderate',
      note: 'Kandungan purin sedang. Aman dikonsumsi 2 kali seminggu, hindari menggoreng kering.',
    },
    gerd: {
      status: 'safe',
      note: 'Sangat ramah lambung jika dipepes atau dipanggang tanpa cabai menyengat.',
    },
  },
  {
    name: 'Gulai Daun Singkong Santan Kental',
    category: 'Masakan Tradisional Bersantan',
    portion: '1 mangkuk sedang (150 gram)',
    diabetes: {
      status: 'moderate',
      note: 'Daun singkong kaya serat, namun santan kental tinggi kalori dan memperburuk resistensi insulin.',
    },
    hypertension: {
      status: 'avoid',
      note: 'Garam kaldu pekat dan lemak jenuh santan memperberat beban kerja dinding arteri.',
    },
    gout: {
      status: 'moderate',
      note: 'Daun singkong memiliki kadar purin sedang-tinggi. Batasi konsumsi kuah kentalnya.',
    },
    gerd: {
      status: 'avoid',
      note: 'Santan kental adalah musuh utama lambung karena memicu refluks hebat dan rasa mual begah.',
    },
  },
  {
    name: 'Tahu & Tempe Bacem Kukus',
    category: 'Protein Nabati',
    portion: '2 potong sedang (100 gram)',
    diabetes: {
      status: 'safe',
      note: 'Gunakan pemanis alami rendah kalori/tanpa gula pasir. Sangat tinggi serat kedelai.',
    },
    hypertension: {
      status: 'safe',
      note: 'Bebas kolesterol, rendah natrium jika tidak memakai kecap asin berlebih.',
    },
    gout: {
      status: 'safe',
      note: 'Mitos purin dibantah: Purin nabati dari kedelai terbukti aman dalam riset klinis modern.',
    },
    gerd: {
      status: 'safe',
      note: 'Tekstur lembut dan mudah dicerna lambung tanpa memicu produksi asam lambung.',
    },
  },
  {
    name: 'Emping Melinjo Goreng',
    category: 'Camilan Tradisional',
    portion: '1 genggam kecil (30 gram)',
    diabetes: {
      status: 'moderate',
      note: 'Karbohidrat gorengan yang meningkatkan asupan kalori tersembunyi.',
    },
    hypertension: {
      status: 'moderate',
      note: 'Taburan garam pada emping berisiko meningkatkan retensi cairan.',
    },
    gout: {
      status: 'avoid',
      note: 'PANTANGAN TERTINGGI: Biji melinjo sangat padat purin dan pemicu nomor satu serangan asam urat kambuh.',
    },
    gerd: {
      status: 'moderate',
      note: 'Minyak gorengan dapat memicu begah pada dinding lambung sensitif.',
    },
  },
  {
    name: 'Kopi Hitam Pekat (Espresso / Tubruk)',
    category: 'Minuman Berkafein',
    portion: '1 cangkir (150 ml)',
    diabetes: {
      status: 'safe',
      note: 'Aman jika TANPA gula atau kental manis. Mengandung asam klorogenat antioksidan.',
    },
    hypertension: {
      status: 'moderate',
      note: 'Dapat memicu lonjakan tekanan darah sementara (vasokonstriksi) 1-2 jam setelah minum.',
    },
    gout: {
      status: 'safe',
      note: 'Riset membuktikan konsumsi kopi moderat justru meningkatkan ekskresi asam urat di ginjal.',
    },
    gerd: {
      status: 'avoid',
      note: 'PANTANGAN UTAMA GERD: Kafein melemaskan sfingter esofagus bawah (LES) seketika.',
    },
  },
  {
    name: 'Sayur Bayam Bening Jagung Manis',
    category: 'Sayuran Kuah Sehat',
    portion: '1 mangkuk kuah bening (200 ml)',
    diabetes: {
      status: 'safe',
      note: 'Tinggi serat larut air dan magnesium yang mendukung sensitivitas insulin.',
    },
    hypertension: {
      status: 'safe',
      note: 'Sangat kaya kalium alami untuk membuang kelebihan natrium dari tubuh.',
    },
    gout: {
      status: 'safe',
      note: 'Aman dikonsumsi. Purin nabati bayam tidak berbahaya bagi sendi.',
    },
    gerd: {
      status: 'safe',
      note: 'Kuah bening hangat sangat ramah untuk melapisi mukosa lambung.',
    },
  },
  {
    name: 'Pisang Ambon / Pisang Kepok Kukus',
    category: 'Buah Segar / Olahan Sehat',
    portion: '1 buah ukuran sedang (100 gram)',
    diabetes: {
      status: 'moderate',
      note: 'Pilih yang baru matang (bukan terlalu matang berbintik hitam). Makan 1 buah sekali makan.',
    },
    hypertension: {
      status: 'safe',
      note: 'Superfood kalium (sekitar 400 mg/buah) yang sangat efektif menurunkan tekanan darah.',
    },
    gout: {
      status: 'safe',
      note: 'Bebas purin, kaya vitamin C dan serat untuk kesehatan metabolisme.',
    },
    gerd: {
      status: 'safe',
      note: 'Memiliki pH sekitar 5,6 yang menetralkan asam lambung dan melapisi esofagus.',
    },
  },
  {
    name: 'Jeroan Sapi (Babat, Paru, Hati, Usus)',
    category: 'Olahan Jeroan Hewan',
    portion: '1 potong kecil (50 gram)',
    diabetes: {
      status: 'moderate',
      note: 'Tidak berkarbohidrat tapi tinggi kolesterol yang mempercepat komplikasi kardiovaskular.',
    },
    hypertension: {
      status: 'avoid',
      note: 'Tinggi lemak jenuh dan biasanya dimasak dengan bumbu kaldu super asin.',
    },
    gout: {
      status: 'avoid',
      note: 'BAHAYA TINGGI: Purin > 400 mg/100g, hampir pasti memicu sendi bengkak akut.',
    },
    gerd: {
      status: 'avoid',
      note: 'Sangat lambat dicerna lambung dan memicu gas lambung berbau asam.',
    },
  },
  {
    name: 'Oatmeal Seduh Tanpa Gula',
    category: 'Sereal Biji Utuh',
    portion: '4 sendok makan matang (150 gram)',
    diabetes: {
      status: 'safe',
      note: 'Kaya beta-glukan dengan indeks glikemik rendah yang mencegah lonjakan gula.',
    },
    hypertension: {
      status: 'safe',
      note: 'Mendukung fleksibilitas endotel pembuluh darah dan rendah sodium.',
    },
    gout: {
      status: 'safe',
      note: 'Sangat aman sebagai pengganti sarapan tinggi purin.',
    },
    gerd: {
      status: 'safe',
      note: 'Bekerja seperti spons alami penyerap kelebihan asam lambung di pagi hari.',
    },
  },
];
