const DEEPSEEK_API_URL = "https://api.deepseek.com/v1"; // ✅ DeepSeek API ka endpoint
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY; // ✅ Token from .env file

export async function fetchDeepSeekResponse(query: string) {
  if (!DEEPSEEK_API_KEY) {
    console.error("DeepSeek API Key is missing!");
    return { error: "Server configuration issue. Contact support." };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // ✅ 10s timeout

    const response = await fetch(`${DEEPSEEK_API_URL}/search?query=${query}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      if (response.status === 429) {
        console.warn("Rate limit exceeded! Retrying in 2 sec...");
        await new Promise((resolve) => setTimeout(resolve, 2000)); // ✅ Retry after 2s
        return fetchDeepSeekResponse(query);
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("DeepSeek API Error:", error.message); // ✅ TypeScript Error Fixed
      return { error: error.message };
    } else {
      console.error("Unknown error:", error);
      return { error: "An unexpected error occurred." };
    }
  }
}


// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,  // Ensure API key is loaded properly
// });

// export default openai;