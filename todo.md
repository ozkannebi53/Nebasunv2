# NEBASUN — Proje TODO

## Tamamlananlar
- [x] Expo proje iskeleti kurulumu
- [x] NEBASUN marka renk paleti (lacivert, mor, altın)
- [x] Tema sistemi (theme.config.js, tailwind.config.js)
- [x] Oyun store (game-store.ts) — şehirler, akrepler, görevler, başarımlar
- [x] Kelime motoru (word-engine.ts) — Türkçe kelime havuzu, bulmaca üretici, Lima yanıtları
- [x] Oyun context (game-context.tsx) — global state, reducer
- [x] Root layout (app/_layout.tsx) — dark mode, GameProvider
- [x] İkon sistemi (icon-symbol.tsx) — NEBASUN için tüm ikonlar
- [x] Tab navigasyonu (_layout.tsx) — 5 sekme
- [x] Ana Menü / Harita ekranı (index.tsx) — şehir kartları, kaynaklar, devam butonu
- [x] Lima Asistan ekranı (lima.tsx) — chat arayüzü, hızlı kelimeler
- [x] Oyun ekranı (game.tsx) — harf çemberi, kelime slotları, kombo sistemi
- [x] PvP Arena ekranı (pvp.tsx) — mod seçimi, rakip arama, liderboard
- [x] Lonca ekranı (guild.tsx) — üyeler, boss savaşları, görevler
- [x] Görevler ekranı (quests.tsx) — günlük/haftalık/aylık, başarımlar
- [x] Profil ekranı (profile.tsx) — istatistikler, akrep koleksiyonu, pasaport
- [x] NEBASUN uygulama ikonu (altın kozmik akrep)
- [x] app.config.ts güncelleme (appName, logoUrl)

## Tasarım Güncellemeleri (v2.0)
- [x] Oyun ekranı görünümü — crossword grid + harf çemberi yeniden tasarla
- [x] Harf çemberi — bağlantı çizgileri, seçili harfler animasyonu
- [x] Crossword grid — boş/dolu kutular, kelime anlamları
- [ ] Şehir arka planları — doğa manzarası görselleri
- [x] Lima AI — gerçek sohbet sistemi (sabit cevaplardan kurtul)
- [x] PvP kod sistemi — 1v1 (2 cihaz), 2v2 (4 cihaz) kod doğrulama
- [x] Giriş ekranı — animasyonlu splash screen
- [x] Renk şeması — referanslara göre mavi/mor gradient

## Oyun Mekaniği Güncellemeleri (v3.0)
- [x] Türkçe kelime havuzu — 5/7/9 harfli sık kullanılan kelimeler
- [x] Harf çemberi — harften harfe çizgi animasyonu
- [x] Dokunma serbest bırakıldığında iptal — onaylama butonu yok
- [x] Kelime doğrulama — isValidWord() fonksiyonu
- [x] Kelime anlamları — getWordMeaning() sözlüğü

## Kelime Havuzu & Lima AI Güncellemeleri (v4.0)
- [x] Kelime havuzu — 3/4/5/6 harfli Türkçe kelimeler (kullanıcı sağladı)
- [x] Rastgele kelime seçimi — her kullanıcıya farklı kombinasyon
- [x] Karışık dağıtım — generateRandomWordSet() fonksiyonu
- [x] Lima AI — tamamen sohbet odaklı (300+ satır konuşma)
- [x] Bağlamsal yanıtlar — konuşma akışı, doğal dil
- [x] Sohbet kategorileri — kelime, strateji, kültür, motivasyon, eğlence vb.

## Gelecek Geliştirmeler
- [ ] Şehir arka planları — doğa manzarası görselleri
- [ ] Ses efektleri — kelime bulma, kombo, hata (expo-audio)
- [ ] Animasyonlar — harfler seçilirken scale/opacity
- [ ] Mağaza ekranı (shop.tsx) — altın/elmas ile ürün satın alma
- [ ] Bildirimler — enerji doldu, lonca görevi
- [ ] Çevrimiçi PvP — gerçek zamanlı düello (WebSocket/Firebase)
- [ ] Lonca sohbet — üyeler arası mesajlaşma
- [ ] Sezon sistemi — sezon sonu ödülleri
