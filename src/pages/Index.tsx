import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import TranscriptionButton from "@/components/TranscriptionButton";
import FileUploadButton from "@/components/FileUploadButton";
import TranscriptionArea from "@/components/TranscriptionArea";
import PromptArea from "@/components/PromptArea";
import ResultArea from "@/components/ResultArea";
import TranscriptionService from "@/utils/transcriptionService";
import FileTranscriptionService from "@/utils/fileTranscriptionService";
import { googleAIService } from "@/utils/googleAIService";
import { toast } from "sonner";

const defaultPrompt = `渡されたテキストを元に看護記録をSOAP形式に要約してまとめてください。
最初に部屋番号とベッドナンバーを記載してからSOAP形式で記述します。
SOAP形式の記載方法は下記に従ってください。
SOAPのすべての項目を埋める必要はなく、必要なもののみ書き出してください。
SOAPに分類されない項目はカットしてください。
Sは主観的データ(Subjective Data)
患者さんの発した言葉。要約してもよいが、患者さんの発言以外を記録するのはNG!
例) 分かりました。 OKです。 など
Oは客観的データ(Objective Data)
観察したこと。目で見たことだけでなく、 触診や聴診で得られたデータ・バイタルサインや検査データなども含まれる。 
スタッフ同士が共通認識できるスケールなどがあれば、それらを用いる。
例) フェイススケール3、 ブリストルスケール4型、
×不安げな表情 ○うつむき硬い表情など
Aはアセスメント(Assessment)
実際に行った看護、データとデータから解釈・分析・判断したこと
Pは計画(Plan)
S、O、Aをふまえた今後の方針
渡されたテキストにない情報は絶対に追加しないでください。`;

const Index: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [result, setResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // マイクの可用性をチェック
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        console.error("マイクへのアクセスに失敗しました:", error);
        toast.error(
          "マイクへのアクセスに失敗しました。ブラウザの設定を確認してください。"
        );
      }
    };

    if (TranscriptionService.isAvailable()) {
      checkMicrophonePermission();
      TranscriptionService.setOnTranscriptionUpdate(setTranscription);
    } else {
      toast.error(
        "お使いのブラウザは音声認識をサポートしていません。Chrome または Edge の最新版をお使いください。"
      );
    }
  }, []);

  const startTranscription = () => {
    try {
      TranscriptionService.start();
      setIsRecording(true);
      setResult("");
      toast.success("文字起こしを開始しました");
    } catch (error) {
      console.error("文字起こし開始エラー:", error);
      toast.error("文字起こしの開始に失敗しました");
    }
  };

  const stopTranscription = async () => {
    try {
      const finalTranscription = TranscriptionService.stop();
      setIsRecording(false);
      toast.success("文字起こしを停止しました");

      if (finalTranscription.trim()) {
        formatTranscription(finalTranscription);
      }
    } catch (error) {
      console.error("文字起こし停止エラー:", error);
      toast.error("文字起こしの停止に失敗しました");
      setIsRecording(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      setIsProcessing(true);
      setResult("");
      toast.success(`ファイル「${file.name}」の文字起こしを開始しました`);
      
      const transcriptionText = await FileTranscriptionService.transcribeFile(file);
      setTranscription(transcriptionText);
      
      if (transcriptionText.trim()) {
        formatTranscription(transcriptionText);
      }
    } catch (error) {
      console.error("ファイル文字起こしエラー:", error);
      toast.error("ファイルの文字起こしに失���しました");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTranscription = async (text: string) => {
    if (!text.trim()) return;

    setIsProcessing(true);

    try {
      let formattedResult = "";

      // Google Generative AI が設定されていれば使用
      if (googleAIService.isConfigured()) {
        try {
          formattedResult = await googleAIService.generateResponse(
            prompt,
            text
          );
        } catch (error) {
          console.error("Google AI エラー:", error);
          toast.error(
            "Google AI による処理に失敗しました。フォールバック処理を実行します。"
          );
          // エラーの場合はフォールバック処理を実行
          formattedResult = formatWithSOAP(text, prompt);
        }
      } else {
        // Google AI が設定されていない場合は従来の処理
        formattedResult = formatWithSOAP(text, prompt);
      }

      setResult(formattedResult);
    } catch (error) {
      console.error("整形エラー:", error);
      toast.error("テキストの整形に失敗しました");
    } finally {
      setIsProcessing(false);
    }
  };

  // 簡易的なSOAP形式フォーマット（プロトタイプ用）
  const formatWithSOAP = (text: string, soapPrompt: string): string => {
    // 実際にはここでAIモデルへのリクエストを行う
    // プロトタイプでは単純なルールベースの処理を行う
    const sections: string[] = [];

    // Sセクション（主観的データ）：引用文や「～と言った」などの表現を探す
    const subjectiveMatches = text.match(
      /「.*?」|『.*?』|患者[はが].*?(言った|述べた|話した)/g
    );
    if (subjectiveMatches && subjectiveMatches.length > 0) {
      sections.push(`【S: 主観的データ】\n${subjectiveMatches.join("\n")}`);
    }

    // Oセクション（客観的データ）：数値やスケールに関する記述を探す
    const objectiveMatches = text.match(
      /\d+度|\d+\.?\d*[%％]|フェイススケール\d+|ブリストルスケール\d+型|バイタル|血圧|脈拍|SPO2|呼吸数/g
    );
    if (objectiveMatches && objectiveMatches.length > 0) {
      sections.push(`【O: 客観的データ】\n${objectiveMatches.join(", ")}`);
    }

    // Aセクション（アセスメント）：「～と考えられる」「～と判断」などの表現を探す
    if (
      text.includes("考えられる") ||
      text.includes("判断") ||
      text.includes("アセスメント")
    ) {
      sections.push(
        `【A: アセスメント】\n看護師の観察と評価に基づき、患者の状態を分析しました。`
      );
    }

    // Pセクション（計画）：「今後」「計画」などの表現を探す
    if (
      text.includes("今後") ||
      text.includes("計画") ||
      text.includes("予定")
    ) {
      sections.push(
        `【P: 計画】\n今後のケアプランとして継続的な観察が必要です。`
      );
    }

    // どのセクションにも該当しない場合はデフォルトのフォーマットを返す
    if (sections.length === 0) {
      return `【SOAP形式の看護記録】\n\n${text}\n\n※このテキストからSOAP形式に変換できる情報が十分ではありませんでした。より詳細な情報を入力してください。`;
    }

    return sections.join("\n\n");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-background">
      <Header />

      <main className="container py-8 flex flex-col items-center space-y-8 flex-1">
        <div className="flex justify-center w-full gap-4">
          <TranscriptionButton
            onStart={startTranscription}
            onStop={stopTranscription}
            isRecording={isRecording}
          />
          <FileUploadButton 
            onFileSelect={handleFileSelect}
            isProcessing={isProcessing}
          />
        </div>

        <div className="w-full max-w-4xl space-y-6">
          <TranscriptionArea transcription={transcription} />
          <PromptArea prompt={prompt} onChange={setPrompt} />
          <ResultArea result={result} isProcessing={isProcessing} />
        </div>
      </main>

      <footer className="w-full py-6 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            看護メモ支援ツールのプロトタイプです。ChromeもしくはEdgeブラウザを使用してください。
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
