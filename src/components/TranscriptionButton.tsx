
import React, { useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TranscriptionButtonProps {
  onStart: () => void;
  onStop: () => void;
  isRecording: boolean;
}

const TranscriptionButton: React.FC<TranscriptionButtonProps> = ({ 
  onStart, 
  onStop, 
  isRecording 
}) => {
  const handleClick = () => {
    if (isRecording) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
        isRecording 
          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" 
          : "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
    >
      {isRecording ? (
        <>
          <Square className="w-5 h-5" />
          <span>文字起こし停止</span>
        </>
      ) : (
        <>
          <Mic className="w-5 h-5" />
          <span>文字起こし開始</span>
        </>
      )}
      {isRecording && (
        <div className="ml-2 flex items-center">
          <span className="loading-dot"></span>
          <span className="loading-dot"></span>
          <span className="loading-dot"></span>
        </div>
      )}
    </button>
  );
};

export default TranscriptionButton;
