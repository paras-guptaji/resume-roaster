import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ResumeInput, ResumeAnalysis } from "@/types/resume";

export function useResumeAnalysis() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (input: ResumeInput) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-resume", {
        body: input,
      });

      if (fnError) {
        throw new Error(fnError.message || "Failed to analyze resume");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data as ResumeAnalysis);
    } catch (err) {
      console.error("Resume analysis error:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setError(null);
  };

  return { analyze, analysis, isLoading, error, reset };
}
