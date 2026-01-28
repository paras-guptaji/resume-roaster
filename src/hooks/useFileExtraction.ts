import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ExtractionResult {
  text: string;
  fileName: string;
  fileSize: number;
}

export function useFileExtraction() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadAndExtract = async (file: File) => {
    setIsExtracting(true);
    setError(null);
    setExtractedText(null);
    setFileName(null);

    try {
      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error("File too large. Maximum size is 10MB.");
      }

      // Validate file type
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword'
      ];
      const validExtensions = ['.pdf', '.docx', '.doc'];
      const hasValidType = validTypes.includes(file.type);
      const hasValidExtension = validExtensions.some(ext => 
        file.name.toLowerCase().endsWith(ext)
      );

      if (!hasValidType && !hasValidExtension) {
        throw new Error("Unsupported file format. Please upload PDF, DOC, or DOCX files.");
      }

      // Create FormData and upload
      const formData = new FormData();
      formData.append('file', file);

      const { data, error: fnError } = await supabase.functions.invoke('extract-resume', {
        body: formData,
      });

      if (fnError) {
        throw new Error(fnError.message || "Failed to extract text from file");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const result = data as ExtractionResult;
      setExtractedText(result.text);
      setFileName(result.fileName);
      
      return result.text;
    } catch (err) {
      console.error("File extraction error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setIsExtracting(false);
    }
  };

  const reset = () => {
    setExtractedText(null);
    setFileName(null);
    setError(null);
  };

  return {
    uploadAndExtract,
    isExtracting,
    extractedText,
    fileName,
    error,
    reset
  };
}
