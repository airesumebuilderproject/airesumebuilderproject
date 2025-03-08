import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // API key environment variable se le rahe hain
});

export default openai;


// import OpenAI from "openai";

// const openai = new OpenAI();

// export default openai;