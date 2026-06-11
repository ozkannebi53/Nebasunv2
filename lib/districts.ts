/**
 * NEBASUN Bölüm Sistemi
 * Her şehirde 20+ bölüm
 */

export interface District {
  id: string;
  name: string;
  city: string;
  level: number;
  completed: boolean;
  score: number;
}

export const DISTRICTS = {
  istanbul: [
    { id: "ist_01", name: "Fatih", city: "İstanbul", level: 1 },
    { id: "ist_02", name: "Beyoğlu", city: "İstanbul", level: 2 },
    { id: "ist_03", name: "Beşiktaş", city: "İstanbul", level: 3 },
    { id: "ist_04", name: "Sarıyer", city: "İstanbul", level: 4 },
    { id: "ist_05", name: "Şişli", city: "İstanbul", level: 5 },
    { id: "ist_06", name: "Kadıköy", city: "İstanbul", level: 6 },
    { id: "ist_07", name: "Üsküdar", city: "İstanbul", level: 7 },
    { id: "ist_08", name: "Bostancı", city: "İstanbul", level: 8 },
    { id: "ist_09", name: "Maltepe", city: "İstanbul", level: 9 },
    { id: "ist_10", name: "Pendik", city: "İstanbul", level: 10 },
    { id: "ist_11", name: "Tuzla", city: "İstanbul", level: 11 },
    { id: "ist_12", name: "Çekmeköy", city: "İstanbul", level: 12 },
    { id: "ist_13", name: "Ataşehir", city: "İstanbul", level: 13 },
    { id: "ist_14", name: "Maslak", city: "İstanbul", level: 14 },
    { id: "ist_15", name: "Levent", city: "İstanbul", level: 15 },
    { id: "ist_16", name: "Etiler", city: "İstanbul", level: 16 },
    { id: "ist_17", name: "Arnavutköy", city: "İstanbul", level: 17 },
    { id: "ist_18", name: "Eyüp", city: "İstanbul", level: 18 },
    { id: "ist_19", name: "Balat", city: "İstanbul", level: 19 },
    { id: "ist_20", name: "Eminönü", city: "İstanbul", level: 20 },
    { id: "ist_21", name: "Galata", city: "İstanbul", level: 21 },
    { id: "ist_22", name: "Topkapı", city: "İstanbul", level: 22 },
  ],
  ankara: [
    { id: "ank_01", name: "Çankaya", city: "Ankara", level: 1 },
    { id: "ank_02", name: "Keçiören", city: "Ankara", level: 2 },
    { id: "ank_03", name: "Mamak", city: "Ankara", level: 3 },
    { id: "ank_04", name: "Altındağ", city: "Ankara", level: 4 },
    { id: "ank_05", name: "Cebeci", city: "Ankara", level: 5 },
    { id: "ank_06", name: "Dikmen", city: "Ankara", level: 6 },
    { id: "ank_07", name: "Kızılay", city: "Ankara", level: 7 },
    { id: "ank_08", name: "Tunalı Hilmi", city: "Ankara", level: 8 },
    { id: "ank_09", name: "Bahçelievler", city: "Ankara", level: 9 },
    { id: "ank_10", name: "Balgat", city: "Ankara", level: 10 },
    { id: "ank_11", name: "Çayyolu", city: "Ankara", level: 11 },
    { id: "ank_12", name: "Oran", city: "Ankara", level: 12 },
    { id: "ank_13", name: "Gaziosmanpaşa", city: "Ankara", level: 13 },
    { id: "ank_14", name: "Ayrancı", city: "Ankara", level: 14 },
    { id: "ank_15", name: "Demetevler", city: "Ankara", level: 15 },
    { id: "ank_16", name: "Emek", city: "Ankara", level: 16 },
    { id: "ank_17", name: "Kavaklıdere", city: "Ankara", level: 17 },
    { id: "ank_18", name: "Maltepe", city: "Ankara", level: 18 },
    { id: "ank_19", name: "Ankara Kalesi", city: "Ankara", level: 19 },
    { id: "ank_20", name: "Ulus", city: "Ankara", level: 20 },
    { id: "ank_21", name: "Samanpazarı", city: "Ankara", level: 21 },
    { id: "ank_22", name: "Hamamönü", city: "Ankara", level: 22 },
  ],
  izmir: [
    { id: "izm_01", name: "Alsancak", city: "İzmir", level: 1 },
    { id: "izm_02", name: "Konak", city: "İzmir", level: 2 },
    { id: "izm_03", name: "Balçova", city: "İzmir", level: 3 },
    { id: "izm_04", name: "Buca", city: "İzmir", level: 4 },
    { id: "izm_05", name: "Çeşme", city: "İzmir", level: 5 },
    { id: "izm_06", name: "Aliağa", city: "İzmir", level: 6 },
    { id: "izm_07", name: "Bergama", city: "İzmir", level: 7 },
    { id: "izm_08", name: "Bayraklı", city: "İzmir", level: 8 },
    { id: "izm_09", name: "Gaziemir", city: "İzmir", level: 9 },
    { id: "izm_10", name: "Güzelbahçe", city: "İzmir", level: 10 },
    { id: "izm_11", name: "Karabağlar", city: "İzmir", level: 11 },
    { id: "izm_12", name: "Karşıyaka", city: "İzmir", level: 12 },
    { id: "izm_13", name: "Kınalı", city: "İzmir", level: 13 },
    { id: "izm_14", name: "Menderes", city: "İzmir", level: 14 },
    { id: "izm_15", name: "Ödemiş", city: "İzmir", level: 15 },
    { id: "izm_16", name: "Selçuk", city: "İzmir", level: 16 },
    { id: "izm_17", name: "Torbalı", city: "İzmir", level: 17 },
    { id: "izm_18", name: "Urla", city: "İzmir", level: 18 },
    { id: "izm_19", name: "Foça", city: "İzmir", level: 19 },
    { id: "izm_20", name: "Dikili", city: "İzmir", level: 20 },
    { id: "izm_21", name: "Alaçatı", city: "İzmir", level: 21 },
    { id: "izm_22", name: "Kuşadası", city: "İzmir", level: 22 },
  ],
  antalya: [
    { id: "ant_01", name: "Muratpaşa", city: "Antalya", level: 1 },
    { id: "ant_02", name: "Kemer", city: "Antalya", level: 2 },
    { id: "ant_03", name: "Serik", city: "Antalya", level: 3 },
    { id: "ant_04", name: "Manavgat", city: "Antalya", level: 4 },
    { id: "ant_05", name: "Alanya", city: "Antalya", level: 5 },
    { id: "ant_06", name: "Kaş", city: "Antalya", level: 6 },
    { id: "ant_07", name: "Kalkan", city: "Antalya", level: 7 },
    { id: "ant_08", name: "Patara", city: "Antalya", level: 8 },
    { id: "ant_09", name: "Finike", city: "Antalya", level: 9 },
    { id: "ant_10", name: "Demre", city: "Antalya", level: 10 },
    { id: "ant_11", name: "Aksu", city: "Antalya", level: 11 },
    { id: "ant_12", name: "Döşemealtı", city: "Antalya", level: 12 },
    { id: "ant_13", name: "Kepez", city: "Antalya", level: 13 },
    { id: "ant_14", name: "Lara", city: "Antalya", level: 14 },
    { id: "ant_15", name: "Kundu", city: "Antalya", level: 15 },
    { id: "ant_16", name: "Belek", city: "Antalya", level: 16 },
    { id: "ant_17", name: "Side", city: "Antalya", level: 17 },
    { id: "ant_18", name: "Gündoğmuş", city: "Antalya", level: 18 },
    { id: "ant_19", name: "Gazipaşa", city: "Antalya", level: 19 },
    { id: "ant_20", name: "Akseki", city: "Antalya", level: 20 },
    { id: "ant_21", name: "Elmalı", city: "Antalya", level: 21 },
    { id: "ant_22", name: "Korkuteli", city: "Antalya", level: 22 },
  ],
  bursa: [
    { id: "bur_01", name: "Nilüfer", city: "Bursa", level: 1 },
    { id: "bur_02", name: "Osmangazi", city: "Bursa", level: 2 },
    { id: "bur_03", name: "Yıldırım", city: "Bursa", level: 3 },
    { id: "bur_04", name: "İnegöl", city: "Bursa", level: 4 },
    { id: "bur_05", name: "Gemlik", city: "Bursa", level: 5 },
    { id: "bur_06", name: "Mudanya", city: "Bursa", level: 6 },
    { id: "bur_07", name: "Karacabey", city: "Bursa", level: 7 },
    { id: "bur_08", name: "Orhaneli", city: "Bursa", level: 8 },
    { id: "bur_09", name: "Orhangazi", city: "Bursa", level: 9 },
    { id: "bur_10", name: "Harmancık", city: "Bursa", level: 10 },
    { id: "bur_11", name: "Keles", city: "Bursa", level: 11 },
    { id: "bur_12", name: "Mustafakemalpaşa", city: "Bursa", level: 12 },
    { id: "bur_13", name: "Kestel", city: "Bursa", level: 13 },
    { id: "bur_14", name: "Gürsu", city: "Bursa", level: 14 },
    { id: "bur_15", name: "Çekirge", city: "Bursa", level: 15 },
    { id: "bur_16", name: "Tophane", city: "Bursa", level: 16 },
    { id: "bur_17", name: "Setbaşı", city: "Bursa", level: 17 },
    { id: "bur_18", name: "Uludağ", city: "Bursa", level: 18 },
    { id: "bur_19", name: "Cumalıkızık", city: "Bursa", level: 19 },
    { id: "bur_20", name: "Eski Bursa", city: "Bursa", level: 20 },
    { id: "bur_21", name: "Hisar", city: "Bursa", level: 21 },
    { id: "bur_22", name: "Hanlar Bölgesi", city: "Bursa", level: 22 },
  ],
};

