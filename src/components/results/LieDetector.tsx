import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LieDetectorFlag } from "@/types/resume";

interface LieDetectorProps {
  flags: LieDetectorFlag[];
}

const severityConfig = {
  warning: {
    label: "Warning",
    emoji: "⚠️",
    color: "bg-score-medium text-white",
    border: "border-score-medium/30",
    bg: "bg-score-medium/5",
  },
  suspicious: {
    label: "Suspicious",
    emoji: "🤔",
    color: "bg-gradient-orange text-white",
    border: "border-gradient-orange/30",
    bg: "bg-gradient-orange/5",
  },
  "red-flag": {
    label: "Red Flag",
    emoji: "🚨",
    color: "bg-score-low text-white",
    border: "border-score-low/30",
    bg: "bg-score-low/5",
  },
};

export function LieDetector({ flags }: LieDetectorProps) {
  return (
    <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          🕵️ Resume Lie Detector
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Claims that might raise eyebrows during interviews
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {flags.map((flag, index) => {
            const config = severityConfig[flag.severity];
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${config.border} ${config.bg}`}
              >
                <div className="flex items-start gap-3">
                  <Badge className={config.color}>
                    {config.emoji} {config.label}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      "{flag.claim}"
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {flag.issue}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
