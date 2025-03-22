
import React from 'react';

interface TranscriptionAreaProps {
  transcription: string;
}

const TranscriptionArea: React.FC<TranscriptionAreaProps> = ({ transcription }) => {
  return (
    <div className="flex flex-col space-y-2 w-full animate-slide-up">
      <label htmlFor="transcription" className="text-sm font-medium">
        文字起こし結果
      </label>
      <div
        id="transcription"
        className="min-h-32 w-full rounded-lg border border-input bg-background p-4 shadow-sm overflow-y-auto"
      >
        {transcription ? (
          <p className="whitespace-pre-wrap">{transcription}</p>
        ) : (
          <p className="text-muted-foreground text-sm italic">
            「文字起こし開始」ボタンを押して、話しかけてください。
          </p>
        )}
      </div>
    </div>
  );
};

export default TranscriptionArea;
