import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  className?: string;
}

export const ActionButton = ({ icon: Icon, label, onClick, className }: ActionButtonProps) => {
  return (
    <Card className={`bg-gradient-card border-0 shadow-card hover:shadow-elevated transition-bounce cursor-pointer ${className}`}>
      <CardContent className="p-0">
        <Button
          variant="dashboard"
          onClick={onClick}
          className="w-full h-full min-h-20 flex-col gap-2 border-0 bg-transparent hover:bg-primary/5"
        >
          <Icon className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium text-center leading-tight">{label}</span>
        </Button>
      </CardContent>
    </Card>
  );
};