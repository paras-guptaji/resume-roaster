import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ResumeInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ResumeInput({ value, onChange }: ResumeInputProps) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="resume" className="text-base font-medium">
          Paste Your Resume 📄
        </Label>
        <span className="text-sm text-muted-foreground">
          {wordCount} words
        </span>
      </div>
      
      <Textarea
        id="resume"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your resume content here... 

Include your work experience, skills, education, and any bullet points you want analyzed. The more detail, the better the roast! 🔥"
        className="min-h-[300px] text-base bg-card border-border resize-none placeholder:text-muted-foreground/60 focus:border-primary/50"
      />
      
      <p className="text-xs text-muted-foreground">
        💡 Tip: Include specific bullet points from your experience section for the best feedback
      </p>
    </div>
  );
}
