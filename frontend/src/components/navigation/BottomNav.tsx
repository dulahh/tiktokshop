
import { Home, Package, ShoppingCart, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Package, label: "Product", path: "/product" },
  { icon: ShoppingCart, label: "Order", path: "/order" },
  { icon: User, label: "Profile", path: "/profile" },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-black/20 shadow-lg z-50">
      <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Button
              key={path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(path)}
              className={`flex-col gap-1 h-auto py-2 px-3 transition-all duration-200 ${
                isActive 
                  ? "text-black bg-black/10" 
                  : "text-black/60 hover:text-black hover:bg-black/5"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform duration-200`} />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
