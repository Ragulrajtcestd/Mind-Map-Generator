// src/services/api.ts

const API_BASE_URL = "http://127.0.0.1:5000";

// 🔹 EXACT backend keyword shape
export type BackendKeyword = {
  level1: string;
  level2: string[];
};

// 🔹 EXACT backend response shape
export type BackendResponse = {
  title: string;
  keywords: BackendKeyword[];
};

export async function extractKeywords(
  text: string
): Promise<BackendResponse> {
  const response = await fetch(`${API_BASE_URL}/extract_keywords`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to generate mind map");
  }

  return response.json();
}
