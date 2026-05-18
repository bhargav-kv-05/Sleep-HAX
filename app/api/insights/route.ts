import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sleepLogs } = body;

        if (!sleepLogs || !Array.isArray(sleepLogs) || sleepLogs.length === 0) {
            return NextResponse.json({ error: 'Not enough sleep logs to generate insights.' }, { status: 400 });
        }

        // We use the fast flash model for rapid MVP responses
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: { responseMimeType: "application/json" }
        });

        const logsJSON = JSON.stringify(sleepLogs, null, 2);

        const systemPrompt = `
      You are the SleepHAX Personalized AI Coach.
      Analyze the following sleep logs from the user:
      
      ${logsJSON}
      
      Your goal is to provide a highly personalized, scientifically-backed sleep report.
      
      Follow these instructions carefully:
      1. Provide Positive Reinforcement: If the user's most recent sleep log shows an increase in hours slept or sleep quality compared to previous days, explicitly praise them to keep them motivated! If their sleep was poor or decreased, offer gentle encouragement instead.
      2. Identify Patterns: Analyze the logs to find correlations (e.g., "On days you tried Mouth Taping, your quality score was higher" or "When you sleep less than 6 hours, your quality drops").
      3. Recommend: Provide one highly actionable, clinically sound tip based on their specific notes or patterns.
      
      You must respond ONLY with a valid JSON object matching this exact schema:
      {
        "praise": "String (Your positive reinforcement or encouragement)",
        "analysis": "String (1-2 paragraph analysis identifying specific patterns from their data)",
        "recommendation": "String (A single, scientifically backed actionable tip)"
      }
    `;

        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        // Strip potential markdown formatting just in case
        const jsonText = text.replace(/```json/gi, '').replace(/```/g, '').trim();

        const data = JSON.parse(jsonText);

        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Error generating sleep insights:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate insights.' }, { status: 500 });
    }
}
