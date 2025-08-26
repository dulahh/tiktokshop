import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

export default function Withdrawal() {
  const navigate = useNavigate();
  const [withdrawMethod, setWithdrawMethod] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("auth-token");
    if (!token) {
      alert("You must be logged in.");
      navigate("/login");
      return;
    }

    const payload = {
      method: withdrawMethod,
      phone_number: phoneNumber,
      amount: parseFloat(amount),
      currency,
    };

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Withdrawal failed");
      }

      const data = await res.json();
      alert(`Withdrawal successful! Transaction ID: ${data.transaction_id}`);
      navigate("/dashboard");
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
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
              <h1 className="text-2xl font-bold">Withdrawal</h1>
              <p className="text-white/80 mt-1">
                Request & track withdrawals
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <Card className="border-black/20">
          <CardHeader>
            <CardTitle className="text-black">
              Withdrawal Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label className="text-black font-medium">
                  Withdraw Method
                </Label>
                <RadioGroup
                  value={withdrawMethod}
                  onValueChange={setWithdrawMethod}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="easypaisa" id="easypaisa" />
                    <Label htmlFor="easypaisa" className="text-black">
                      EasyPaisa
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="jazzcash" id="jazzcash" />
                    <Label htmlFor="jazzcash" className="text-black">
                      JazzCash
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-black font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border-black/20 text-black"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-black font-medium">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="border-black/20 text-black">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PKR">PKR</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-black font-medium">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border-black/20 text-black"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-black/90"
                disabled={
                  !withdrawMethod || !phoneNumber || !currency || !amount || loading
                }
              >
                {loading ? "Processing..." : "Submit Withdrawal Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
