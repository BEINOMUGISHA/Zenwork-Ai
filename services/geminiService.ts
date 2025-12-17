import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { DailyLog, AIInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getWellnessInsight = async (logs: DailyLog[], userName: string, userRole: string, userGoal: string, language: string = 'en'): Promise<AIInsight> => {
  const recentLogs = logs.slice(-7); // Analyze last 7 logs
  
  const languageNames: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German'
  };

  const targetLang = languageNames[language] || 'English';

  // Determine specific context based on role keywords
  let roleContext = "General remote work challenges: boundary setting, sedentary lifestyle, and digital disconnection.";
  const roleLower = (userRole || '').toLowerCase();
  
  if (roleLower.includes('developer') || roleLower.includes('engineer') || roleLower.includes('coder') || roleLower.includes('programmer')) {
    roleContext = "Developer challenges: Eye strain, deep work interruption, isolation, cognitive fatigue from debugging, and 'crunch mode'.";
  } else if (roleLower.includes('manager') || roleLower.includes('lead') || roleLower.includes('executive') || roleLower.includes('director') || roleLower.includes('head')) {
    roleContext = "Leadership challenges: Decision fatigue, meeting overload ('Zoom fatigue'), emotional labor of supporting others, and lack of focus time.";
  } else if (roleLower.includes('designer') || roleLower.includes('creative') || roleLower.includes('artist') || roleLower.includes('writer')) {
    roleContext = "Creative challenges: Creative block, feedback fatigue, perfectionism, and imposter syndrome.";
  } else if (roleLower.includes('sales') || roleLower.includes('marketing') || roleLower.includes('account')) {
    roleContext = "Growth role challenges: High pressure targets, social battery drain, performance anxiety, and rejection resilience.";
  } else if (roleLower.includes('support') || roleLower.includes('service') || roleLower.includes('success')) {
    roleContext = "Support role challenges: Empathy fatigue, repetitive tasks, high reactivity requirement, and difficult customer interactions.";
  }

  const prompt = `
    You are ZenBot, an elite corporate wellness and performance coach for remote professionals.
    
    TARGET USER PROFILE:
    - Name: ${userName}
    - Professional Role: ${userRole || 'Remote Professional'}
    - Specific Role Context to consider: ${roleContext}
    - PRIMARY WELLNESS GOAL: ${userGoal.replace(/_/g, ' ').toUpperCase()} (Critical: Align all advice to this goal)
    
    RECENT ACTIVITY DATA (Last 7 days):
    ${JSON.stringify(recentLogs, null, 2)}
    
    ANALYSIS INSTRUCTIONS:
    1. Analyze trends in Work Hours, Stress Levels (1-10), and Mood (1-5).
    2. Identify specific correlations (e.g., "High stress on days with >9 hours work").
    3. Tailor the advice specifically to their role AND their primary wellness goal.
    
    OUTPUT REQUIREMENTS (Strict JSON):
    - title: A punchy, 3-6 word headline summarizing their current state. Use role-relevant terminology if possible (e.g., "Codebase Fatigue Detected" for devs, "Meeting Overload" for managers).
    - content: A 2-3 sentence analysis speaking directly to them using "You". Explicitly reference patterns in their data and connect it to their role challenges and stated goal.
    - actionableStep: One specific, high-impact micro-habit to do TODAY (max 15 words). It must be relevant to their role.
      * Bad examples: "Drink water", "Sleep more", "Relax".
      * Good examples: "Decline the next non-urgent meeting", "Enable 'Do Not Disturb' for 1 hour", "Do the 20-20-20 eye rule".
    
    IMPORTANT: Respond in ${targetLang}.
    
    Do not include markdown code blocks. Just the raw JSON string.
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
    // Clean up if model adds markdown blocks by accident
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanJson) as AIInsight;
  } catch (error) {
    console.error("Error generating insight:", error);
    return {
      title: "Connection Issue",
      content: "We couldn't reach the AI coach right now. Please try again later.",
      actionableStep: "Take a deep breath and relax."
    };
  }
};