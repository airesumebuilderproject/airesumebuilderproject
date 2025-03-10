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
// ✅ NEW ChatGPT DeepSeek Function For Generate Work Experience Function

export async function generateSummary(input: GenerateSummaryInput) {
  // TODO: Block for non-premium users

  console.log("🚀 Debug: generateSummary function started"); // Debug log added

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  // System message remains the same as OpenAI version
  const systemMessage = `
    You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
    Only return the summary and do not include any other information in the response. Keep it concise and professional.
  `;

  // User message structured the same way as OpenAI version
  const userMessage = `
    Please generate a professional resume summary from this data:

    Job title: ${jobTitle || "N/A"}

    Work experience:
    ${workExperiences
      ?.map(
        (exp) => `
        Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

        Description:
        ${exp.description || "N/A"}
        `,
      )
      .join("\n\n")}

    Education:
    ${educations
      ?.map(
        (edu) => `
        Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
        `,
      )
      .join("\n\n")}

    Skills:
    ${skills}
  `;

  console.log("systemMessage", systemMessage); // Debug log
  console.log("userMessage", userMessage); // Debug log

  // 🔄 OpenAI API ko replace karke DeepSeek API ko call kiya
  const aiResponse = await callDeepSeekAPI(`${systemMessage}\n\n${userMessage}`);

  if (!aiResponse) {
    throw new Error("Failed to generate AI response"); // Error handling remains the same
  }

  return aiResponse;
}

/*----------------------------------------------------GITHUB Original GenerateSummary Function-----------------------------------------------------
export async function generateSummary(input: GenerateSummaryInput) {
  // TODO: Block for non-premium users

  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  const systemMessage = `
    You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
    Only return the summary and do not include any other information in the response. Keep it concise and professional.
    `;

  const userMessage = `
    Please generate a professional resume summary from this data:

    Job title: ${jobTitle || "N/A"}

    Work experience:
    ${workExperiences
      ?.map(
        (exp) => `
        Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

        Description:
        ${exp.description || "N/A"}
        `,
      )
      .join("\n\n")}

      Education:
    ${educations
      ?.map(
        (edu) => `
        Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
        `,
      )
      .join("\n\n")}

      Skills:
      ${skills}
    `;

  console.log("systemMessage", systemMessage);
  console.log("userMessage", userMessage);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  return aiResponse;
}

*/

/* ✅ OLD ChatGPT DeepSeek Code For Generate Summary Function 
export async function generateSummary(input: GenerateSummaryInput) {
  console.log("🚀 Debug: generateSummary function started");

  const { jobTitle } = generateSummarySchema.parse(input);
  const prompt = `You are a job resume AI. Write a professional introduction summary for the job title: ${jobTitle || "N/A"}`;

  return await callDeepSeekAPI(prompt);
}

*/
// ✅ NEW ChatGPT DeepSeek Function For Generate Work Experience Function

export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  // TODO: Block for non-premium users

  console.log("🚀 Debug: generateWorkExperience function started"); // Debug log added

  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `
  You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
  Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.

  Job title: <job title>
  Company: <company name>
  Start date: <format: YYYY-MM-DD> (only if provided)
  End date: <format: YYYY-MM-DD> (only if provided)
  Description: <an optimized description in bullet format, might be inferred from the job title>
  `;

  const userMessage = `
  Please provide a work experience entry from this description:
  ${description}
  `;

  const prompt = `${systemMessage}\n\n${userMessage}`; // Combining system and user message into a single prompt

  // Changed OpenAI API call to DeepSeek API call
  const aiResponse = await callDeepSeekAPI(prompt);

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  console.log("aiResponse", aiResponse); // Debug log added

  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience;
}


/* ✅ OLD ChatGPT DeepSeek Function For Generate Work Experience Function
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
*/


/*----------------------------------------------------GITHUB Original GenerateWorkExperience Function-----------------------------------------------------
export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  // TODO: Block for non-premium users

  const { description } = generateWorkExperienceSchema.parse(input);

  const systemMessage = `
  You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
  Your response must adhere to the following structure. You can omit fields if they can't be infered from the provided data, but don't add any new ones.

  Job title: <job title>
  Company: <company name>
  Start date: <format: YYYY-MM-DD> (only if provided)
  End date: <format: YYYY-MM-DD> (only if provided)
  Description: <an optimized description in bullet format, might be infered from the job title>
  `;

  const userMessage = `
  Please provide a work experience entry from this description:
  ${description}
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const aiResponse = completion.choices[0].message.content;

  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  console.log("aiResponse", aiResponse);

  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience;
}
*/ 


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