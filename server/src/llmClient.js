import axios from "axios";

export async function enhanceWithModel(input, fallback) {
  const provider = process.env.MODEL_PROVIDER;
  const apiKey = process.env.MODEL_API_KEY;
  const modelName = process.env.MODEL_NAME;

  if (!provider || !apiKey || !modelName) {
    return fallback;
  }

  try {
    if (provider === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const prompt = [
        "You are a senior software architect and code reviewer.",
        "Return strict JSON with keys: summary, improvements, codeSuggestions, riskForecast, uniqueInsights.",
        "All arrays must contain concise plain strings.",
        "Input:",
        JSON.stringify(input)
      ].join("\n");

      const response = await axios.post(url, {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      });

      const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return fallback;
      return { ...fallback, ...JSON.parse(jsonMatch[0]) };
    }

    return fallback;
  } catch {
    return fallback;
  }
}
