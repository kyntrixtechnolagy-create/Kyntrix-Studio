export const API_URL = import.meta.env.PROD ? "/api" : "http://localhost:5000/api";

export async function fetchFromAPI(endpoint: string, options?: RequestInit) {
  const url = `${API_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || `API request failed with status ${res.status}`);
    }
    return data.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}
