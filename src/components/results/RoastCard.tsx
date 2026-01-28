import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { RoastIntensity } from "@/types/resume";

interface RoastCardProps {
  roast: string;
  intensity: RoastIntensity;
}

const intensityEmoji = {
  mild: "🌱",
  medium: "🌶️",
  "extra-crispy": "🔥🔥🔥",
};

export function RoastCard({ roast, intensity }: RoastCardProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(roast);
    toast({
      title: "Roast copied! 📋",
      description: "Now share the pain with others",
    });
  };

  return (
    <Card className="glow-card border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            <span className="fire-bounce">🔥</span>
            The Roast
            <span className="text-sm font-normal text-muted-foreground">
              {intensityEmoji[intensity]}
            </span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {roast}
        </p>
      </CardContent>
    </Card>
  );
}
