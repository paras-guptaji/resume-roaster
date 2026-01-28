import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ResumeForm } from "@/components/ResumeForm";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { useResumeAnalysis } from "@/hooks/useResumeAnalysis";
import type { ResumeInput } from "@/types/resume";
const Index = () => {
  const {
    analyze,
    analysis,
    isLoading,
    error,
    reset
  } = useResumeAnalysis();
  const [submittedInput, setSubmittedInput] = useState<ResumeInput | null>(null);
  const handleSubmit = async (input: ResumeInput) => {
    setSubmittedInput(input);
    await analyze(input);
  };
  const handleReset = () => {
    reset();
    setSubmittedInput(null);
  };
  return <div className="min-h-screen bg-background">
      {/* Decorative gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-orange/20 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-pink/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-purple/15 rounded-full blur-3xl" />
      </div>

      <div className="relative container max-w-4xl py-12 px-4">
        <HeroSection />

        {!analysis ? <ResumeForm onSubmit={handleSubmit} isLoading={isLoading} /> : <ResultsDashboard analysis={analysis} input={submittedInput!} onReset={handleReset} />}

        {error && <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-center">
            <p className="font-medium">Oops! Something went wrong 😅</p>
            <p className="text-sm mt-1">{error}</p>
          </div>}

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>~ By Paras</p>
          <p className="mt-1">Your resume data is never stored. Privacy first! 🔒</p>
        </footer>
      </div>
    </div>;
};
export default Index;