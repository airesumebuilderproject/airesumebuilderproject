"use server";

import openai from "@/lib/openai";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";

// ✅ Generate Summary Function
export async function generateSummary(input: GenerateSummaryInput) {
  console.log("🚀 Debug: generateSummary function started");

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ ERROR: API Key is missing. Check your environment variables.");
    throw new Error("API Key is missing. Make sure OPENAI_API_KEY is set in your environment.");
  }

  const { jobTitle } = generateSummarySchema.parse(input);
  const systemMessage = "You are a job resume generator AI. Your task is to write a professional introduction summary for a resume based on the provided data. Keep it concise and professional.";
  const userMessage = `Job title: ${jobTitle || "N/A"}`;

  console.log("✅ Sending request to OpenAI API...");
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
    });

    const aiResponse = completion.choices[0]?.message?.content;
    console.log("✅ OpenAI Response:", aiResponse);

    if (!aiResponse) {
      throw new Error("Failed to generate AI response");
    }

    return aiResponse;
  } catch (error) {
    console.error("❌ OpenAI API Error in generateSummary:", error);
    throw new Error("Failed to generate summary. Please try again.");
  }
}

// ✅ Generate Work Experience Function
export async function generateWorkExperience(input: GenerateWorkExperienceInput) {
  console.log("🚀 Debug: generateWorkExperience function started");

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("❌ API Key Missing! Check your .env.local file.");
  }

  const { description } = generateWorkExperienceSchema.parse(input);
  
  const systemMessage = "You are a job resume AI. Generate a single work experience entry.";
  const userMessage = `Please generate a work experience entry for: ${description}`;

  console.log("✅ Sending request to OpenAI API...");
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
      ],
    });

    console.log("✅ OpenAI Raw Response:", JSON.stringify(completion, null, 2)); // Log Full API Response

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error("❌ OpenAI response is empty. Debug the API call.");
    }

    const aiResponse = completion.choices[0]?.message?.content;
    console.log("✅ Parsed AI Response:", aiResponse);

    if (!aiResponse) {
      throw new Error("Failed to generate AI response");
    }

    return {
      position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
      company: aiResponse.match(/Company: (.*)/)?.[1] || "",
      description: (aiResponse.match(/Description: ([\s\S]*)/)?.[1] || "").trim(),
      startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
      endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
    } satisfies WorkExperience;
  } catch (error) {
    console.error("❌ OpenAI API Error in generateWorkExperience:", error);
    throw new Error("Failed to generate work experience. Please try again.");
  }
}


// ------------------------------------------------------------------------------------------------------------------------------------------
// "use server";

// import openai from "@/lib/openai";
// import {
//   GenerateSummaryInput,
//   generateSummarySchema,
//   GenerateWorkExperienceInput,
//   generateWorkExperienceSchema,
//   // WorkExperience,
// } from "@/lib/validation";

// export async function generateSummary(input: GenerateSummaryInput) {
//   try {
//     const { jobTitle, workExperiences, educations, skills } = generateSummarySchema.parse(input);

//     const systemMessage = `
//       You are a job resume generator AI. Your task is to write a professional introduction summary for a resume.
//       Only return the summary and do not include any other information.
//     `;

//     const userMessage = `
//       Please generate a resume summary from this data:

//       Job title: ${jobTitle || "N/A"}
//       Work experience: ${workExperiences?.map(exp => `Position: ${exp.position} at ${exp.company}`).join("\n")}
//       Education: ${educations?.map(edu => `Degree: ${edu.degree} at ${edu.school}`).join("\n")}
//       Skills: ${skills}
//     `;

//     console.log("📌 Sending request to OpenAI...");

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: systemMessage },
//         { role: "user", content: userMessage },
//       ],
//     });

//     const aiResponse = completion.choices[0]?.message?.content;

//     if (!aiResponse) {
//       throw new Error("❌ OpenAI response is empty!");
//     }

//     return aiResponse;
//   } catch (error) {
//     console.error("⚠️ Error generating summary:", error);
//     throw new Error("Failed to generate summary. Please try again.");
//   }
// }

// export async function generateWorkExperience(input: GenerateWorkExperienceInput) {
//   // try {
//     const { description } = generateWorkExperienceSchema.parse(input);

//     const systemMessage = `Generate work experience entry based on description.`;
//     const userMessage = `Description: ${description}`;

//     console.log("📌 Sending request to OpenAI...");

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: systemMessage },
//         { role: "user", content: userMessage },
//       ],
//     });

//     console.log("✅ OpenAI Raw Response:", completion); // Debugging

