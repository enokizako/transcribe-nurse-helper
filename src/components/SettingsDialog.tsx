
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { googleAIService } from "@/utils/googleAIService";
import { toast } from "sonner";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onOpenChange }) => {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gemini-1.5-flash");

  useEffect(() => {
    // Load saved values from sessionStorage when dialog opens
    if (open) {
      const savedApiKey = sessionStorage.getItem("googleApiKey") || "";
      const savedModel = sessionStorage.getItem("googleModel") || "gemini-1.5-flash";
      
      setApiKey(savedApiKey);
      setModel(savedModel);
    }
  }, [open]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error("API Keyを入力してください");
      return;
    }

    const success = googleAIService.configure({
      apiKey,
      model
    });

    if (success) {
      toast.success("設定が保存されました");
      onOpenChange(false);
    } else {
      toast.error("設定の保存に失敗しました");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Google AI 設定</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">Google API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API キーを入力してください"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="model">モデル</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="モデルを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-2.0-pro-exp-02-05">gemini-2.0-pro-exp-02-05</SelectItem>
                <SelectItem value="gemini-2.0-flash-lite">gemini-2.0-flash-lite</SelectItem>
                <SelectItem value="gemini-2.0-flash">gemini-2.0-flash</SelectItem>
                <SelectItem value="gemini-1.5-flash">gemini-1.5-flash</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
