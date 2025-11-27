import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";

const products = [
  { rank: 1, name: "CoDeS T-Shirt (L)", sold: 145, revenue: 36250, trend: 12, image: "🎽" },
  { rank: 2, name: "CoDeS Lanyard", sold: 320, revenue: 16000, trend: 8, image: "🎫" },
  { rank: 3, name: "CoDeS Keychain", sold: 280, revenue: 8400, trend: -3, image: "🔑" },
  { rank: 4, name: "CoDeS Stickers", sold: 450, revenue: 4500, trend: 25, image: "⭐" },
  { rank: 5, name: "CoDeS Cap", sold: 89, revenue: 13350, trend: 5, image: "🧢" },
];

const TopProducts = () => {
  return (
    <Card className="p-6 glass-card border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">Top Products</h3>
          <p className="text-sm text-muted-foreground">Best sellers this event</p>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.rank} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-lg">
              {product.image}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.sold} sold</p>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold">₱{product.revenue.toLocaleString()}</p>
              <div className="flex items-center gap-1 justify-end">
                {product.trend > 0 ? (
                  <TrendingUp size={12} className="text-accent" />
                ) : (
                  <TrendingDown size={12} className="text-destructive" />
                )}
                <span className={`text-xs ${product.trend > 0 ? 'text-accent' : 'text-destructive'}`}>
                  {product.trend > 0 ? '+' : ''}{product.trend}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopProducts;