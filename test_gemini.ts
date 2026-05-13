import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: "application/json" }
});

const systemPrompt = `
You are the SleepHAX Clinical Analysis Engine. Evaluate the following sleep hack: "Mouth Taping".
You must respond ONLY with a valid JSON object matching this exact schema. 
{
"title": "String (The formalized name of the sleep hack)",
"badge": "String (Must be one of: 'Strongly Supported', 'Mixed Evidence', 'Limited Evidence', 'Anecdotal', or 'Potentially Unsafe')",
"safetyScore": "Number (1 to 10, 10 being perfectly safe)",
"efficacyScore": "Number (1 to 10, 10 being highly effective)",
"verdict": "String (A 2-3 sentence objective, clinical summary of risks and benefits)"
}
`;

async function test() {
  try {
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const jsonText = response.text();
    console.log("Raw Response:");
    console.log(jsonText);
  } catch (error) {
    console.error("Error:", error);
  }
}
test();
