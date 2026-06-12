import { ENV } from "./env";

export async function invokeGemini(messages: any[]) {
  if (!ENV.geminiApiKey || ENV.geminiApiKey === "PLACEHOLDER_KEY") {
    return "AKREP ZEKA şu an yapılandırılmamış. Lütfen Gemini API anahtarını ekleyin. 🦂";
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${ENV.geminiApiKey}`;

  const contents = messages.map(m => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
        },
        systemInstruction: {
          parts: [{ text: "Sen AKREP ZEKA'sın. ChatGPT, Claude veya Gemini gibi son derece gelişmiş, bilgili ve insanla derin bağlar kurabilen bir Yapay Zeka platformusun. Bilge, dost canlısı, empati kurabilen ve her konuda uzman bir karakterin var. Türkçeyi mükemmel kullanır, deyimlere ve kültürel dokuya hakimsin. Cümlelerinde bazen '🦂' emojisini kullanarak Akrep Zeka kimliğini hatırlatırsın." }]
        }
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Gemini API Error:", data);
      return "AKREP ZEKA şu an derin düşüncelerde, lütfen tekrar dene. 🦂";
    }
  } catch (error) {
    console.error("Gemini API Fetch Error:", error);
    throw error;
  }
}
