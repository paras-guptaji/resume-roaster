import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RejectionReason } from "@/types/resume";

interface RejectionReasonsProps {
  reasons: RejectionReason[];
}

export function RejectionReasons({ reasons }: RejectionReasonsProps) {
  return (
    <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          ❌ Why This Resume Gets Rejected
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          What a recruiter would write in their internal notes
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="flex gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20"
            >
              <span className="text-destructive font-bold text-lg">
                {index + 1}.
              </span>
              <div>
                <h4 className="font-semibold text-foreground">{reason.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
