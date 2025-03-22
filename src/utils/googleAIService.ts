
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
}

export const googleAIService = new GoogleAIService();
