import axios from "axios";

export async function enhanceWithModel(input, fallback) {
  const provider = process.env.MODEL_PROVIDER;
  const apiKey = process.env.MODEL_API_KEY;
  const modelName = process.env.MODEL_NAME;
  const baseUrl = process.env.MODEL_BASE_URL;

  if (!provider || !apiKey || !modelName) {
    return fallback;
  }

  try {
    if (provider === "finetuned") {
      if (!baseUrl) {
        return fallback;
      }

      const prompt = [
        "You are a senior software architect and code reviewer.",
        "Return strict JSON with keys: summary, improvements, codeSuggestions, riskForecast, uniqueInsights.",
        "All arrays must contain concise plain strings.",
        "Input:",
        JSON.stringify(input)
      ].join("\n");

      const response = await axios.post(
        `${baseUrl}/chat/completions`,
        {
          model: modelName,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2
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

    return fallback;
  } catch {
    return fallback;
  }
}
