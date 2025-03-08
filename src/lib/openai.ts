import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("❌ OpenAI API Key is missing in .env file!");
}

console.log("✅ Using OpenAI API Key:", process.env.OPENAI_API_KEY?.slice(0, 5) + "*****"); // Debugging

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ✅ Load API Key from .env
});

export default openai;



// import OpenAI from "openai";

// const openai = new OpenAI();

// export default openai;