"use server";

import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";

// ✅ API Key Check
const token = process.env.DEEPSEEK_API_KEY;
if (!token) {
  throw new Error("❌ API Key Missing! Make sure DEEPSEEK_API_KEY is set in your .env file.");
}

// ✅ Create DeepSeek Client
const client = ModelClient(
  "https://models.inference.ai.azure.com",
  new AzureKeyCredential(token)
);

// ✅ Function to Call DeepSeek API
async function callDeepSeekAPI(prompt: string) {
  console.log("🚀 Sending request to DeepSeek API...");

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [{ role: "user", content: prompt }],
      model: "DeepSeek-R1",
      max_tokens: 2048,
    },
  });

  if (isUnexpected(response)) {
    console.error("❌ DeepSeek API Error:", response.body.error);
    throw new Error("Failed to generate response from DeepSeek API.");
  }

  const aiResponse = response.body.choices?.[0]?.message?.content;
  console.log("✅ DeepSeek API Response:", aiResponse);
  
  if (!aiResponse) {
    throw new Error("Received empty response from DeepSeek API.");
  }

  return aiResponse;
}

// ✅ Generate Summary Function
export async function generateSummary(input: GenerateSummaryInput) {
  console.log("🚀 Debug: generateSummary function started");

  const { jobTitle } = generateSummarySchema.parse(input);
  const prompt = `You are a job resume AI. Write a professional introduction summary for the job title: ${jobTitle || "N/A"}`;

  return await callDeepSeekAPI(prompt);
}

// ✅ Generate Work Experience Function
export async function generateWorkExperience(input: GenerateWorkExperienceInput) {
  console.log("🚀 Debug: generateWorkExperience function started");

  const { description } = generateWorkExperienceSchema.parse(input);
  const prompt = `Please generate a work experience entry for: ${description}`;

  const aiResponse = await callDeepSeekAPI(prompt);

  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description: ([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience;
}




// ------------------------------------------------OPEN-AI-------------------------------------------------------------------------------------
// "use server";

// import openai from "@/lib/openai";
// import {
//   GenerateSummaryInput,
//   generateSummarySchema,
//   GenerateWorkExperienceInput,
//   generateWorkExperienceSchema,
//   WorkExperience,
// } from "@/lib/validation";

// // ✅ Generate Summary Function
// export async function generateSummary(input: GenerateSummaryInput) {
//   console.log("🚀 Debug: generateSummary function started");

//   if (!process.env.OPENAI_API_KEY) {
//     console.error("❌ ERROR: API Key is missing. Check your environment variables.");
//     throw new Error("API Key is missing. Make sure OPENAI_API_KEY is set in your environment.");
//   }

//   const { jobTitle } = generateSummarySchema.parse(input);
//   const systemMessage = "You are a job resume generator AI. Your task is to write a professional introduction summary for a resume based on the provided data. Keep it concise and professional.";
//   const userMessage = `Job title: ${jobTitle || "N/A"}`;

//   console.log("✅ Sending request to OpenAI API...");
  
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: systemMessage },
//         { role: "user", content: userMessage },
//       ],
//     });

//     const aiResponse = completion.choices[0]?.message?.content;
//     console.log("✅ OpenAI Response:", aiResponse);

//     if (!aiResponse) {
//       throw new Error("Failed to generate AI response");
//     }

//     return aiResponse;
//   } catch (error) {
//     console.error("❌ OpenAI API Error in generateSummary:", error);
//     throw new Error("Failed to generate summary. Please try again.");
//   }
// }

// // ✅ Generate Work Experience Function
// export async function generateWorkExperience(input: GenerateWorkExperienceInput) {
//   console.log("🚀 Debug: generateWorkExperience function started");

//   if (!process.env.OPENAI_API_KEY) {
//     throw new Error("❌ API Key Missing! Check your .env.local file.");
//   }

//   console.log("✅ API Key Loaded:", process.env.OPENAI_API_KEY ? "Yes" : "No");

//   const { description } = generateWorkExperienceSchema.parse(input);
  
//   const systemMessage = "You are a job resume AI. Generate a single work experience entry.";
//   const userMessage = `Please generate a work experience entry for: ${description}`;

//   console.log("✅ Sending request to OpenAI API with:", userMessage);
  
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: systemMessage },
//         { role: "user", content: userMessage },
//       ],
//     });

//     console.log("✅ OpenAI Raw Response:", JSON.stringify(completion, null, 2)); // Full response log

//     if (!completion.choices || completion.choices.length === 0) {
//       throw new Error("❌ OpenAI response is empty.");
//     }

//     const aiResponse = completion.choices[0]?.message?.content;
//     console.log("✅ Parsed AI Response:", aiResponse);

//     if (!aiResponse) {
//       throw new Error("Failed to generate AI response");
//     }

//     return {
//       position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
//       company: aiResponse.match(/Company: (.*)/)?.[1] || "",
//       description: (aiResponse.match(/Description: ([\s\S]*)/)?.[1] || "").trim(),
//       startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
//       endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
//     } satisfies WorkExperience;
//   } catch (error) {
//     console.error("❌ OpenAI API Error in generateWorkExperience:", error);
//     throw new Error("Failed to generate work experience. Please try again.");
//   }
// }