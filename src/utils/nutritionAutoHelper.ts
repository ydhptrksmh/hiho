/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PRESET_CATEGORIES: string[] = [
  'Metabolik & Gula Darah',
  'Jantung & Pembuluh Darah',
  'Pencernaan & Lambung',
  'Sendi & Tulang',
  'Ginjal & Saluran Kemih',
  'Pernapasan',
  'Kolesterol & Lemak',
  'Ibu & Anak',
  'Lansia',
  'Gizi & Nutrisi Umum',
];

export const PRESET_EMOJIS: string[] = [
  '🩸', '🫀', '🫁', '🦴', '🧪',
  '🥑', '🥗', '🥛', '🍌', '🍋',
  '🥩', '🥐', '💊', '🩺', '🌿',
  '🐟', '🍵', '🥚', '🍎', '🥦',
];

export interface AutoFoodReason {
  category: string;
  detail: string;
  portionOrReason: string;
}

/**
 * Smart medical/nutrition rules engine that generates concise, medically sound
 * reasons for food recommendations or restrictions based on keywords.
 */
export function generateFoodExplanation(
  foodName: string,
  isAllowed: boolean,
  diseaseName: string = '',
  healthCategory: string = ''
): AutoFoodReason {
  const name = foodName.toLowerCase().trim();
  const dis = diseaseName.toLowerCase();

  if (isAllowed) {
    // 1. Sayuran hijau & serat
    if (name.includes('bayam') || name.includes('brokoli') || name.includes('sawi') || name.includes('kangkung') || name.includes('buncis') || name.includes('sayur') || name.includes('wortel')) {
      return {
        category: 'Sayuran Kaya Serat & Antioksidan',
        detail: 'Tinggi serat larut air dan mikronutrien bioaktif yang menstabilkan respons metabolisme dan melancarkan pencernaan.',
        portionOrReason: '1 mangkuk sedang (100–150 gram) per sesi makan utama',
      };
    }

    // 2. Ikan & Omega-3
    if (name.includes('ikan') || name.includes('salmon') || name.includes('kembung') || name.includes('tuna') || name.includes('sarden')) {
      return {
        category: 'Protein Bersih & Asam Lemak Omega-3',
        detail: 'Sumber asam lemak esensial EPA/DHA yang memiliki aksi anti-inflamasi alami serta protektif terhadap endotel pembuluh darah.',
        portionOrReason: '1 potong sedang (75–100 gram), diolah pepes, kukus, atau panggang',
      };
    }

    // 3. Nabati & Kedelai (Tempe/Tahu)
    if (name.includes('tempe') || name.includes('tahu') || name.includes('kedelai') || name.includes('edamame')) {
      return {
        category: 'Protein Nabati Bebas Kolesterol',
        detail: 'Kaya isoflavon dan peptida bioaktif, rendah lemak jenuh serta bersahabat bagi kestabilan mikrobiota usus.',
        portionOrReason: '1–2 potong sedang (50–80 gram), dikukus atau dibakar tanpa minyak jenuh',
      };
    }

    // 4. Karbohidrat Kompleks
    if (name.includes('beras merah') || name.includes('oat') || name.includes('havermut') || name.includes('shirataki') || name.includes('ubi') || name.includes('singkong') || name.includes('kentang rebus')) {
      return {
        category: 'Karbohidrat Kompleks (Low GI)',
        detail: 'Memiliki indeks glikemik rendah (low glycemic index) sehingga diserap secara bertahap dan mencegah lonjakan glukosa.',
        portionOrReason: '1 kepalan tangan (100–120 gram) per jadwal makan utama',
      };
    }

    // 5. Buah-buahan Segar
    if (name.includes('pisang') || name.includes('pepaya') || name.includes('apel') || name.includes('pir') || name.includes('jeruk') || name.includes('alpukat') || name.includes('melon') || name.includes('semangka') || name.includes('buah')) {
      return {
        category: 'Buah Segar Pektin & Kalium Alami',
        detail: 'Mengandung kalium elektrolit untuk vasodilatasi pembuluh darah dan serat pektin yang mengikat kolesterol.',
        portionOrReason: '1–2 porsi buah segar (1 buah ukuran sedang atau 1 potong mangkuk)',
      };
    }

    // 6. Minuman / Herbal
    if (name.includes('air') || name.includes('teh hijau') || name.includes('jahe') || name.includes('kunyit') || name.includes('chia')) {
      return {
        category: 'Hidrasi & Fitonutrien Alami',
        detail: 'Mendukung filtrasi ginjal, menjaga volume plasma darah optimal, dan memberikan efek menenangkan saluran cerna.',
        portionOrReason: 'Minum teratur 200–250 ml, tanpa pemanis buatan',
      };
    }

    // Default Allowed
    return {
      category: 'Pangan Sehat Terpilih',
      detail: `Mendukung pemenuhan zat gizi esensial tanpa memicu stres oksidatif atau beban berlebih pada organ pada penderita ${diseaseName || 'kronis'}.`,
      portionOrReason: 'Porsi moderat dan seimbang sesuai kebutuhan kalori harian',
    };
  } else {
    // AVOID / RESTRICTED FOODS
    // 1. Gula & Pemanis
    if (name.includes('gula') || name.includes('sirup') || name.includes('madu') || name.includes('kental manis') || name.includes('boba') || name.includes('soda') || name.includes('manis')) {
      return {
        category: 'Gula Sederhana Akut',
        detail: 'Menyebabkan hiperglikemia mendadak, membebani sekresi sel beta pankreas, dan mempercepat pembentukan senyawa AGEs.',
        portionOrReason: 'Hindari sepenuhnya atau batasi ketat < 1 sendok makan per hari',
      };
    }

    // 2. Garam & Natrium Tinggi
    if (name.includes('garam') || name.includes('ikan asin') || name.includes('telur asin') || name.includes('keripik') || name.includes('kecap asin') || name.includes('asin') || name.includes('msg')) {
      return {
        category: 'Tinggi Natrium / Sodium',
        detail: 'Memicu retensi cairan ekstraseluler, menaikkan volume intravaskular, dan mempersempit lumen pembuluh darah perifer.',
        portionOrReason: 'Batasi konsumsi garam dapur maksimal 1 sdt (< 2.000 mg natrium) per hari',
      };
    }

    // 3. Purin Tinggi (Jeroan, Emping)
    if (name.includes('jeroan') || name.includes('hati') || name.includes('ampela') || name.includes('otak') || name.includes('babat') || name.includes('emping') || name.includes('melinjo') || name.includes('kerang')) {
      return {
        category: 'Tinggi Purin & Asam Urat Akut',
        detail: 'Dipecah langsung menjadi kristal monosodium urat yang mengendap pada cairan sinovial sendi, memicu nyeri inflamasi tajam.',
        portionOrReason: 'Hindari sepenuhnya untuk mencegah serangan artritis akut',
      };
    }

    // 4. Minyak Jenuh & Gorengan
    if (name.includes('gorengan') || name.includes('santan') || name.includes('gajih') || name.includes('lemak') || name.includes('margarin') || name.includes('mentega') || name.includes('bakwan')) {
      return {
        category: 'Lemak Jenuh & Asam Lemak Trans',
        detail: 'Memperlambat waktu pengosongan lambung, memicu refluks cairan empedu/asam lambung, dan menaikkan kolesterol LDL.',
        portionOrReason: 'Hindari proses goreng rendam minyak (deep frying), beralih ke kukus/rebus',
      };
    }

    // 5. Iritan Lambung & Kafein
    if (name.includes('kopi') || name.includes('alkohol') || name.includes('pedas') || name.includes('cabai') || name.includes('merica') || name.includes('cuka') || name.includes('asam')) {
      return {
        category: 'Iritan Mukosa & Relaksan LES',
        detail: 'Merelaksasi sfingter esofagus bawah (LES) dan menstimulasi sekresi asam lambung (HCl) berlebih sehingga ulu hati terasa terbakar.',
        portionOrReason: 'Pantang konsumsi saat perut kosong atau fase kambuh',
      };
    }

    // Default Avoid
    return {
      category: 'Pantangan / Dibatasi',
      detail: `Berpotensi memicu lonjakan metabolik, memperberat kerja filtrasi ginjal/hati, atau menginduksi respon peradangan akut pada ${diseaseName || 'pasien'}.`,
      portionOrReason: 'Batasi ketat atau eliminasi dari menu harian',
    };
  }
}

/**
 * Client-side file image processing to Base64 data URL.
 * Automatically downscales images larger than 640px to ensure
 * feather-light localStorage usage and zero quota issues.
 */
export function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File yang diunggah harus berupa gambar (JPEG, PNG, WEBP, dll).'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('Gagal membaca berkas gambar.'));
        return;
      }

      // Create an image element to inspect dimensions & compress if needed
      const img = new Image();
      img.onload = () => {
        const maxWidth = 640;
        const maxHeight = 640;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Convert to efficient JPEG or WEBP data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        // Fallback to original read result if image decoding fails
        resolve(result);
      };

      img.src = result;
    };

    reader.onerror = () => reject(new Error('Gagal memproses berkas gambar dari laptop.'));
    reader.readAsDataURL(file);
  });
}