//     const aiResponse = completion.choices?.[0]?.message?.content;

//     if (!aiResponse) {
//       console.error("❌ OpenAI response is empty!");
//       throw new Error("❌ OpenAI response is empty!");
//     }

//     console.log("✅ AI Response Content:", aiResponse);

//     return {
//       position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
//       company: aiResponse.match(/Company: (.*)/)?.[1] || "",
//       description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
//       startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
//       endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
//     };
//   }
//   } catch (error) {
//     console.error("⚠️ Error generating work experience:", error);
//     throw new Error(`Failed to generate work experience. Error: \n\n`);
//   }
// }


// export async function generateWorkExperience(input: GenerateWorkExperienceInput) {
//   try {
//     const { description } = generateWorkExperienceSchema.parse(input);

//     const systemMessage = `
//       You are an AI that generates work experience entries for resumes.
//       Provide details in the structured format given below.
//     `;

//     const userMessage = `Generate a work experience entry for: ${description}`;

//     console.log("📌 Sending request to OpenAI...");

//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [
//         { role: "system", content: systemMessage },
//         { role: "user", content: userMessage },
//       ],
//     });

//     const aiResponse = completion.choices[0]?.message?.content;

//     if (!aiResponse) {
//       throw new Error("❌ OpenAI response is empty!");
//     }

//     console.log("✅ AI Response:", aiResponse);

//     return {
//       position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
//       company: aiResponse.match(/Company: (.*)/)?.[1] || "",
//       description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
//       startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
//       endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
//     } satisfies WorkExperience;
//   } catch (error) {
//     console.error("⚠️ Error generating work experience:", error);
//     throw new Error("Failed to generate work experience. Please try again.");
//   }
// }
// --------------------------------------------------------------------------------------------------------------------------

// "use server";

// import openai from "@/lib/openai";
// import {
//   GenerateSummaryInput,
//   generateSummarySchema,
//   GenerateWorkExperienceInput,
//   generateWorkExperienceSchema,
//   WorkExperience,
// } from "@/lib/validation";

// export async function generateSummary(input: GenerateSummaryInput) {
//   // TODO: Block for non-premium users

//   const { jobTitle, workExperiences, educations, skills } =
//     generateSummarySchema.parse(input);

//   const systemMessage = `
//     You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
//     Only return the summary and do not include any other information in the response. Keep it concise and professional.
//     `;

//   const userMessage = `
//     Please generate a professional resume summary from this data:

//     Job title: ${jobTitle || "N/A"}

//     Work experience:
//     ${workExperiences
//       ?.map(
//         (exp) => `
//         Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

//         Description:
//         ${exp.description || "N/A"}
//         `,
//       )
//       .join("\n\n")}

//       Education:
//     ${educations
//       ?.map(
//         (edu) => `
//         Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
//         `,
//       )
//       .join("\n\n")}

//       Skills:
//       ${skills}
//     `;

//   console.log("systemMessage", systemMessage);
//   console.log("userMessage", userMessage);

//   const completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content: systemMessage,
//       },
//       {
//         role: "user",
//         content: userMessage,
//       },
//     ],
//   });

//   const aiResponse = completion.choices[0].message.content;

//   if (!aiResponse) {
//     throw new Error("Failed to generate AI response");
//   }

//   return aiResponse;
// }

// export async function generateWorkExperience(
//   input: GenerateWorkExperienceInput,
// ) {
//   // TODO: Block for non-premium users

//   const { description } = generateWorkExperienceSchema.parse(input);

//   const systemMessage = `
//   You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
//   Your response must adhere to the following structure. You can omit fields if they can't be infered from the provided data, but don't add any new ones.

//   Job title: <job title>
//   Company: <company name>
//   Start date: <format: YYYY-MM-DD> (only if provided)
//   End date: <format: YYYY-MM-DD> (only if provided)
//   Description: <an optimized description in bullet format, might be infered from the job title>
//   `;

//   const userMessage = `
//   Please provide a work experience entry from this description:
//   ${description}
//   `;

//   const completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       {
//         role: "system",
//         content: systemMessage,
//       },
//       {
//         role: "user",
//         content: userMessage,
//       },
//     ],
//   });

//   const aiResponse = completion.choices[0].message.content;

//   if (!aiResponse) {
//     throw new Error("Failed to generate AI response");
//   }

//   console.log("aiResponse", aiResponse);

//   return {
//     position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
//     company: aiResponse.match(/Company: (.*)/)?.[1] || "",
//     description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
//     startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
//     endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
//   } satisfies WorkExperience;
// }