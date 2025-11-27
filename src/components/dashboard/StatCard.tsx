
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "increase" | "decrease";
  period?: string;
  icon: LucideIcon;
  color: "success" | "primary" | "warning" | "secondary";
  subtitle?: string;
  alert?: string;
}

const StatCard = ({ title, value, change, changeType, period, icon: Icon, color, subtitle, alert }: StatCardProps) => {
  const colorClasses = {
    success: "bg-accent/10 text-accent",
    primary: "bg-primary/10 text-primary",
    warning: "bg-amber-500/10 text-amber-500",
    secondary: "bg-secondary/10 text-secondary"
  };

  return (
    <Card className="p-6 hover-lift glass-card border-border/50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>

      {change && (
        <div className="flex items-center gap-2 text-sm">
          {changeType === "increase" ? (
            <TrendingUp size={16} className="text-accent" />
          ) : (
            <TrendingDown size={16} className="text-destructive" />
          )}
          <span className={changeType === "increase" ? "text-accent" : "text-destructive"}>
            {change}
          </span>
          {period && <span className="text-muted-foreground">{period}</span>}
        </div>
      )}

      {subtitle && (
        <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
      )}

      {alert && (
        <div className="mt-3 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-500">{alert}</p>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
