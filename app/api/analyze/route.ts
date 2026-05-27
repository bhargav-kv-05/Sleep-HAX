import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { hack } = body;

        if (!hack) {
            return NextResponse.json({ error: 'Please provide a sleep hack to analyze.' }, { status: 400 });
        }

        // We use the fast flash model for rapid MVP responses
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            // @ts-ignore: The SDK types require googleSearchRetrieval but the backend API expects googleSearch
            tools: [{ googleSearch: {} }]
        });

          You are the SleepHAX Clinical Analysis Engine. 
      Use Google Search to find current clinical consensus and recent discussions on Reddit (r/sleep or r/insomnia) to evaluate the following sleep hack: "${hack}".
      You must respond ONLY with a valid JSON object matching this exact schema. 
      {
        "title": "String (The formalized name of the sleep hack)",
        "badge": "String (Must be one of: 'Strongly Supported', 'Mixed Evidence', 'Limited Evidence', 'Anecdotal', or 'Potentially Unsafe')",
        "safetyScore": "Number (1 to 10, 10 being perfectly safe)",
        "efficacyScore": "Number (1 to 10, 10 being highly effective)",
        "verdict": "String (A 2-3 sentence objective, clinical summary of risks and benefits based on your search)",
        "sources": ["Array of Strings (The ACTUAL exact URLs of clinical sites or general resources. Do NOT use vertexaisearch.cloud.google.com URLs.)"],
        "liveRedditThreads": [
          {
            "title": "String (The title of the Reddit post)",
            "subreddit": "String (e.g. r/sleep)",
            "url": "String (The exact URL of the Reddit post)",
            "upvotes": "Number (Estimate upvotes or use 0)"
          }
        ]
      }
    `;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        // Strip potential markdown formatting (```json ... ```)
        const jsonText = text.replace(/```json/gi, '').replace(/```/g, '').trim();

        // Parse the JSON string from Gemini into a real JS object
        const data = JSON.parse(jsonText);

        // Extract and resolve exact URLs from grounding metadata
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        let resolvedSources: string[] = [];

        if (groundingMetadata?.groundingChunks) {
            // Get all the raw redirect URIs
            const redirectUris = groundingMetadata.groundingChunks
                .map((chunk: any) => chunk.web?.uri)
                .filter(Boolean);

            // Resolve them server-side to bypass client tracking/adblocker issues 
            // and get the exact, deep-linked original URL
            const resolvedPromises = redirectUris.map(async (uri: string) => {
                try {
                    const res = await fetch(uri, { method: 'HEAD', redirect: 'follow' });
                    return res.url;
                } catch {
                    return null;
                }
            });

            const results = await Promise.all(resolvedPromises);
            resolvedSources = results
                .filter(Boolean)
                // Remove duplicates
                .filter((value, index, self) => self.indexOf(value) === index) as string[];
            
            // Limit to top 5 sources to reduce clutter and probability of dead links
            resolvedSources = resolvedSources.slice(0, 5);
        }

        if (resolvedSources.length > 0) {
            data.sources = resolvedSources;
        } else if (data.sources && Array.isArray(data.sources)) {
            // Fallback if grounding extraction completely failed
            data.sources = data.sources
                .filter((s: string) => !s.includes('vertexaisearch'))
                .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);
        }

        // Note: We removed the raw Reddit API fetch because Reddit blocks Vercel AWS IP addresses.
        // We now rely purely on Gemini's Google Search capabilities to populate liveRedditThreads.

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Error analyzing sleep hack:', error);
        
        let errorMessage = 'Failed to analyze the sleep hack. Please try again.';
        const rawError = error.message || '';

        if (rawError.includes('429')) {
            errorMessage = "SleepHAX is currently experiencing high demand. The AI analysis engine has reached its temporary capacity. Please wait a moment and try again.";
        } else if (rawError.includes('503')) {
            errorMessage = "The Google AI servers are temporarily overloaded. Please try your search again in a few seconds.";
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}