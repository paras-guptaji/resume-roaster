import { useState, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Loader2, CheckCircle, X, AlertCircle } from "lucide-react";
import { useFileExtraction } from "@/hooks/useFileExtraction";
import { cn } from "@/lib/utils";

interface ResumeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ResumeInput({ value, onChange }: ResumeInputProps) {
  const [activeTab, setActiveTab] = useState("paste");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    uploadAndExtract, 
    isExtracting, 
    extractedText, 
    fileName, 
    error, 
    reset 
  } = useFileExtraction();

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  const handleFileSelect = useCallback(async (file: File) => {
    const text = await uploadAndExtract(file);
    if (text) {
      onChange(text);
    }
  }, [uploadAndExtract, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileSelect]);

  const handleClearFile = useCallback(() => {
    reset();
    onChange("");
  }, [reset, onChange]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">
          Your Resume 📄
        </Label>
        <span className="text-sm text-muted-foreground">
          {wordCount} words
        </span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
          <TabsTrigger value="paste" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Paste Text
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload File
          </TabsTrigger>
        </TabsList>

        <TabsContent value="paste" className="mt-4">
          <Textarea
            id="resume"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste your resume content here... 

Include your work experience, skills, education, and any bullet points you want analyzed. The more detail, the better the roast! 🔥"
            className="min-h-[300px] text-base bg-card border-border resize-none placeholder:text-muted-foreground/60 focus:border-primary/50"
          />
          <p className="text-xs text-muted-foreground mt-2">
            💡 Tip: Include specific bullet points from your experience section for the best feedback
          </p>
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Show extracted text preview if successful */}
          {extractedText && !error ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-green-500/30 bg-green-500/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">{fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {extractedText.length.toLocaleString()} characters extracted
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFile}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="relative">
                <Textarea
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="Extracted text will appear here..."
                  className="min-h-[200px] text-base bg-card border-border resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  ✏️ You can edit the extracted text before roasting
                </p>
              </div>
            </div>
          ) : (
            /* Drop zone */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleBrowseClick}
              className={cn(
                "min-h-[300px] rounded-lg border-2 border-dashed transition-all cursor-pointer",
                "flex flex-col items-center justify-center gap-4 p-8",
                isDragging 
                  ? "border-primary bg-primary/10 scale-[1.02]" 
                  : "border-border hover:border-primary/50 hover:bg-muted/30",
                isExtracting && "pointer-events-none opacity-70",
                error && "border-destructive/50 bg-destructive/5"
              )}
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <div className="text-center">
                    <p className="font-medium">Extracting text from your resume...</p>
                    <p className="text-sm text-muted-foreground mt-1">This may take a moment</p>
                  </div>
                </>
              ) : error ? (
                <>
                  <AlertCircle className="w-12 h-12 text-destructive" />
                  <div className="text-center">
                    <p className="font-medium text-destructive">{error}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Click to try again or use the paste option
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">
                      {isDragging ? "Drop your file here!" : "Drag & drop your resume"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      or click to browse
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">PDF</Badge>
                    <Badge variant="secondary" className="text-xs">DOCX</Badge>
                    <Badge variant="secondary" className="text-xs">DOC</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Maximum file size: 10MB</p>
                </>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
