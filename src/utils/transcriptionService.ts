
// WebSpeech API のインターフェース
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

// グローバルのSpeechRecognitionがTypeScriptで認識されないため、ポリフィルを作成
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

class TranscriptionService {
  private recognition: any;
  private isListening: boolean = false;
  private transcription: string = '';
  private onTranscriptionUpdate: ((text: string) => void) | null = null;

  constructor() {
    if (!SpeechRecognition) {
      console.error("Speech recognition is not supported in this browser.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'ja-JP';

    this.recognition.onresult = this.handleResult.bind(this);
    this.recognition.onerror = this.handleError.bind(this);
    this.recognition.onend = this.handleEnd.bind(this);
  }

  public setOnTranscriptionUpdate(callback: (text: string) => void): void {
    this.onTranscriptionUpdate = callback;
  }

  public start(): void {
    if (!this.recognition) {
      console.error("Speech recognition is not available.");
      return;
    }

    if (!this.isListening) {
      this.transcription = '';
      this.isListening = true;
      this.recognition.start();
    }
  }

  public stop(): string {
    if (!this.recognition) {
      console.error("Speech recognition is not available.");
      return '';
    }

    if (this.isListening) {
      this.isListening = false;
      this.recognition.stop();
    }
    
    return this.transcription;
  }

  public reset(): void {
    this.transcription = '';
    if (this.onTranscriptionUpdate) {
      this.onTranscriptionUpdate('');
    }
  }

  public isAvailable(): boolean {
    return !!SpeechRecognition;
  }

  private handleResult(event: SpeechRecognitionEvent): void {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    if (finalTranscript) {
      this.transcription += finalTranscript + ' ';
    }

    if (this.onTranscriptionUpdate) {
      this.onTranscriptionUpdate(this.transcription + interimTranscript);
    }
  }

  private handleError(event: any): void {
    console.error('Speech recognition error:', event.error);
    this.isListening = false;
  }

  private handleEnd(): void {
    this.isListening = false;
    // 自動再開（必要に応じて）
    if (this.isListening) {
      this.recognition.start();
    }
  }
}

export default new TranscriptionService();
