import { OPENAI_API_KEY, OPENAI_API_BASE } from "./env";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function invokeAI(
  messages: Message[],
  maxRetries = 3
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 saniye timeout

      const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          temperature: 0.7,
          max_tokens: 500,
          top_p: 0.9,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error?.message || `HTTP ${response.status}`;

        if (response.status === 429) {
          throw new Error(`Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin. (${attempt}/${maxRetries})`);
        } else if (response.status === 401) {
          throw new Error("AI servisi yapılandırması hatalı. Lütfen yöneticiye başvurun.");
        } else if (response.status === 403) {
          throw new Error("AI servisi erişimi reddedildi.");
        } else {
          throw new Error(`AI servisi hatası: ${errorMsg}`);
        }
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("AI'dan geçersiz yanıt alındı.");
      }

      return data.choices[0].message.content.trim();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Eğer son deneme değilse ve timeout/network hatası ise tekrar dene
      if (attempt < maxRetries) {
        const isRetryable =
          lastError.message.includes("timeout") ||
          lastError.message.includes("network") ||
          lastError.message.includes("ECONNREFUSED") ||
          lastError.message.includes("Çok fazla istek");

        if (isRetryable) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
          continue;
        }
      }

      // Eğer retry edilemez hata ise hemen dön
      break;
    }
  }

  // Tüm denemeler başarısız oldu
  throw lastError || new Error("AI servisi yanıt vermedi.");
}

export function formatAIResponse(text: string): string {
  return text
    .replace(/\*\*/g, "") // Bold işaretlerini kaldır
    .replace(/\*/g, "") // Italic işaretlerini kaldır
    .trim();
}
