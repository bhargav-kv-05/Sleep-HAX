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

        const systemPrompt = `
      You are the SleepHAX Clinical Analysis Engine. 
      Use Google Search to find current clinical consensus AND recent discussions on Reddit (r/sleep or r/insomnia) to evaluate the following sleep hack: "${hack}".
      CRITICAL INSTRUCTION: You MUST find and include at least 2-3 relevant Reddit threads in the liveRedditThreads array. Do NOT omit this array.
      You must respond ONLY with a valid JSON object matching this exact schema. 
      {
        "title": "String (The formalized name of the sleep hack)",
        "badge": "String (Must be one of: 'Strongly Supported', 'Mixed Evidence', 'Limited Evidence', 'Anecdotal', or 'Potentially Unsafe')",
        "safetyScore": "Number (1 to 10, 10 being perfectly safe)",
        "efficacyScore": "Number (1 to 10, 10 being highly effective)",
        "verdict": "String (A 2-3 sentence objective, clinical summary of risks and benefits based on your search)",
        "sources": [
          {
            "title": "String (The exact title of the clinical source or article)",
            "url": "String (The URL of the source)"
          }
        ],
        "liveRedditThreads": [
          {
            "title": "String (The exact title of the relevant Reddit discussion)",
            "subreddit": "String (Must be formatted like 'r/sleep')",
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

        // Completely eliminate AI hallucinations for clinical URLs by relying PURELY on Google's Grounding Metadata.
        // We map the raw web chunks to {title, url} objects for the UI to render beautifully.
        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        let resolvedSources: {title: string, url: string}[] = [];

        if (groundingMetadata?.groundingChunks) {
            const webChunks = groundingMetadata.groundingChunks
                .map((chunk: any) => chunk.web)
                .filter(Boolean);

            resolvedSources = webChunks
                .filter((w: any) => w.uri && !w.uri.includes('reddit.com'))
                .map((w: any) => ({
                    title: w.title,
                    url: w.uri
                }));
            
            // Deduplicate by title to avoid clutter
            resolvedSources = resolvedSources.filter((v, i, a) => a.findIndex(t => (t.title === v.title)) === i).slice(0, 5);
        }
        
        // If Google found verified links, use them. Otherwise, leave it undefined.
        if (resolvedSources.length > 0) {
            data.sources = resolvedSources;
        }

        // Fix AI Hallucinations for Reddit Links:
        // Instead of asking the AI to guess the URL (which causes 404s) or dealing with Reddit's IP blocks,
        // we dynamically generate a bulletproof Reddit Search URL for the exact title the AI found.
        if (data.liveRedditThreads && Array.isArray(data.liveRedditThreads)) {
            data.liveRedditThreads = data.liveRedditThreads.map((thread: any) => {
                const sub = thread.subreddit.startsWith('r/') ? thread.subreddit : `r/${thread.subreddit}`;
                return {
                    title: thread.title,
                    subreddit: sub,
                    upvotes: thread.upvotes || 0,
                    // Bulletproof link: Searches that specific subreddit for the exact discussion title
                    url: `https://www.reddit.com/${sub}/search/?q=${encodeURIComponent(thread.title)}&restrict_sr=1`
                };
            });
        }

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