import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoastCard } from "./results/RoastCard";
import { ConfidenceScore } from "./results/ConfidenceScore";
import { RejectionReasons } from "./results/RejectionReasons";
import { BulletAnalysis } from "./results/BulletAnalysis";
import { KeywordSection } from "./results/KeywordSection";
import { LieDetector } from "./results/LieDetector";
import { InterviewQuestions } from "./results/InterviewQuestions";
import { ArrowLeft, Share2, Download } from "lucide-react";
import type { ResumeAnalysis, ResumeInput } from "@/types/resume";
import { ROLES } from "@/types/resume";
import { useToast } from "@/hooks/use-toast";

interface ResultsDashboardProps {
  analysis: ResumeAnalysis;
  input: ResumeInput;
  onReset: () => void;
}

export function ResultsDashboard({ analysis, input, onReset }: ResultsDashboardProps) {
  const { toast } = useToast();
  const roleLabel = ROLES.find((r) => r.value === input.role)?.label || input.role;

  const handleShare = async () => {
    const shareText = `🔥 I got roasted by AI Resume Roaster!\n\nConfidence Score: ${analysis.confidenceScore}/100\n\nTry it yourself!`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Resume Roaster Results",
          text: shareText,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard! 📋",
        description: "Share your results with friends",
      });
    }
  };

  const handleExport = () => {
    const report = generateTextReport(analysis, input, roleLabel);
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-roast-report.txt";
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report downloaded! 📄",
      description: "Check your downloads folder",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button variant="outline" onClick={onReset} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Roast Another Resume
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare} className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Role badge */}
      <div className="text-center">
        <span className="inline-block px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-medium">
          Analyzed for: {roleLabel}
        </span>
      </div>

      {/* Main results grid */}
      <div className="grid gap-6">
        {/* Row 1: Roast and Score */}
        <div className="grid md:grid-cols-2 gap-6">
          <RoastCard roast={analysis.roast} intensity={input.intensity} />
          <ConfidenceScore 
            score={analysis.confidenceScore} 
            breakdown={analysis.scoreBreakdown} 
          />
        </div>

        {/* Row 2: Rejection Reasons */}
        <RejectionReasons reasons={analysis.rejectionReasons} />

        {/* Row 3: Keywords */}
        <KeywordSection 
          missing={analysis.missingKeywords} 
          injected={analysis.injectedKeywords} 
        />

        {/* Row 4: Bullet Analysis */}
        <BulletAnalysis bullets={analysis.bullets} />

        {/* Row 5: Lie Detector */}
        {analysis.lieDetectorFlags.length > 0 && (
          <LieDetector flags={analysis.lieDetectorFlags} />
        )}

        {/* Row 6: Interview Questions */}
        <InterviewQuestions questions={analysis.interviewQuestions} />
      </div>
    </div>
  );
}

function generateTextReport(
  analysis: ResumeAnalysis, 
  input: ResumeInput, 
  roleLabel: string
): string {
  const lines = [
    "🔥 AI RESUME ROASTER - ANALYSIS REPORT",
    "=".repeat(50),
    "",
    `Target Role: ${roleLabel}`,
    `Confidence Score: ${analysis.confidenceScore}/100`,
    "",
    "📊 SCORE BREAKDOWN",
    "-".repeat(30),
    `Metrics Usage: ${analysis.scoreBreakdown.metricsUsage}/25`,
    `Action Verbs: ${analysis.scoreBreakdown.actionVerbs}/25`,
    `Clarity: ${analysis.scoreBreakdown.clarity}/25`,
    `Role Alignment: ${analysis.scoreBreakdown.roleAlignment}/25`,
    "",
    "🔥 THE ROAST",
    "-".repeat(30),
    analysis.roast,
    "",
    "❌ WHY THIS RESUME GETS REJECTED",
    "-".repeat(30),
    ...analysis.rejectionReasons.map((r, i) => `${i + 1}. ${r.title}: ${r.description}`),
    "",
    "🎯 MISSING KEYWORDS",
    "-".repeat(30),
    analysis.missingKeywords.join(", "),
    "",
    "✨ BULLET IMPROVEMENTS",
    "-".repeat(30),
    ...analysis.bullets.map((b) => [
      `Original: ${b.original}`,
      `Status: ${b.strength.toUpperCase()}`,
      `Issue: ${b.issue}`,
      `Fixed: ${b.fixed}`,
      "",
    ]).flat(),
    "",
    "🎤 LIKELY INTERVIEW QUESTIONS",
    "-".repeat(30),
    ...analysis.interviewQuestions.map((q, i) => [
      `Q${i + 1}: ${q.question}`,
      `Context: ${q.context}`,
      `Ideal Answer: ${q.idealAnswer}`,
      "",
    ]).flat(),
  ];

  return lines.join("\n");
}
