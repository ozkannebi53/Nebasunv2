# NEBASUN Oyun Tasarımı v5.0 — Referans Analiz

## Referans Fotoğrafından Alınan Tasarım Prensipleri

### Üst Bölüm (Crossword Grid)
- **Konumlandırma:** Ekranın üst %40'ı
- **Görünüm:** Beyaz arka plan üzerine koyu mavi/teal kutular
- **Bulunan Kelimeler:** KALE, ELMA (koyu mavi kutular, beyaz yazı)
- **Boş Kutular:** Açık mavi/gri kutular (çapraz bulmaca formatı)
- **Amaç:** Bulunan kelimeleri göstermek
- **İpucu:** YOK — sadece bulunan kelimeler gösterilir

### Ortadaki Bölüm (Hedef/Başlık)
- **"KALEM" Yazısı:** Koyu mavi oval buton
- **Amaç:** Bulunması gereken kelimeyi göstermek
- **KALDIRMA:** Bu bölüm kaldırılacak (ipucu olduğu için)

### Alt Bölüm (Harf Çemberi)
- **Arka Plan:** Beyaz dairesel alan (çemberin arka planı)
- **Harfler:** 5 tane koyu mavi daire (M, L, K, E, A)
- **Harf Boyutu:** Büyük, okunması kolay
- **Çizgiler:** Koyu mavi çizgiler harfler arasında (seçilen yol)
- **Sürükleme:** Harften harfe sürüklenirken çizgi oluşturulur
- **Animasyon:** Çizgi gerçek zamanlı güncellenir
- **İpucu Butonu:** Sağ üstte "3" yazılı buton (ipucu sayısı)

### Renk Şeması
- **Arka Plan:** Mavi gradient (gökyüzü, deniz)
- **Çember Arka Planı:** Beyaz dairesel alan
- **Harfler:** Koyu teal/lacivert daireler
- **Yazı:** Beyaz
- **Çizgiler:** Koyu teal, kalın
- **Kutular:** Koyu teal (bulunan), açık gri (boş)

## Bölüm Sistemi (Her Şehirde 20+ Bölüm)

### İstanbul Bölümleri (20+)
1. Fatih
2. Beyoğlu
3. Beşiktaş
4. Sarıyer
5. Şişli
6. Kadıköy
7. Üsküdar
8. Bostancı
9. Maltepe
10. Pendik
11. Tuzla
12. Çekmeköy
13. Ataşehir
14. Maslak
15. Levent
16. Etiler
17. Arnavutköy
18. Eyüp
19. Balat
20. Eminönü
21. Galata
22. Topkapı

### Ankara Bölümleri (20+)
1. Çankaya
2. Keçiören
3. Mamak
4. Altındağ
5. Cebeci
6. Dikmen
7. Kızılay
8. Tunalı Hilmi
9. Bahçelievler
10. Balgat
11. Çayyolu
12. Oran
13. Gaziosmanpaşa
14. Ayrancı
15. Demetevler
16. Emek
17. Kavaklıdere
18. Maltepe
19. Ankara Kalesi
20. Ulus
21. Samanpazarı
22. Hamamönü

## Oyun Akışı

### Başlangıç
- Kullanıcı bölüm seçer (İstanbul → Fatih)
- Rastgele 3-6 harfli kelime seçilir
- Harfler rastgele karıştırılır

### Oyun Sırasında
1. Kullanıcı harften harfe sürükler
2. Sürükleme sırasında çizgi görülür
3. Dokunma serbest bırakıldığında:
   - Kelime doğru ise: Başarı animasyonu, puan kazanma
   - Kelime yanlış ise: Hata animasyonu, tekrar dene
4. Bulunan kelimeler üst bölümde gösterilir

### Bitişte
- Tüm kelimeler bulunduğunda: Bölüm tamamlandı
- Sonraki bölüme geç veya harita dön

## Teknik Detaylar

### Harf Sürükleme
- PanResponder veya GestureHandler kullanılacak
- Sürükleme sırasında çizgi gerçek zamanlı çizilecek
- Dokunma serbest bırakıldığında kelime doğrulanacak

### Çizgi Çizimi
- SVG veya Canvas kullanılabilir
- Koyu teal renk, kalın çizgi
- Harfler arasında bağlantı gösterilecek

### Animasyonlar
- Başarı: Harfler titrer, puan gösterilir
- Hata: Çizgi kırmızıya dönüp kayboluyor
- Kelime bulunduğunda: Üst bölüme harfler kaydırılır

## Kaldırılacak Öğeler
- ❌ "KALEM" (hedef kelime) — ipucu olduğu için
- ❌ İpucu butonu — sadece oyun olacak
- ❌ Cümle sistemi — sadece kelime bulma
- ❌ Onaylama butonu — dokunma serbest bırakıldığında otomatik
