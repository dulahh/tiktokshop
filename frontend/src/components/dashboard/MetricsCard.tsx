import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon?: React.ReactNode;
  className?: string;
}

export const MetricsCard = ({ title, value, change, trend, icon, className }: MetricsCardProps) => {
  return (
    <Card className={`bg-gradient-card border-0 shadow-card hover:shadow-elevated transition-smooth ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
            {change && (
              <div className={`flex items-center mt-2 text-sm ${
                trend === "up" ? "text-accent" : trend === "down" ? "text-destructive" : "text-muted-foreground"
              }`}>
                {trend === "up" && <TrendingUp className="w-4 h-4 mr-1" />}
                {trend === "down" && <TrendingDown className="w-4 h-4 mr-1" />}
                {change}
              </div>
            )}
          </div>
          {icon && (
            <div className="text-primary opacity-80">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};