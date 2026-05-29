import { GoogleGenerativeAI } from "@google/generative-ai";

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      tools: [{ googleSearch: {} }],
  });

  const response = await model.generateContent("evaluate screen time before bed for sleep");
  
  const groundingMetadata = response.response.candidates?.[0]?.groundingMetadata;
  if (groundingMetadata?.groundingChunks) {
    console.log(JSON.stringify(groundingMetadata.groundingChunks, null, 2));
  } else {
    console.log("No grounding chunks found");
  }
}

run().catch(console.error);
