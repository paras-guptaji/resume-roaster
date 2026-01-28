import { Flame } from "lucide-react";

export function HeroSection() {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 mb-4">
        <span className="text-5xl fire-bounce">🔥</span>
        <h1 className="font-display text-5xl md:text-6xl font-bold gradient-text">
          AI Resume Roaster
        </h1>
        <span className="text-5xl fire-bounce" style={{ animationDelay: "0.3s" }}>🔥</span>
      </div>
      
      <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-6">
        Your resume is about to get <span className="font-semibold text-primary">roasted</span>, 
        scored, and transformed into an interview magnet.
      </p>
      
      <div className="flex flex-wrap justify-center gap-3 text-sm">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
          <Flame className="w-4 h-4" /> Brutal Roasts
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
          📊 ATS Scoring
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
          ✨ AI-Fixed Bullets
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
          🕵️ Lie Detector
        </span>
      </div>
    </div>
  );
}
