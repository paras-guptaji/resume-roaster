import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ROLES, type Role } from "@/types/resume";

interface RoleSelectorProps {
  value: Role;
  onChange: (value: Role) => void;
}

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="role" className="text-base font-medium">
        Target Role 🎯
      </Label>
      <Select value={value} onValueChange={(v) => onChange(v as Role)}>
        <SelectTrigger 
          id="role" 
          className="w-full h-12 text-base bg-card border-border hover:border-primary/50 transition-colors"
        >
          <SelectValue placeholder="Select your target role" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {ROLES.map((role) => (
            <SelectItem 
              key={role.value} 
              value={role.value}
              className="text-base py-3 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>{role.emoji}</span>
                <span>{role.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
