
import { BottomNav } from "@/components/navigation/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Service() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-black text-white p-6">
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
              <h1 className="text-2xl font-bold">Service Center</h1>
              <p className="text-white/80 mt-1">Customer support & help</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <Card className="border-black/20">
          <CardHeader>
            <CardTitle className="text-black">Recharge Bonuses - USD</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 border border-black/10 rounded">
              <span className="text-black">Recharge $1000</span>
              <span className="text-black font-medium">Get 10% bonus</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-black/10 rounded">
              <span className="text-black">Recharge $5000</span>
              <span className="text-black font-medium">Get 25% bonus</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-black/10 rounded">
              <span className="text-black">Recharge $10000</span>
              <span className="text-black font-medium">Get 35% bonus</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-black/20">
          <CardHeader>
            <CardTitle className="text-black">Recharge Bonuses - USDT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 border border-black/10 rounded">
              <span className="text-black">Recharge 1000 USDT</span>
              <span className="text-black font-medium">Get 20% bonus</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-black/10 rounded">
              <span className="text-black">Recharge 5000 USDT</span>
              <span className="text-black font-medium">Get 30% bonus</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-black/10 rounded">
              <span className="text-black">Recharge 10000 USDT</span>
              <span className="text-black font-medium">Get 40% bonus</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-black/20">
          <CardContent className="pt-6">
            <p className="text-black text-sm text-center">
              If you need to obtain the process of purchasing USDT and recharging USDT, please contact customer service.
            </p>
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}
