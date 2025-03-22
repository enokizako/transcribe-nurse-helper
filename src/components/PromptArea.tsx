
import React from 'react';

interface PromptAreaProps {
  prompt: string;
  onChange: (value: string) => void;
}

const PromptArea: React.FC<PromptAreaProps> = ({ prompt, onChange }) => {
  return (
    <div className="flex flex-col space-y-2 w-full animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <label htmlFor="prompt" className="text-sm font-medium">
        整形プロンプト
      </label>
      <textarea
        id="prompt"
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-32 w-full rounded-lg border border-input bg-background p-4 shadow-sm resize-y"
        placeholder="整形するためのプロンプトを入力してください"
      />
    </div>
  );
};

export default PromptArea;
