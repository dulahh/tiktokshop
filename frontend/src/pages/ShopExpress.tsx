import { BottomNav } from "@/components/navigation/BottomNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ShopExpress() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Shop Express Lane</h1>
              <p className="text-white/80 mt-1">Express delivery settings</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 py-6">
        <p className="text-center text-muted-foreground">Express delivery configuration coming soon...</p>
      </div>
      <BottomNav />
    </div>
  );
}