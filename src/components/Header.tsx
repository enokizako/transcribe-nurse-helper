
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 w-full animate-fade-in">
      <div className="container flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium">看護記録支援ツール</h1>
          <p className="text-sm text-muted-foreground">音声入力から SOAP 形式の看護記録を自動生成</p>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mt-6 w-full" />
    </header>
  );
};

export default Header;
