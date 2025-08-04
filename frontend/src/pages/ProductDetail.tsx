import { useParams, useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Package } from "lucide-react";

const products = [
  { 
    id: 1, 
    name: "Wireless Headphones", 
    price: 89.99, 
    category: "Electronics", 
    stock: 45, 
    image: "📱",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    sku: "WH-001",
    brand: "TechSound",
    weight: "250g"
  },
  { 
    id: 2, 
    name: "Smart Watch", 
    price: 199.99, 
    category: "Electronics", 
    stock: 23, 
    image: "⌚",
    description: "Advanced fitness tracking, heart rate monitoring, and smartphone connectivity in a sleek design.",
    sku: "SW-002",
    brand: "FitTech",
    weight: "45g"
  },
  // Add more products as needed...
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === parseInt(id || "0"));

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate("/product")}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/product")}
              className="text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Product Details</h1>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20 p-2"
            >
              <Edit className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Product Image & Basic Info */}
        <Card className="bg-gradient-card border-0 shadow-card mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">{product.image}</div>
              <h1 className="text-2xl font-bold text-foreground mb-2">{product.name}</h1>
              <Badge variant="outline" className="mb-4">{product.category}</Badge>
              <p className="text-3xl font-bold text-primary">${product.price}</p>
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card className="bg-gradient-card border-0 shadow-card mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Product Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-foreground mt-1">{product.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">SKU</label>
                  <p className="text-foreground mt-1">{product.sku}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Brand</label>
                  <p className="text-foreground mt-1">{product.brand}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Weight</label>
                  <p className="text-foreground mt-1">{product.weight}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Stock</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <Badge 
                      variant={product.stock > 20 ? "default" : product.stock > 10 ? "secondary" : "destructive"}
                    >
                      {product.stock} units
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            variant="business" 
            className="flex-1"
            onClick={() => navigate(`/product/${product.id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Product
          </Button>
          <Button 
            variant="destructive" 
            size="icon"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}