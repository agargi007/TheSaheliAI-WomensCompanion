export class BhashiniClient {
  static async processVoicePipeline(audioBase64: string, sourceLang: string, targetLang: string) {
    const userID = process.env.BHASHINI_USER_ID;
    const apiKey = process.env.BHASHINI_API_KEY;

    if (!userID || !apiKey) {
      console.warn("Bhashini credentials missing. Returning mock data.");
      return this.mockResponse(sourceLang, targetLang);
    }

    try {
      const pipelineResponse = await fetch('https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/computePipeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'userID': userID,
          'ulcaApiKey': apiKey
        },
        body: JSON.stringify({
          pipelineTasks: [
            { taskType: 'asr', config: { language: { sourceLanguage: sourceLang } } },
            { taskType: 'translation', config: { language: { sourceLanguage: sourceLang, targetLanguage: targetLang } } },
            { taskType: 'tts', config: { language: { sourceLanguage: targetLang } } }
          ],
          inputData: { audio: [{ audioContent: audioBase64 }] }
        })
      });

      if (!pipelineResponse.ok) {
        throw new Error("Bhashini API returned error");
      }

      const result = await pipelineResponse.json();
      return {
        transcript: result.pipelineResponse[0].output[0].source,
        translation: result.pipelineResponse[1].output[0].target,
        audio: result.pipelineResponse[2].audio[0].audioContent
      };
    } catch (e) {
      console.error("Bhashini API Error:", e);
      return this.mockResponse(sourceLang, targetLang);
    }
  }

  static mockResponse(sourceLang: string, targetLang: string) {
    return {
      transcript: "This is a mocked transcript of the problem.",
      translation: "This is the translated problem in English.",
      audio: "" // Base64 audio string mock
    };
  }
}
