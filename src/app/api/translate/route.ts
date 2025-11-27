import { NextResponse } from "next/server";

type DeepLResponse = {
  translations: Array<{ detected_source_language: string; text: string }>;
};

const cache = new Map<string, string>();

export async function POST(request: Request) {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing DEEPL_API_KEY" }, { status: 500 });
  }

  const body = (await request.json()) as { texts?: string[]; targetLang?: "EN" | "PL" };
  const targetLang = body.targetLang === "EN" || body.targetLang === "PL" ? body.targetLang : "EN";
  const input = Array.isArray(body.texts) ? body.texts.filter((t) => typeof t === "string" && t.trim().length) : [];

  if (!input.length) {
    return NextResponse.json({ translations: {} });
  }

  const unique = Array.from(new Set(input));
  const missing = unique.filter((text) => !cache.has(makeKey(text, targetLang)));

  if (missing.length) {
    const searchParams = new URLSearchParams();
    missing.forEach((text) => searchParams.append("text", text));
    searchParams.append("target_lang", targetLang);
    searchParams.append("source_lang", "PL");

    const deeplResponse = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: searchParams.toString(),
    });

    if (!deeplResponse.ok) {
      const errorText = await deeplResponse.text();
      console.error("DeepL error", errorText);
      return NextResponse.json({ error: "Translation request failed" }, { status: 500 });
    }

    const payload = (await deeplResponse.json()) as DeepLResponse;
    payload.translations.forEach((item, index) => {
      const source = missing[index];
      if (source) {
        cache.set(makeKey(source, targetLang), item.text);
      }
    });
  }

  const translations: Record<string, string> = {};
  unique.forEach((text) => {
    const translated = cache.get(makeKey(text, targetLang));
    if (translated) {
      translations[text] = translated;
    }
  });

  return NextResponse.json({ translations });
}

function makeKey(text: string, lang: string) {
  return `${lang}::${text}`;
}
