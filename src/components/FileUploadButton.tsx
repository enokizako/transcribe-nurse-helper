
import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({ 
  onFileSelect,
  isProcessing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if the file is an audio file
    if (!file.type.startsWith('audio/')) {
      toast.error('音声ファイルを選択してください');
      return;
    }
    
    onFileSelect(file);
    
    // Reset the input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant="outline"
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isProcessing}
      >
        <Upload className="w-5 h-5" />
        <span>ファイル選択</span>
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/*"
        className="hidden"
      />
    </>
  );
};

export default FileUploadButton;
