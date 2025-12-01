import { Target, TrendingUp, Award, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const Performance = () => {
  const goals = [
    { name: "Revenue Target", current: 45230, target: 50000, unit: "₱" },
    { name: "Items Sold", current: 284, target: 300, unit: "" },
    { name: "Transactions", current: 156, target: 200, unit: "" },
    { name: "Customer Satisfaction", current: 92, target: 95, unit: "%" },
  ];

  const topPerformers = [
    { name: "CoDeS T-Shirt (L)", sold: 45, revenue: 11250, growth: 25 },
    { name: "CoDeS Lanyard", sold: 120, revenue: 6000, growth: 18 },
    { name: "CoDeS Sticker Pack", sold: 80, revenue: 2000, growth: 15 },
  ];

  const insights = [
    {
      type: "success",
      title: "Strong T-Shirt Performance",
      description: "T-shirts exceeded target by 25%, highest demand for size L",
    },
    {
      type: "warning",
      title: "Low Mug Sales",
      description: "Mug sales below expectation, consider promotional strategies",
    },
    {
      type: "info",
      title: "Peak Sales Hours",
      description: "Most sales occur between 12 PM - 2 PM, optimize staffing",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Performance</h1>
        <p className="text-muted-foreground">Track goals and analyze performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal, index) => {
          const progress = (goal.current / goal.target) * 100;
          const isOnTrack = progress >= 80;
          
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">{goal.name}</h3>
                <Badge variant={isOnTrack ? "default" : "secondary"}>
                  {isOnTrack ? "On Track" : "Behind"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current</span>
                  <span className="font-bold">
                    {goal.unit}{goal.current.toLocaleString()}{goal.unit === "%" ? "" : ""}
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Target</span>
                  <span>
                    {goal.unit}{goal.target.toLocaleString()}{goal.unit === "%" ? "" : ""}
                  </span>
                </div>
                <div className="text-center pt-2">
                  <span className="text-2xl font-bold text-primary">{progress.toFixed(1)}%</span>
                  <p className="text-xs text-muted-foreground">Progress</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="text-warning" size={24} />
            <h2 className="text-xl font-bold">Top Performers</h2>
          </div>

          <div className="space-y-4">
            {topPerformers.map((product, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.sold} units sold</p>
                  </div>
                  <Badge className="bg-success">+{product.growth}%</Badge>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <span className="font-bold">₱{product.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-primary" size={24} />
            <h2 className="text-xl font-bold">Performance Insights</h2>
          </div>

          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    insight.type === "success" ? "bg-success/10" :
                    insight.type === "warning" ? "bg-warning/10" :
                    "bg-primary/10"
                  }`}>
                    {insight.type === "success" ? <Award className="text-success" size={20} /> :
                     insight.type === "warning" ? <AlertCircle className="text-warning" size={20} /> :
                     <Target className="text-primary" size={20} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Performance;