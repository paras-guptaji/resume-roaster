import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import type { RoastIntensity } from "@/types/resume";

interface IntensitySliderProps {
  value: RoastIntensity;
  onChange: (value: RoastIntensity) => void;
}

const INTENSITY_CONFIG = {
  mild: {
    label: "Mild 🌱",
    description: "Constructive and gentle",
    color: "text-score-high",
  },
  medium: {
    label: "Medium 🌶️",
    description: "Honest but fair",
    color: "text-score-medium",
  },
  "extra-crispy": {
    label: "Extra Crispy 🔥🔥🔥",
    description: "No mercy. Gordon Ramsay mode.",
    color: "text-score-low",
  },
};

const intensityToValue = (intensity: RoastIntensity): number => {
  switch (intensity) {
    case "mild": return 0;
    case "medium": return 50;
    case "extra-crispy": return 100;
  }
};

const valueToIntensity = (value: number): RoastIntensity => {
  if (value < 33) return "mild";
  if (value < 67) return "medium";
  return "extra-crispy";
};

export function IntensitySlider({ value, onChange }: IntensitySliderProps) {
  const config = INTENSITY_CONFIG[value];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">
          Roast Intensity 🌡️
        </Label>
        <span className={`text-sm font-semibold ${config.color}`}>
          {config.label}
        </span>
      </div>
      
      <Slider
        value={[intensityToValue(value)]}
        onValueChange={([v]) => onChange(valueToIntensity(v))}
        max={100}
        step={1}
        className="w-full"
      />
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>🌱 Mild</span>
        <span>🌶️ Medium</span>
        <span>🔥 Extra Crispy</span>
      </div>
      
      <p className="text-sm text-muted-foreground text-center">
        {config.description}
      </p>
    </div>
  );
}
