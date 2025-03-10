import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Ensure API key is loaded properly
});

export default openai;