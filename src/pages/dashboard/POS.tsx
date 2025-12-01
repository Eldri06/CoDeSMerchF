import { useState } from "react";
import { Search, Filter, Grid, List, ShoppingCart, Package, Barcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const POS = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const products = [
    { id: 1, name: "CoDeS T-Shirt (L)", price: 250, stock: 45, image: "/placeholder.svg", category: "Shirts" },
    { id: 2, name: "CoDeS Lanyard", price: 50, stock: 120, image: "/placeholder.svg", category: "Lanyards" },
    { id: 3, name: "CoDeS Keychain", price: 30, stock: 5, image: "/placeholder.svg", category: "Keychains" },
    { id: 4, name: "CoDeS Sticker Pack", price: 25, stock: 80, image: "/placeholder.svg", category: "Others" },
    { id: 5, name: "CoDeS T-Shirt (M)", price: 250, stock: 32, image: "/placeholder.svg", category: "Shirts" },
    { id: 6, name: "CoDeS Mug", price: 150, stock: 15, image: "/placeholder.svg", category: "Others" },
  ];

  const addToCart = (product: any) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, change: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, Math.min(item.stock, item.quantity + change));
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

  return (
    <div className="flex h-full gap-6">
      {/* Product Selection Area - 60% */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search products or scan barcode... (F2)"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter size={20} />
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {["All Products", "Shirts", "Lanyards", "Keychains", "Others"].map((category) => (
            <Button key={category} variant="secondary" size="sm" className="whitespace-nowrap">
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto">
          {products.map((product) => (
            <Card
              key={product.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
              onClick={() => addToCart(product)}
            >
              <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                <Package size={48} className="text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1 text-sm">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">₱{product.price}</span>
                <Badge variant={product.stock > 20 ? "default" : product.stock > 5 ? "secondary" : "destructive"}>
                  {product.stock} left
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Area - 40% */}
      <Card className="w-[400px] p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Current Sale</h2>
          <Badge>Intramurals 2025</Badge>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingCart size={64} className="text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">Select products to start a sale</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-muted rounded-lg">
                <div className="w-12 h-12 bg-background rounded flex items-center justify-center flex-shrink-0">
                  <Package size={24} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground">₱{item.price} each</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </Button>
                  </div>
                  <p className="font-bold text-sm">₱{item.price * item.quantity}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => removeFromCart(item.id)}
                >
                  ×
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="space-y-3 pt-4 border-t">
          <div className="space-y-2 bg-muted p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Items ({cartItems.length})</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount</span>
              <span className="text-success">-₱0.00</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">₱{total.toFixed(2)}</span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout <span className="ml-2">→</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default POS;