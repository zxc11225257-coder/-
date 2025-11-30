import React, { useRef, useState } from 'react';
import { Camera, Loader2, Upload } from 'lucide-react';
import { analyzeReceiptImage } from '../services/geminiService';
import { Expense } from '../types';

interface ReceiptUploaderProps {
  onScanComplete: (data: Partial<Expense>) => void;
  theme: string;
}

const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({ onScanComplete, theme }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        // Strip the data:image/jpeg;base64, part for the API if needed, 
        // but the SDK usually handles base64 data extraction if we pass the raw bytes. 
        // @google/genai expects the raw base64 string without the prefix for inlineData.
        const base64Data = base64String.split(',')[1];
        
        try {
          const result = await analyzeReceiptImage(base64Data);
          onScanComplete({
            amount: result.amount,
            category: result.category || '未分類',
            description: result.description || '掃描收據',
            detectedBrand: result.brand,
            date: new Date().toISOString().split('T')[0]
          });
        } catch (err) {
          alert("無法分析收據。請再試一次。");
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
      setIsAnalyzing(false);
    }
  };

  const btnClass = theme === 'cyberpunk' 
    ? "bg-cyber-secondary hover:bg-red-600 text-white font-mono border-2 border-cyber-secondary"
    : theme === 'cozy'
    ? "bg-cozy-accent hover:bg-teal-600 text-white font-serif rounded-xl"
    : "bg-black text-white hover:bg-gray-800 font-sans";

  return (
    <div className="flex items-center">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isAnalyzing}
        className={`${btnClass} p-3 flex items-center gap-2 transition-all w-full justify-center`}
      >
        {isAnalyzing ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <Camera className="w-5 h-5" />
        )}
        <span>{isAnalyzing ? "AI 掃描辨識中..." : "掃描收據"}</span>
      </button>
    </div>
  );
};

export default ReceiptUploader;