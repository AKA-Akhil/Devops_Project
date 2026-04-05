const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function analyzeRepository(repoUrl) {
  const response = await fetch(`${API_BASE}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ repoUrl })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to analyze repository");
  }

  return response.json();
}
