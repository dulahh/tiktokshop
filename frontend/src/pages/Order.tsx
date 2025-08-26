import { useEffect, useMemo, useState } from "react";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Card, CardContent } from "@/components/ui/card";

type OrderResponse = {
  id: number;
  user_id: number;
  order_number: string;
  status: string;
  subtotal: number;
  discount: number;
  tax: number;
  shipping_fee: number;
  total: number;
  currency: string;
  created_at: string;
};

const API_BASE_URL = "http://localhost:8000"; // use http locally

const fmtUSD = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

export default function Order() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
      case "pending":
        return "text-orange-600";
      case "shipped":
        return "text-blue-600";
      case "delivered":
        return "text-green-600";
      case "cancelled":
      case "canceled":
      case "refunded":
        return "text-red-600";
      default:
        return "text-black";
    }
  };

  const fmtDate = (iso: string) => {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("auth-token"); // same key as your dashboard
        if (!token) {
          throw new Error("Not authenticated");
        }

        const res = await fetch(`${API_BASE_URL}/order`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          const msg = body?.detail || `Failed to load orders (${res.status})`;
          throw new Error(msg);
        }

        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || "Something went wrong");
        setOrders([]); // show "No orders yet." if empty
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const sorted = useMemo(
    () => [...orders].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)),
    [orders]
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-black text-white p-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-white/80 mt-1">Manage your orders</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {loading && (
          <Card className="border-black/20">
            <CardContent className="p-4">
              <p className="text-black/70">Loading orders…</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-300">
            <CardContent className="p-4">
              <p className="text-red-700">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && sorted.length === 0 && (
          <Card className="border-black/20">
            <CardContent className="p-4">
              <p className="text-black/70">No orders yet.</p>
            </CardContent>
          </Card>
        )}

        {!loading &&
          !error &&
          sorted.map((order) => (
            <Card key={order.id} className="border-black/20">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-black">{order.order_number}</h3>
                    <p className="text-black/70 text-sm">User #{order.user_id}</p>
                  </div>
                  <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <p className="text-black/80 text-sm mb-2">
                  Subtotal: {fmtUSD(order.subtotal)} • Tax: {fmtUSD(order.tax)} • Shipping:{" "}
                  {fmtUSD(order.shipping_fee)}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-black font-medium">{fmtUSD(order.total)}</span>
                  <span className="text-black/60 text-xs">{fmtDate(order.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <BottomNav />
    </div>
  );
}
