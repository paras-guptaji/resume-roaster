import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BulletAnalysis as BulletAnalysisType } from "@/types/resume";

interface BulletAnalysisProps {
  bullets: BulletAnalysisType[];
}

const strengthConfig = {
  weak: {
    label: "Weak",
    emoji: "❌",
    color: "bg-bullet-weak text-white",
    border: "border-bullet-weak/30",
  },
  average: {
    label: "Average",
    emoji: "⚠️",
    color: "bg-bullet-average text-white",
    border: "border-bullet-average/30",
  },
  strong: {
    label: "Strong",
    emoji: "✅",
    color: "bg-bullet-strong text-white",
    border: "border-bullet-strong/30",
  },
};

export function BulletAnalysis({ bullets }: BulletAnalysisProps) {
  const { toast } = useToast();

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied! 📋",
      description: "Paste it into your resume",
    });
  };

  const handleCopyAll = async () => {
    const allFixed = bullets.map((b) => `• ${b.fixed}`).join("\n");
    await navigator.clipboard.writeText(allFixed);
    toast({
      title: "All bullets copied! 📋",
      description: "Your improved bullets are ready to paste",
    });
  };

  return (
    <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              ✨ Bullet Strength Analysis
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Before → After transformation
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleCopyAll} className="gap-2">
            <Copy className="w-4 h-4" />
            Copy All Fixed
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {bullets.map((bullet, index) => {
            const config = strengthConfig[bullet.strength];
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${config.border} bg-card/50`}
              >
                {/* Header with strength badge */}
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={config.color}>
                    {config.emoji} {config.label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {bullet.issue}
                  </span>
                </div>

                {/* Before/After comparison */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Original */}
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Original
                    </span>
                    <p className="text-sm text-foreground/70 line-through decoration-destructive/50">
                      {bullet.original}
                    </p>
                  </div>

                  {/* Arrow for desktop */}
                  <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>

                  {/* Fixed */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Improved
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleCopy(bullet.fixed)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-foreground font-medium">
                      {bullet.fixed}
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
