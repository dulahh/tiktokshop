import { BottomNav } from "@/components/navigation/BottomNav";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-email");
    localStorage.removeItem("user-name");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-white/80 mt-1">Account settings</p>
        </div>
      </div>
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">Profile management coming soon...</p>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}