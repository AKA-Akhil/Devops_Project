import axios from "axios";

const ANALYSIS_PROMPT_PREFIX = [
  "You are a senior software architect and code reviewer.",
  "Return strict JSON with keys: summary, improvements, codeSuggestions, riskForecast, uniqueInsights.",
  "All arrays must contain concise plain strings.",
  "Input:"
].join("\n");

export async function enhanceWithModel(input, fallback) {
  const provider = process.env.MODEL_PROVIDER;
  const apiKey = process.env.MODEL_API_KEY;
  const modelName = process.env.MODEL_NAME;

  if (!provider || !apiKey || !modelName) {
    return fallback;
  }

  try {
    if (provider === "fine-tuned") {
      const baseUrl = (process.env.MODEL_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
      const url = `${baseUrl}/chat/completions`;
      const prompt = `${ANALYSIS_PROMPT_PREFIX}\n${JSON.stringify(input)}`;

      const response = await axios.post(
        url,
        {
          model: modelName,
          messages: [{ role: "user", content: prompt }]
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );

      const raw = response.data?.choices?.[0]?.message?.content || "";
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return fallback;
      return { ...fallback, ...JSON.parse(jsonMatch[0]) };
    }

    if (provider === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const prompt = `${ANALYSIS_PROMPT_PREFIX}\n${JSON.stringify(input)}`;

      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }]
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
