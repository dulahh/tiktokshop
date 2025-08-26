import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Users,
  Star,
  CreditCard,
  Settings,
  HeadphonesIcon,
  Wallet,
  Package,
} from "lucide-react";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { ActionButton } from "@/components/dashboard/ActionButton";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { BottomNav } from "@/components/navigation/BottomNav";

interface DashboardData {
  balance: number;
  products_sold: number;
  profit: number;
  total_revenue: number;
  total_orders: number;
  total_sales: number;
  profit_forecast: number;
  shop_followers: number;
  shop_rating: number;
  credit_score: number;
  updated_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStale, setIsStale] = useState(false);

  useEffect(() => {
  const token = localStorage.getItem("auth-token");
  if (!token) {
    navigate("/login");
    return;
  }

  // JWT expiration check
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (Date.now() >= payload.exp * 1000) {
      console.warn("Token expired, redirecting to login...");
      localStorage.removeItem("auth-token");
      navigate("/login");
      return;
    }
  } catch (err) {
    console.error("Invalid token, redirecting to login", err);
    localStorage.removeItem("auth-token");
    navigate("/login");
    return;
  }

  const TEN_MINUTES = 10 * 60 * 1000;

  // Load cached data first
  const cachedData = localStorage.getItem("dashboard-data");
  const cachedTimestamp = localStorage.getItem("dashboard-timestamp");

  if (cachedData && cachedTimestamp) {
    try {
      const parsed = JSON.parse(cachedData);
      if (parsed && typeof parsed === "object") {
        setData(parsed);
        setLoading(false);

        const age = Date.now() - parseInt(cachedTimestamp, 10);
        if (age > TEN_MINUTES) setIsStale(true);
      }
    } catch {
      // ignore parsing errors
    }
  }

  // ✅ Fetch fresh dashboard data
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:8000/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          console.warn("Unauthorized, redirecting to login...");
          localStorage.removeItem("auth-token");
          navigate("/login");
          return;
        }
        throw new Error(`Failed to fetch dashboard: ${res.status}`);
      }

      const result: DashboardData = await res.json();
      setData(result);
      localStorage.setItem("dashboard-data", JSON.stringify(result));
      localStorage.setItem("dashboard-timestamp", Date.now().toString());
      setIsStale(false);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
      if (!cachedData) setData(null);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [navigate]);

  // Tawk.to chat script
  useEffect(() => {
    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/6893104ffcd547192ddd9893/1j1v7fe1o";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const actionButtons = [
    { icon: Settings, label: "Shop Settings", path: "/shop-settings" },
    { icon: HeadphonesIcon, label: "Service", path: "/service" },
    { icon: Wallet, label: "Withdrawal", path: "/withdrawal" },
    { icon: Package, label: "Distribution Center", path: "/distribution" },
  ];

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="p-6 text-center text-red-500">Failed to load dashboard.</div>;
  }

  const metrics = [
    { title: "Total Sales", value: formatCurrency(data.total_sales), icon: <DollarSign className="w-6 h-6" /> },
    { title: "Total Profit", value: formatCurrency(data.profit), icon: <TrendingUp className="w-6 h-6" /> },
    { title: "Today's Orders", value: `${data.total_orders}`, icon: <ShoppingBag className="w-6 h-6" /> },
    { title: "Total Revenue", value: formatCurrency(data.total_revenue), icon: <DollarSign className="w-6 h-6" /> },
    { title: "Balance", value: formatCurrency(data.balance), icon: <Wallet className="w-6 h-6" /> },
    { title: "Profit Forecast", value: formatCurrency(data.profit_forecast), icon: <TrendingUp className="w-6 h-6" /> },
    { title: "Shop Followers", value: `${data.shop_followers}`, icon: <Users className="w-6 h-6" /> },
    { title: "Shop Rating", value: `${data.shop_rating}`, icon: <Star className="w-6 h-6" /> },
    { title: "Credit Score", value: `${data.credit_score}`, icon: <CreditCard className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-primary text-white p-6 pb-8">
        <div className="flex items-center justify-center p-1 rounded-2xl shadow-lg">
          <img src={logo} alt="Logo" className="w-36 h-auto" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4">
        {isStale && (
          <div className="text-sm text-yellow-600 mb-2 text-center">
            Displaying cached data, may be outdated.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          {metrics.slice(0, 4).map((metric, index) => (
            <MetricsCard key={index} title={metric.title} value={metric.value} icon={metric.icon} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 mb-6">
          {metrics.slice(4).map((metric, index) => (
            <MetricsCard key={index + 4} title={metric.title} value={metric.value} icon={metric.icon} />
          ))}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {actionButtons.map((button, index) => (
              <ActionButton key={index} icon={button.icon} label={button.label} onClick={() => navigate(button.path)} />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <SalesChart />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
