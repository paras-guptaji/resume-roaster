import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ConfidenceScoreProps {
  score: number;
  breakdown: {
    metricsUsage: number;
    actionVerbs: number;
    clarity: number;
    roleAlignment: number;
  };
}

function getScoreLabel(score: number): { label: string; emoji: string; color: string } {
  if (score >= 80) {
    return { label: "Interview-Ready!", emoji: "🏆", color: "text-score-high" };
  }
  if (score >= 60) {
    return { label: "Getting There", emoji: "📈", color: "text-score-medium" };
  }
  return { label: "Risky Resume", emoji: "⚠️", color: "text-score-low" };
}

function getProgressColor(score: number): string {
  if (score >= 80) return "bg-score-high";
  if (score >= 60) return "bg-score-medium";
  return "bg-score-low";
}

export function ConfidenceScore({ score, breakdown }: ConfidenceScoreProps) {
  const { label, emoji, color } = getScoreLabel(score);

  const breakdownItems = [
    { label: "Metrics Usage", value: breakdown.metricsUsage, max: 25 },
    { label: "Action Verbs", value: breakdown.actionVerbs, max: 25 },
    { label: "Clarity", value: breakdown.clarity, max: 25 },
    { label: "Role Alignment", value: breakdown.roleAlignment, max: 25 },
  ];

  return (
    <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          📊 Confidence Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main score */}
        <div className="text-center">
          <div className={`text-6xl font-bold font-display ${color} score-pulse`}>
            {score}
          </div>
          <div className="text-lg text-muted-foreground mt-1">
            {emoji} {label}
          </div>
        </div>

        {/* Score bar */}
        <div className="relative h-4 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-out ${getProgressColor(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          {breakdownItems.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium">{item.value}/{item.max}</span>
              </div>
              <Progress value={(item.value / item.max) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
