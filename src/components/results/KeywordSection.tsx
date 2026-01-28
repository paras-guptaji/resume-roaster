import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KeywordSectionProps {
  missing: string[];
  injected: string[];
}

export function KeywordSection({ missing, injected }: KeywordSectionProps) {
  return (
    <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          🎯 ATS Keywords
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Keywords recruiters and ATS systems look for
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Missing Keywords */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            ❌ Missing from your resume
          </h4>
          <div className="flex flex-wrap gap-2">
            {missing.length > 0 ? (
              missing.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-destructive/30 text-destructive bg-destructive/5"
                >
                  {keyword}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                Great job! No critical keywords missing 🎉
              </span>
            )}
          </div>
        </div>

        {/* Injected Keywords */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            ✅ Added in improved bullets
          </h4>
          <div className="flex flex-wrap gap-2">
            {injected.length > 0 ? (
              injected.map((keyword, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-score-high/30 text-score-high bg-score-high/5"
                >
                  {keyword}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                Keywords will be shown after analysis
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
