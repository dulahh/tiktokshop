import { BottomNav } from "@/components/navigation/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ShopSettings() {
  const navigate = useNavigate();
  const [performanceMode, setPerformanceMode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = () => {
    // Simulate saving settings
    console.log({ performanceMode });
    setSuccessMessage("Settings saved successfully!");
    
    // Optionally, clear the success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

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
              <h1 className="text-2xl font-bold">Shop Settings</h1>
              <p className="text-white/80 mt-1">Configure your shop</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-lg mx-auto px-4 py-6">
        <Card className="border-black/20">
          <CardHeader>
            <CardTitle className="text-black">Shop Performance Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={performanceMode} onValueChange={setPerformanceMode}>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 border border-black/10 rounded">
                  <RadioGroupItem value="high-performance" id="high-performance" className="mt-1" />
                  <div className="space-y-1">
                    <Label htmlFor="high-performance" className="text-black font-medium">High Performance Shop</Label>
                    <p className="text-black/70 text-sm">Maximum processing speed, advanced features, premium support</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border border-black/10 rounded">
                  <RadioGroupItem value="low-performance" id="low-performance" className="mt-1" />
                  <div className="space-y-1">
                    <Label htmlFor="low-performance" className="text-black font-medium">Low Performance Shop</Label>
                    <p className="text-black/70 text-sm">Basic functionality, standard processing, cost-effective</p>
                  </div>
                </div>
              </div>
            </RadioGroup>
            
            <Button 
              onClick={handleSave}
              className="w-full bg-black text-white hover:bg-black/90"
              disabled={!performanceMode}
            >
              Save Settings
            </Button>

            {successMessage && (
              <p className="text-green-600 font-medium mt-2">{successMessage}</p>
            )}
          </CardContent>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}
