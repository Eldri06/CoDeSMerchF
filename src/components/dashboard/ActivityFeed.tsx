import { Card } from "@/components/ui/card";
import { CheckCircle, Package, AlertTriangle, Calendar } from "lucide-react";

const activities = [
  {
    type: "sale",
    icon: CheckCircle,
    color: "text-accent",
    bgColor: "bg-accent/10",
    text: "Sale #1234 completed",
    amount: "₱1,250.00",
    time: "2 minutes ago"
  },
  {
    type: "stock",
    icon: Package,
    color: "text-primary",
    bgColor: "bg-primary/10",
    text: "CoDeS T-Shirt (L) - Stock updated to 45",
    time: "15 minutes ago"
  },
  {
    type: "alert",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    text: "CoDeS Lanyard - Only 5 left in stock",
    time: "1 hour ago"
  },
  {
    type: "event",
    icon: Calendar,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    text: "New event: Foundation Week 2025",
    time: "3 hours ago"
  },
];

const ActivityFeed = () => {
  return (
    <Card className="p-6 glass-card border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest updates and alerts</p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex gap-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${activity.bgColor} flex-shrink-0`}>
                <Icon size={20} className={activity.color} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.text}</p>
                {activity.amount && (
                  <p className="text-sm text-accent font-semibold">{activity.amount}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors">
        View All Activity
      </button>
    </Card>
  );
};

export default ActivityFeed;