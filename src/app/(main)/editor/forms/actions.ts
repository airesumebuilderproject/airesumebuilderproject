"use server";

import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { GenerateSummaryInput, generateSummarySchema, GenerateWorkExperienceInput, generateWorkExperienceSchema, WorkExperience } from "@/lib/validation";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Fetch API key from environment variables
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Missing API Key. Please set OPENAI_API_KEY in your .env file.");
}

const client = ModelClient("https://models.inference.ai.azure.com", new AzureKeyCredential(apiKey));

/**
 * Function to generate a summary for a resume using Azure AI Inference API
 */
export async function generateSummary(input: GenerateSummaryInput) {
  const { jobTitle, workExperiences, educations, skills } = generateSummarySchema.parse(input);

  const messages = [
    { role: "system", content: "You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data. Only return the summary and do not include any other information in the response. Keep it concise and professional." },
    { role: "user", content: `Please generate a professional resume summary from this data:\n\nJob title: ${jobTitle || "N/A"}\n\nWork experience:\n${workExperiences?.map(exp => `Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}\n\nDescription:\n${exp.description || "N/A"}`).join("\n\n")}\n\nEducation:\n${educations?.map(edu => `Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}`).join("\n\n")}\n\nSkills:\n${skills}` }
  ];

  try {
    const response = await client.path("/chat/completions").post({
      body: { messages, model: "DeepSeek-R1", max_tokens: 2048 }
    });

    if (isUnexpected(response)) {
      throw new Error("Failed to generate AI response");
    }

    return response.body.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating AI summary:", error);
    throw new Error("AI API request failed");
  }
}

/**
 * Function to generate a work experience entry using Azure AI Inference API
 */
export async function generateWorkExperience(input: GenerateWorkExperienceInput) {
  const { description } = generateWorkExperienceSchema.parse(input);

  const messages = [
    { role: "system", content: "You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input. Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.\n\nJob title: <job title>\nCompany: <company name>\nStart date: <format: YYYY-MM-DD> (only if provided)\nEnd date: <format: YYYY-MM-DD> (only if provided)\nDescription: <an optimized description in bullet format, might be inferred from the job title>" },
    { role: "user", content: `Please provide a work experience entry from this description:\n${description}` }
  ];

  try {
    const response = await client.path("/chat/completions").post({
      body: { messages, model: "DeepSeek-R1", max_tokens: 2048 }
    });

    if (isUnexpected(response)) {
      throw new Error("Failed to generate AI response");
    }

    const aiResponse = response.body.choices?.[0]?.message?.content || "";
    console.log("aiResponse", aiResponse);

    return {
      position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
      company: aiResponse.match(/Company: (.*)/)?.[1] || "",
      description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
      startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
      endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
    } satisfies WorkExperience;
  } catch (error) {
    console.error("Error generating work experience:", error);
    throw new Error("AI API request failed");
  }
}