/**
 * Tüm bölümleri getir
 */
export function getAllDistricts(): District[] {
  return [
    ...DISTRICTS.istanbul.map(d => ({ ...d, completed: false, score: 0 })),
    ...DISTRICTS.ankara.map(d => ({ ...d, completed: false, score: 0 })),
    ...DISTRICTS.izmir.map(d => ({ ...d, completed: false, score: 0 })),
    ...DISTRICTS.antalya.map(d => ({ ...d, completed: false, score: 0 })),
    ...DISTRICTS.bursa.map(d => ({ ...d, completed: false, score: 0 })),
  ];
}

/**
 * Şehire göre bölümleri getir
 */
export function getDistrictsByCity(city: string): District[] {
  const cityKey = city.toLowerCase().replace(/ı/g, "i") as keyof typeof DISTRICTS;
  const districts = DISTRICTS[cityKey] || [];
  return districts.map(d => ({ ...d, completed: false, score: 0 }));
}

/**
 * Bölüm sayısı
 */
export function getDistrictCount(): number {
  return Object.values(DISTRICTS).reduce((sum, districts) => sum + districts.length, 0);
}

/**
 * Rastgele bölüm seç
 */
export function getRandomDistrict(): District {
  const allDistricts = getAllDistricts();
  return allDistricts[Math.floor(Math.random() * allDistricts.length)];
}

/**
 * Bölüm bilgisi getir
 */
export function getDistrictInfo(districtId: string): District | undefined {
  const allDistricts = getAllDistricts();
  return allDistricts.find(d => d.id === districtId);
}
