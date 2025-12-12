import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Package, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  stock: number;
  trend: number;
}

// Mock data - replace with Firebase
const mockProducts: Product[] = [
  {
    id: "1",
    name: "CoDeS T-Shirt - Blue",
    category: "Shirts",
    unitsSold: 89,
    revenue: 17800,
    stock: 45,
    trend: 23
  },
  {
    id: "2",
    name: "CoDeS Lanyard",
    category: "Accessories",
    unitsSold: 156,
    revenue: 7800,
    stock: 120,
    trend: 18
  },
  {
    id: "3",
    name: "CoDeS Keychain",
    category: "Accessories",
    unitsSold: 143,
    revenue: 7150,
    stock: 89,
    trend: 15
  },
  {
    id: "4",
    name: "CoDeS Sticker Pack",
    category: "Stickers",
    unitsSold: 234,
    revenue: 4680,
    stock: 200,
    trend: 34
  },
  {
    id: "5",
    name: "CoDeS Mug",
    category: "Drinkware",
    unitsSold: 67,
    revenue: 10050,
    stock: 33,
    trend: 12
  }
];

interface TopProductsProps {
  onNavigate?: (section: string) => void;
}

const TopProducts = ({ onNavigate }: TopProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with Firebase query
      // const data = await getTopProducts();
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setProducts(mockProducts);
    } catch (error) {
      console.error("Error fetching top products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 5) return { color: "destructive", label: "Critical" };
    if (stock <= 20) return { color: "warning", label: "Low" };
    return { color: "success", label: "In Stock" };
  };

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-bold">Top Products</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1">
            <Package size={14} />
            Best selling items this event
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onNavigate?.("products")}
          className="gap-2"
        >
          View All
          <ArrowUpRight size={14} />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-muted/20 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product, index) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <div 
                  key={product.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-all cursor-pointer group"
                  onClick={() => onNavigate?.("products")}
                >
                  {/* Rank */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                    index === 1 ? 'bg-gray-400/20 text-gray-400 border border-gray-400/30' :
                    index === 2 ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' :
                    'bg-muted/50 text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {product.name}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{product.unitsSold} sold</span>
                      <span className="text-primary font-medium">₱{product.revenue.toLocaleString()}</span>
                      <Badge 
                        variant={stockStatus.color as any}
                        className="text-xs"
                      >
                        {product.stock} {stockStatus.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Trend */}
                  <div className="flex items-center gap-1 text-success font-medium text-sm flex-shrink-0">
                    <TrendingUp size={16} />
                    +{product.trend}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopProducts;