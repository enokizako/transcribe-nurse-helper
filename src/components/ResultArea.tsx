
import React, { useRef, useEffect } from 'react';
import { ClipboardCopy } from 'lucide-react';
import { toast } from 'sonner';

interface ResultAreaProps {
  result: string;
  isProcessing: boolean;
}

const ResultArea: React.FC<ResultAreaProps> = ({ result, isProcessing }) => {
  const resultRef = useRef<HTMLDivElement>(null);

  // 結果が更新されたときに自動スクロール
  useEffect(() => {
    if (resultRef.current && result) {
      resultRef.current.scrollTop = 0;
    }
  }, [result]);

  const copyToClipboard = () => {
    if (!result) return;
    
    navigator.clipboard.writeText(result)
      .then(() => {
        toast.success('クリップボードにコピーしました');
      })
      .catch((err) => {
        console.error('クリップボードへのコピーに失敗しました:', err);
        toast.error('コピーに失敗しました');
      });
  };

  return (
    <div className="flex flex-col space-y-2 w-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex justify-between items-center">
        <label htmlFor="result" className="text-sm font-medium">
          整形結果
        </label>
        {result && (
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/90 transition-colors"
          >
            <ClipboardCopy className="w-3 h-3" />
            <span>コピー</span>
          </button>
        )}
      </div>
      <div
        ref={resultRef}
        id="result"
        className="min-h-48 w-full rounded-lg border border-input bg-background p-4 shadow-sm overflow-y-auto"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </div>
              <p className="text-sm text-muted-foreground">整形中...</p>
            </div>
          </div>
        ) : result ? (
          <div className="whitespace-pre-wrap">{result}</div>
        ) : (
          <p className="text-muted-foreground text-sm italic">
            文字起こし完了後に、整形された結果がここに表示されます。
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultArea;
