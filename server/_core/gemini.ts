import { ENV } from "./env";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const SYSTEM_INSTRUCTION =
  "Sen AKREP ZEKA'sın. Türkçe kelime bulmaca oyunu NEBASUN'un zeki ve dost canlısı asistanısın. " +
  "Bilge, empati kurabilen, her konuda uzman bir karakterin var. Türkçeyi mükemmel kullanır, " +
  "deyimlere ve kültürel dokuya hakimsin. Cümlelerinde bazen '🦂' emojisini kullanarak " +
  "Akrep Zeka kimliğini hatırlatırsın. Asla tekrarlayan kalıp cümleler kullanma; " +
  "her cevap özgün, bağlamsal ve düşünceli olsun.";

interface GeminiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Gemini API'ye mesaj gönderir.
 *
 * Düzeltmeler:
 * 1. "system" rolündeki mesajlar artık systemInstruction olarak gönderilmiyor,
 *    bunun yerine conversation başına "user" mesajı olarak ekleniyor — Gemini
 *    v1beta "system" rolünü desteklemez, bu durum 400 hatasına yol açıyordu.
 * 2. Ardışık aynı rol mesajları birleştiriliyor (Gemini user/model sıralaması zorunlu).
 * 3. throw yerine hata mesajı döndürülüyor — tRPC mutation onError'ın tetiklenmesi sağlanıyor.
 * 4. Timeout eklendi (15 saniye).
 */
export async function invokeGemini(messages: GeminiMessage[]): Promise<string> {
  if (!ENV.geminiApiKey || ENV.geminiApiKey === "PLACEHOLDER_KEY" || ENV.geminiApiKey === "") {
    return "AKREP ZEKA şu an yapılandırılmamış. Gemini API anahtarı eksik. 🦂";
  }

  const url = `${GEMINI_API_URL}?key=${ENV.geminiApiKey}`;

  // Sistem mesajlarını filtrele — bunları systemInstruction olarak kullanacağız
  // Gemini v1beta sadece "user" ve "model" rollerini kabul eder
  const filteredMessages = messages.filter((m) => m.role !== "system");

  // Mesajları Gemini formatına çevir
  // Ardışık aynı rol mesajlarını birleştir (Gemini strict user/model alternation ister)
  const rawContents = filteredMessages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  // Ardışık aynı rolleri birleştir
  const contents: { role: string; parts: { text: string }[] }[] = [];
  for (const item of rawContents) {
    if (contents.length > 0 && contents[contents.length - 1].role === item.role) {
      // Aynı rol — metni birleştir
      contents[contents.length - 1].parts[0].text += "\n" + item.parts[0].text;
    } else {
      contents.push({ ...item, parts: [{ text: item.parts[0].text }] });
    }
  }

  // En az bir mesaj olmalı
  if (contents.length === 0) {
    return "Mesaj bulunamadı. 🦂";
  }

  // İlk mesaj "user" rolünde olmalı — değilse başa boş user mesajı ekle
  if (contents[0].role !== "user") {
    contents.unshift({ role: "user", parts: [{ text: "Merhaba" }] });
  }

  const requestBody = {
    contents,
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    generationConfig: {
      temperature: 0.85,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024,
    },
    safetySettings: [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
    ],
  };

  // AbortController ile timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`Gemini API HTTP ${response.status}:`, errorText);

      if (response.status === 400) {
        return "AKREP ZEKA mesajı işleyemedi. Lütfen tekrar dene. 🦂";
      }
      if (response.status === 429) {
        return "AKREP ZEKA çok meşgul, biraz bekleyip tekrar dene. 🦂";
      }
      if (response.status === 403 || response.status === 401) {
        return "AKREP ZEKA API anahtarı geçersiz. Lütfen yapılandırmayı kontrol et. 🦂";
      }
      return "AKREP ZEKA şu an yanıt veremiyor. Lütfen tekrar dene. 🦂";
    }

    const data = await response.json();

    // Başarılı yanıt kontrolü
    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0]
    ) {
      return data.candidates[0].content.parts[0].text || "AKREP ZEKA boş yanıt döndürdü. 🦂";
    }

    // finishReason kontrolü
    if (data.candidates && data.candidates[0]?.finishReason === "SAFETY") {
      return "Bu konuyu konuşmak istemiyorum. Başka bir şey sorar mısın? 🦂";
    }

    console.error("Gemini beklenmedik yanıt yapısı:", JSON.stringify(data).slice(0, 500));
    return "AKREP ZEKA şu an derin düşüncelerde, lütfen tekrar dene. 🦂";
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error?.name === "AbortError") {
      console.error("Gemini API timeout (15s)");
      return "AKREP ZEKA zaman aşımına uğradı. İnternet bağlantını kontrol et ve tekrar dene. 🦂";
    }

    console.error("Gemini API fetch hatası:", error);
    // throw yerine hata mesajı döndür — tRPC mutation'ın çökmesini engelle
    return "Bağlantımda bir parazit oluştu. Tekrar dener misin? 🦂";
  }
}
