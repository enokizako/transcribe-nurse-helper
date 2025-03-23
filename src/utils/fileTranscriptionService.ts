
import { googleAIService } from "@/utils/googleAIService";

class FileTranscriptionService {
  // Using Google Gemini for transcription when configured, otherwise use mock
  public async transcribeFile(file: File): Promise<string> {
    try {
      // Check if Google AI is configured
      if (googleAIService.isConfigured()) {
        return await this.transcribeWithGemini(file);
      } else {
        // Fall back to mock implementation
        return await this.mockTranscription(file);
      }
    } catch (error) {
      console.error("Transcription error:", error);
      throw new Error("ファイルの文字起こしに失敗しました");
    }
  }

  private async transcribeWithGemini(file: File): Promise<string> {
    try {
      // Read the file as data URL for processing
      const fileDataUrl = await this.readFileAsDataURL(file);
      
      // Prepare the prompt for Gemini
      const prompt = "次の看護師の病棟での会話を、日本語で発言内容そのまま文字起こししてください。";
      
      // Call Google AI service with the prompt and audio file
      const transcription = await googleAIService.transcribeAudio(prompt, fileDataUrl);
      
      return transcription;
    } catch (error) {
      console.error("Gemini transcription error:", error);
      throw error;
    }
  }

  private readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Fallback mock implementation for prototype or when Google AI is not configured
  private async mockTranscription(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          // For prototype purposes, we'll generate a simple mock transcription
          // based on the file name and size
          const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
          const fileSizeKb = Math.round(file.size / 1024);

          // Generate mock transcription
          const mockTranscription = `
ファイル「${fileName}」からの文字起こし結果:

4階東412 ベッド1を訪室しました。
バイタルは血圧が132/85、脈拍78、体温36.5度でした。
患者は「今日は調子が良いです」と話されていました。
SpO2は98%で安定しています。
ブリストルスケールは4型でした。
痛みについてはフェイススケール2程度と言われています。
昨日よりも歩行距離が伸びていることを確認しました。
明日からリハビリの頻度を増やす計画です。

※これはプロトタイプ用の模擬文字起こしです。実際の実装では適切なAPIを使用します。`;

          // Wait a bit to simulate processing time
          setTimeout(() => {
            resolve(mockTranscription);
          }, 1500);
        } catch (error) {
          reject(new Error("ファイルの処理に失敗しました"));
        }
      };

      reader.onerror = () => {
        reject(new Error("ファイルの読み込みに失敗しました"));
      };

      // Start reading the file as text
      reader.readAsText(file);
    });
  }
}

export default new FileTranscriptionService();
