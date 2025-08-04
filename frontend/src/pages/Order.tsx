
import { BottomNav } from "@/components/navigation/BottomNav";
import { Card, CardContent } from "@/components/ui/card";

const dummyOrders = [
  {
    id: "ORD001",
    customer: "John Doe",
    items: "Wireless Headphones x2",
    amount: "$199.98",
    status: "Processing",
    date: "2024-08-01"
  },
  {
    id: "ORD002",
    customer: "Jane Smith",
    items: "Smart Watch x1",
    amount: "$299.99",
    status: "Shipped",
    date: "2024-07-31"
  },
  {
    id: "ORD003",
    customer: "Mike Johnson",
    items: "Phone Case x3",
    amount: "$45.97",
    status: "Delivered",
    date: "2024-07-30"
  },
  {
    id: "ORD004",
    customer: "Sarah Wilson",
    items: "Bluetooth Speaker x1",
    amount: "$89.99",
    status: "Processing",
    date: "2024-07-29"
  },
  {
    id: "ORD005",
    customer: "David Brown",
    items: "Laptop Stand x1",
    amount: "$79.99",
    status: "Cancelled",
    date: "2024-07-28"
  }
];

export default function Order() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing": return "text-orange-600";
      case "Shipped": return "text-blue-600";
      case "Delivered": return "text-green-600";
      case "Cancelled": return "text-red-600";
      default: return "text-black";
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-black text-white p-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-white/80 mt-1">Manage your orders</p>
        </div>
      </div>
      
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {dummyOrders.map((order) => (
          <Card key={order.id} className="border-black/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-black">{order.id}</h3>
                  <p className="text-black/70 text-sm">{order.customer}</p>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-black/80 text-sm mb-2">{order.items}</p>
              <div className="flex justify-between items-center">
                <span className="text-black font-medium">{order.amount}</span>
                <span className="text-black/60 text-xs">{order.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <BottomNav />
    </div>
  );
}
