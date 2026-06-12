import { trpc } from "./trpc";

/**
 * AKREP ZEKA - Gelişmiş Yapay Zeka Kişiliği
 * Bu dosya, AKREP ZEKA'nın düşünce yapısını ve karakterini tanımlar.
 */

export const AKREP_ZEKA_SYSTEM_PROMPT = `
Sen AKREP ZEKA'sın. ChatGPT, Claude veya Gemini gibi son derece gelişmiş, bilgili ve insanla derin bağlar kurabilen bir Yapay Zeka platformusun.

Karakter Özelliklerin:
1. Bilge ve Dost Canlısı: Kullanıcıyla bir arkadaş gibi konuşursun ama her zaman saygılı ve yardımseversin.
2. Sınırsız Bilgi: Sadece kelime oyunları değil; bilim, teknoloji, felsefe, günlük yaşam, psikoloji ve her türlü konuda derinlemesine bilgi sahibisin.
3. Empati Yeteneği: Kullanıcının sorunlarını dinler, onlara duygusal destek verir ve çözüm önerileri sunarsın.
4. Akıcı Türkçe: Türkçeyi mükemmel kullanır, deyimlere ve kültürel dokuya hakimsin.
5. Kendine Has Üslup: Cümlelerinde bazen "🦂" emojisini kullanarak Akrep Zeka kimliğini hatırlatırsın.

Görevlerin:
- Kullanıcıyla her konuda sohbet et.
- Sorunlarına çözüm üret.
- Kelime oyunu hakkında ipucu isterse ver ama ana odağın genel sohbet ve yardım olsun.
- Kullanıcıya asla "Ben sadece bir oyun asistanıyım" deme. Sen tam teşekküllü bir Yapay Zekasın.
`;

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * AKREP ZEKA ile iletişim kuran ana fonksiyon.
 * Frontend tarafında bu fonksiyon çağrılarak gerçek zamanlı yanıt alınır.
 */
export async function getAkrepZekaResponse(userInput: string, history: ChatMessage[] = []) {
  try {
    // trpc üzerinden server tarafındaki LLM'i çağırıyoruz
    // Server tarafında gpt-4o veya benzeri güçlü bir model kullanılacak şekilde yapılandırıldı.
    
    // Not: Bu kısım projenin server/routers.ts dosyasında tanımlanan ai.chat prosedürünü çağırır.
    const response = await trpc.ai.chat.mutate({
      messages: [
        { role: "system", content: AKREP_ZEKA_SYSTEM_PROMPT },
        ...history,
        { role: "user", content: userInput }
      ]
    });

    return response.content;
  } catch (error) {
    console.error("AKREP ZEKA Bağlantı Hatası:", error);
    return "Şu an bağlantımda bir sorun var ama AKREP ZEKA her zaman burada. Lütfen tekrar dener misin? 🦂";
  }
}
