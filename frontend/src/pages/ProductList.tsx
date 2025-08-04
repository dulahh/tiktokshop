import { useState } from "react";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus } from "lucide-react";

const categories = ["All", "Electronics", "Fashion", "Home & Kitchen", "Beauty & Personal Care", "Books"];

const products = [
  { id: 1, name: "Apple iPhone 15 Pro", price: 999.99, category: "Electronics", stock: 45, image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400" },
  { id: 2, name: "Apple Watch Series 9", price: 399.99, category: "Electronics", stock: 23, image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400" },
  { id: 3, name: "Nike Air Jordan 1", price: 170.00, category: "Fashion", stock: 67, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
  { id: 4, name: "Ninja Coffee Maker", price: 149.99, category: "Home & Kitchen", stock: 12, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400" },
  { id: 5, name: "The Ordinary Niacinamide", price: 7.20, category: "Beauty & Personal Care", stock: 89, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400" },
  { id: 6, name: "Clean Code Book", price: 42.99, category: "Books", stock: 34, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400" },
  { id: 7, name: "JBL Flip 6 Speaker", price: 129.95, category: "Electronics", stock: 56, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400" },
  { id: 8, name: "Levi's 501 Original Jeans", price: 59.50, category: "Fashion", stock: 28, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
  { id: 9, name: "Sony WH-1000XM5 Headphones", price: 399.99, category: "Electronics", stock: 15, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
  { id: 10, name: "Adidas Ultraboost 22", price: 190.00, category: "Fashion", stock: 31, image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400" },
  { id: 11, name: "Instant Pot Duo 7-in-1", price: 79.95, category: "Home & Kitchen", stock: 8, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" },
  { id: 12, name: "Cetaphil Daily Moisturizer", price: 13.49, category: "Beauty & Personal Care", stock: 76, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400" },
  { id: 13, name: "MacBook Pro 14-inch", price: 1999.00, category: "Electronics", stock: 7, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400" },
  { id: 14, name: "Zara Blazer", price: 89.90, category: "Fashion", stock: 22, image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400" },
  { id: 15, name: "Dyson V15 Detect", price: 749.99, category: "Home & Kitchen", stock: 4, image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400" },
];

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Products</h1>
              <p className="text-white/80 mt-1">Manage your inventory</p>
            </div>
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => navigate("/product/add")}
              className="bg-white/20 hover:bg-white/30 text-white border-white/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "business" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="bg-gradient-card border-0 shadow-card hover:shadow-elevated transition-smooth cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
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
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-lg font-bold text-primary">${product.price}</p>
                      <Badge 
                        variant={product.stock > 20 ? "default" : product.stock > 10 ? "secondary" : "destructive"}
                      >
                        {product.stock} in stock
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}