import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import AddProduct from "./pages/AddProduct";
import DistributionCenter from "./pages/DistributionCenter";
import Order from "./pages/Order";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import ShopSettings from "./pages/ShopSettings";
import RefundOrders from "./pages/RefundOrders";
import ShopExpress from "./pages/ShopExpress";
import Service from "./pages/Service";
import Withdrawal from "./pages/Withdrawal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product" element={<ProductList />} />
          <Route path="/product/add" element={<AddProduct />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/distribution" element={<DistributionCenter />} />
          <Route path="/order" element={<Order />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shop-settings" element={<ShopSettings />} />
          <Route path="/refund-orders" element={<RefundOrders />} />
          <Route path="/shop-express" element={<ShopExpress />} />
          <Route path="/service" element={<Service />} />
          <Route path="/withdrawal" element={<Withdrawal />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
