import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  subtitle: string;
  value: number;
  unit: string;
}

export function StatCard({
  icon: Icon,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  title,
  subtitle,
  value,
  unit,
}: StatCardProps) {
  return (
    <Card className="relative p-6 border bg-card hover:bg-accent/5 transition-colors">
      {/* Top Section: Icon and Label */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-md ${iconBgColor}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      {/* Bottom Section: Statistics */}
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight">
          {value}
        </span>
        <span className="text-sm text-muted-foreground font-medium">{unit}</span>
      </div>
    </Card>
  );
}