import React, { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import SettingsDialog from "./SettingsDialog";

const Header: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="py-6 w-full animate-fade-in">
      <div className="container flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium">看護メモ支援ツール</h1>
          <p className="text-sm text-muted-foreground">
            音声入力から SOAP
            形式のメモを自動生成します。部屋とベットナンバーを最初に確認してください。
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSettingsOpen(true)}
          aria-label="設定"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mt-6 w-full" />

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </header>
  );
};

export default Header;
