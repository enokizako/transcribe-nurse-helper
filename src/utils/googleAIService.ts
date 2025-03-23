
import { GoogleGenerativeAI } from "@google/generative-ai";

interface AIServiceConfig {
  apiKey: string;
  model: string;
}

class GoogleAIService {
  private generativeAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  
  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    const apiKey = sessionStorage.getItem('googleApiKey');
    const modelName = sessionStorage.getItem('googleModel');
    
    if (apiKey && modelName) {
      this.configure({ apiKey, model: modelName });
    }
  }

  public configure(config: AIServiceConfig) {
    try {
      this.generativeAI = new GoogleGenerativeAI(config.apiKey);
      this.model = this.generativeAI.getGenerativeModel({ model: config.model });
      
      // Save to session storage
      sessionStorage.setItem('googleApiKey', config.apiKey);
      sessionStorage.setItem('googleModel', config.model);
      
      return true;
    } catch (error) {
      console.error("Google AI configuration error:", error);
      return false;
    }
  }

  public isConfigured(): boolean {
    return !!this.generativeAI && !!this.model;
  }

  public async generateResponse(prompt: string, text: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error("Google AI service is not configured");
    }

    try {
      const fullPrompt = `${prompt}\n\n入力データ:\n${text}`;
      const result = await this.model.generateContent(fullPrompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("Google AI generation error:", error);
      throw error;
    }
  }

  public async transcribeAudio(prompt: string, audioDataUrl: string): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error("Google AI service is not configured");
    }

    try {
      // Extract base64 data from the data URL
      const base64Data = audioDataUrl.split(',')[1];
      
      // For audio processing, we need to use multimodal input with the audio file
      // For Gemini models that support audio, we'd use this approach
      const parts = [
        {
          text: prompt
        },
        {
          inlineData: {
            data: base64Data,
            mimeType: "audio/mpeg" // Adjust based on actual file type
          }
        }
      ];

      // Generate content with the prompt and audio data
      const result = await this.model.generateContent({
        contents: [{ role: "user", parts }],
      });
      
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("Google AI audio transcription error:", error);
      throw error;
    }
  }
}

export const googleAIService = new GoogleAIService();
