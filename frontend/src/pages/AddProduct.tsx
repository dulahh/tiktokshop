import { useState } from "react";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";

const categories = ["Electronics", "Fashion", "Home & Kitchen", "Beauty & Personal Care", "Books"];

export default function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    image: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle product creation here
    console.log("Product data:", formData);
    navigate("/product");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-foreground text-background p-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/product")}
              className="text-background hover:bg-background/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Add Product</h1>
              <p className="text-background/80 mt-1">Create a new product</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Image */}
              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload image</p>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const imageUrl = URL.createObjectURL(file);
                        setFormData({...formData, image: imageUrl});
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => document.getElementById('image')?.click()}
                  >
                    Choose File
                  </Button>
                </div>
                {formData.image && (
                  <div className="mt-2">
                    <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded-lg" />
                  </div>
                )}
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  placeholder="0"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Add Product
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}