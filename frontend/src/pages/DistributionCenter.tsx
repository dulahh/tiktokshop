import { BottomNav } from "@/components/navigation/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Package, TrendingUp, TrendingDown } from "lucide-react";

const productsByCategory = {
  "Electronics": [
    { id: 1, name: "Apple iPhone 15 Pro", stock: 45, price: 999.99, trend: "up", image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400" },
    { id: 2, name: "Apple Watch Series 9", stock: 23, price: 399.99, trend: "down", image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400" },
    { id: 7, name: "JBL Flip 6 Speaker", stock: 56, price: 129.95, trend: "up", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400" },
    { id: 9, name: "Sony WH-1000XM5 Headphones", stock: 15, price: 399.99, trend: "up", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    { id: 13, name: "MacBook Pro 14-inch", stock: 7, price: 1999.00, trend: "down", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400" },
  ],
  "Fashion": [
    { id: 3, name: "Nike Air Jordan 1", stock: 67, price: 170.00, trend: "up", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
    { id: 8, name: "Levi's 501 Original Jeans", stock: 28, price: 59.50, trend: "down", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
    { id: 10, name: "Adidas Ultraboost 22", stock: 31, price: 190.00, trend: "up", image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400" },
    { id: 14, name: "Zara Blazer", stock: 22, price: 89.90, trend: "up", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400" },
  ],
  "Home & Kitchen": [
    { id: 4, name: "Ninja Coffee Maker", stock: 12, price: 149.99, trend: "down", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400" },
    { id: 11, name: "Instant Pot Duo 7-in-1", stock: 8, price: 79.95, trend: "up", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" },
    { id: 15, name: "Dyson V15 Detect", stock: 4, price: 749.99, trend: "down", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400" },
  ],
  "Beauty & Personal Care": [
    { id: 5, name: "The Ordinary Niacinamide", stock: 89, price: 7.20, trend: "up", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400" },
    { id: 12, name: "Cetaphil Daily Moisturizer", stock: 76, price: 13.49, trend: "up", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400" },
  ],
  "Books": [
    { id: 6, name: "Clean Code Book", stock: 34, price: 42.99, trend: "up", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400" },
  ],
};

export default function DistributionCenter() {
  const getTotalStock = (products: any[]) => {
    return products.reduce((sum, product) => sum + product.stock, 0);
  };

  const getTotalValue = (products: any[]) => {
    return products.reduce((sum, product) => sum + (product.stock * product.price), 0);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold">Distribution Center</h1>
          <p className="text-white/80 mt-1">Inventory management by category</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {Object.entries(productsByCategory).map(([category, products]) => (
          <Card key={category} className="bg-gradient-card border-0 shadow-card mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category}</CardTitle>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Units</p>
                  <p className="text-lg font-bold text-primary">{getTotalStock(products)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Products</p>
                  <p className="text-base font-semibold">{products.length} items</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-base font-semibold text-accent">${getTotalValue(products).toLocaleString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {products.map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/50"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{product.name}</h4>
                        {product.trend === "up" ? (
                          <TrendingUp className="w-3 h-3 text-accent" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-destructive" />
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <Package className="w-3 h-3 text-muted-foreground" />
                          <Badge 
                            variant={product.stock > 20 ? "default" : product.stock > 10 ? "secondary" : "destructive"}
                            className="text-xs"
                          >
                            {product.stock}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-primary">${product.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <BottomNav />
    </div>
  );
} 