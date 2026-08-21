import { NextRequest, NextResponse } from "next/server";
import { BhashiniClient } from "@/lib/clients/bhashini";
import { LLMClient } from "@/lib/clients/llm";
import { AtomsCloudDB } from "@/lib/db/mock-atoms-cloud";

export async function POST(req: NextRequest) {
  try {
    const { audioBase64, language } = await req.json();

    if (!audioBase64 || !language) {
      return NextResponse.json(
        { error: "Audio data and language are required" },
        { status: 400 }
      );
    }

    // Step 1: Bhashini ASR (Speech to Text) and Translation to English if needed
    const bhashiniResult = await BhashiniClient.processVoicePipeline(
      audioBase64,
      language, // e.g., 'hi'
      "en"      // target language for LLM processing
    );

    const userQuery = bhashiniResult.translation || bhashiniResult.transcript;

    // Step 2: Groq Llama 3 (Classify and Generate Guidance)
    const guidance = await LLMClient.classifyAndGenerateGuidance(userQuery, language);

    // Step 3: Bhashini TTS happens in the frontend or can be passed back here if we extend BhashiniClient.
    // For now, the bhashiniResult already requested TTS if we configured the pipeline,
    // but typically TTS is generated *after* LLM response.
    // Let's mock the TTS of the guidance summary for the response:
    
    let audioResponseBase64 = "";
    try {
      const ttsResponse = await BhashiniClient.processVoicePipeline(
        // Not a real audio input, just string payload for TTS only
        Buffer.from(guidance.summary).toString("base64"), 
        "en",
        language
      );
      audioResponseBase64 = ttsResponse.audio || "";
    } catch (e) {
      console.error("TTS generation failed:", e);
    }

    // Step 4: Save Case to Atoms Cloud Database
    const savedCase = await AtomsCloudDB.saveCase({
      userId: "anonymous-user-id", // In real app, extract from auth token
      language,
      category: guidance.category,
      queryText: bhashiniResult.transcript,
      guidanceReceived: guidance,
      status: "active",
    });

    return NextResponse.json({
      success: true,
      caseId: savedCase.id,
      transcript: bhashiniResult.transcript,
      guidance: guidance,
      audioResponse: audioResponseBase64,
    });
  } catch (error: any) {
    console.error("Voice Pipeline Error:", error);
    return NextResponse.json(
      { error: "Failed to process voice request" },
      { status: 500 }
    );
  }
}
