import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { DailyLog, AIInsight, WellnessMetrics } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getWellnessInsight = async (
  logs: DailyLog[], 
  userName: string, 
  userRole: string, 
  userGoal: string, 
  metrics: WellnessMetrics,
  language: string = 'en'
): Promise<AIInsight> => {
  const recentLogs = logs.slice(-5); // Last 5 days context
  
  const languageNames: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German'
  };

  const targetLang = languageNames[language] || 'English';

  const prompt = `
    You are ZenBot, an intelligent wellness engine for remote professionals.
    
    USER CONTEXT:
    - Name: ${userName}
    - Role: ${userRole}
    - Primary Goal: ${userGoal.replace(/_/g, ' ')}
    
    CURRENT BIOMETRIC STATE (Calculated):
    - Nervous System State: ${metrics.nervousSystem.label} (${metrics.nervousSystem.description})
    - Stress Score: ${metrics.stressScore}/100 (Lower is better)
    - Energy Score: ${metrics.energyScore}/100 (Higher is better)
    - Recovery Readiness: ${metrics.recoveryScore}/100
    
    KEY FACTORS (Contributors):
    - Positive: ${metrics.contributors.positive.join(', ') || 'None identified'}
    - Negative: ${metrics.contributors.negative.join(', ') || 'None identified'}
    
    RECENT ACTIVITY LOGS:
    ${JSON.stringify(recentLogs.map(l => ({ date: l.date, mood: l.mood, stress: l.stressLevel, hours: l.hoursWorked })), null, 2)}
    
    TASK:
    Generate a daily briefing JSON.
    
    GUIDELINES:
    1. **Tone Adaptation**: 
       - If State is 'Overdrive' or Stress > 70: Use an **empathetic, calming** tone.
       - If State is 'Flow' or Energy > 70: Use an **energetic, encouraging** tone.
       - Otherwise: Use an **analytical, helpful** tone.
    
    2. **"Why do I feel this way?" (Analysis)**:
       - Do NOT diagnose.
       - Use the "Contributors" and "Logs" to explain the score.
       - Example: "Your high stress score stems from working 2 hours over your average yesterday combined with low hydration."
    
    3. **Actionable Step**:
       - Must be a micro-habit (<5 mins).
       - specific to their Goal and State.
    
    OUTPUT FORMAT (Strict JSON):
    {
      "summary": "A 1-sentence high-level summary of their current status.",
      "analysis": "2-3 sentences explaining the 'Why' based on the metrics/contributors provided.",
      "actionableStep": "One specific action to take right now.",
      "tone": "empathetic" | "energetic" | "analytical" | "calm"
    }
    
    IMPORTANT: Respond in ${targetLang}. Only return valid JSON.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    const text = response.text || "{}";
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanJson) as AIInsight;
  } catch (error) {
    console.error("Error generating insight:", error);
    return {
      summary: "Unable to generate briefing.",
      analysis: "We couldn't connect to the insight engine at this moment.",
      actionableStep: "Take a deep breath.",
      tone: "calm"
    };
  }
};