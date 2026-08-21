import Groq from "groq-sdk";
import OpenAI from "openai";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy_key_for_build" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy_key_for_build" });

export class LLMClient {
  static async classifyAndGenerateGuidance(text: string, language: string) {
    const prompt = `
You are Saheli AI, a legal aid assistant for rural women in India.
The user has described their problem in their own words: "${text}"

Your job:
1. Identify the legal category from: domestic_violence, child_custody, property_dispute, dowry_harassment, divorce, maintenance, sexual_harassment, workplace_harassment, witch_hunting, trafficking, early_marriage, inheritance_rights
2. Generate step-by-step guidance in SIMPLE language (max 15 words per sentence)
3. List any immediate safety actions first
4. Mention relevant laws and sections
5. Provide helpline numbers (181 Women's Helpline, 100 Police, 1098 Childline)
6. Respond in the same language as the user's input (${language})
7. Be empathetic, non-judgmental, and clear
8. Do NOT give definitive legal advice — always recommend consulting a lawyer or NGO
9. If the user seems in immediate danger, prioritize safety steps and emergency contacts

Output format: strict JSON with fields:
{
  "category": "string",
  "summary": "string",
  "steps": [{"stepNumber": 1, "instruction": "string", "icon": "string"}],
  "emergencyActions": ["string"],
  "relatedLaws": ["string"],
  "helplineNumbers": ["string"]
}
`;

    try {
      if (!process.env.GROQ_API_KEY) throw new Error("Missing Groq API Key");
      
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" },
      });

      return JSON.parse(completion.choices[0]?.message?.content || "{}");
    } catch (err) {
      console.error("Groq Primary Failed, falling back to Llama 3.1 8B:", err);
      try {
        if (!process.env.GROQ_API_KEY) throw new Error("Missing Groq API Key");
        
        const backupCompletion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.1-8b-instant",
          response_format: { type: "json_object" },
        });

        return JSON.parse(backupCompletion.choices[0]?.message?.content || "{}");
      } catch (err2) {
        console.error("Groq Backup Failed, falling back to OpenAI GPT-4o-mini:", err2);
        try {
          if (!process.env.OPENAI_API_KEY) throw new Error("Missing OpenAI API Key");
          
          const openaiCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
          });

          return JSON.parse(openaiCompletion.choices[0]?.message?.content || "{}");
        } catch (err3) {
          console.error("All LLMs failed:", err3);
          // Return a safe fallback from knowledge base or mock
          return {
            category: "domestic_violence",
            summary: "Error connecting to AI. Please call 181 for immediate help.",
            steps: [{ stepNumber: 1, instruction: "Call 181 or 100 immediately.", icon: "Phone" }],
            emergencyActions: ["Call 181 Women's Helpline"],
            relatedLaws: [],
            helplineNumbers: ["181", "100"]
          };
        }
      }
    }
  }
}
