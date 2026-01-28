import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ResumeInput } from "./ResumeInput";
import { RoleSelector } from "./RoleSelector";
import { IntensitySlider } from "./IntensitySlider";
import { Flame, Loader2 } from "lucide-react";
import type { Role, RoastIntensity, ResumeInput as ResumeInputType } from "@/types/resume";

interface ResumeFormProps {
  onSubmit: (input: ResumeInputType) => void;
  isLoading: boolean;
}

export function ResumeForm({ onSubmit, isLoading }: ResumeFormProps) {
  const [content, setContent] = useState("");
  const [role, setRole] = useState<Role>("fullstack");
  const [intensity, setIntensity] = useState<RoastIntensity>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit({ content, role, intensity });
    }
  };

  const isValid = content.trim().length >= 50;

  return (
    <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
      <CardContent className="p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <ResumeInput value={content} onChange={setContent} />
          
          <div className="grid md:grid-cols-2 gap-8">
            <RoleSelector value={role} onChange={setRole} />
            <IntensitySlider value={intensity} onChange={setIntensity} />
          </div>
          
          <Button
            type="submit"
            size="lg"
            disabled={!isValid || isLoading}
            className="w-full h-14 text-lg font-semibold bg-accent hover:bg-accent/90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Roasting Your Resume...
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 mr-2" />
                Roast My Resume 🔥
              </>
            )}
          </Button>
          
          {!isValid && content.length > 0 && (
            <p className="text-sm text-center text-muted-foreground">
              Please paste at least 50 characters of your resume
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
