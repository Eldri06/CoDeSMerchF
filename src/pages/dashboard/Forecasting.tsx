import { Brain, TrendingUp, Target, Info, Download, FileText, BarChart3, Activity, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";

const Forecasting = () => {
  const historicalTrend = [
    { event: "Event 1", actual: 100, predicted: 95 },
    { event: "Event 2", actual: 120, predicted: 118 },
    { event: "Event 3", actual: 140, predicted: 138 },
    { event: "Event 4", actual: 160, predicted: 162 },
    { event: "Event 5", actual: 180, predicted: 175 },
    { event: "Predicted", actual: null, predicted: 195 },
  ];

  const featureImportance = [
    { factor: "Event Type (Intramurals)", importance: 65 },
    { factor: "Past Popularity", importance: 45 },
    { factor: "Season (Summer)", importance: 35 },
    { factor: "Price Point", importance: 25 },
    { factor: "Day of Week", importance: 15 },
  ];

  const errorDistribution = [
    { error: -20, frequency: 2 },
    { error: -15, frequency: 5 },
    { error: -10, frequency: 12 },
    { error: -5, frequency: 18 },
    { error: 0, frequency: 20 },
    { error: 5, frequency: 18 },
    { error: 10, frequency: 12 },
    { error: 15, frequency: 5 },
    { error: 20, frequency: 2 },
  ];

  const comparativeData = [
    { event: "Intramurals 2024", actual: 150, predicted: 145, accuracy: "96.7%" },
    { event: "Foundation Week 2024", actual: 120, predicted: 128, accuracy: "93.3%" },
    { event: "Tech Week 2024", actual: 95, predicted: 88, accuracy: "92.6%" },
  ];

  const trainingHistory = [
    { date: "Jan 20 2025", events: 15, r2: 0.85, status: "Active" },
    { date: "Dec 15 2024", events: 12, r2: 0.82, status: "Archived" },
    { date: "Nov 10 2024", events: 10, r2: 0.79, status: "Archived" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Brain size={32} className="text-primary" />
            AI Demand Forecasting
          </h1>
          <p className="text-muted-foreground">Linear Regression model trained on historical sales data</p>
          <Badge variant="outline" className="mt-2">Model Last Trained: January 20, 2025</Badge>
        </div>
        <Button className="gap-2" size="lg">
          <RefreshCw size={20} />
          Generate New Forecast
        </Button>
      </div>

      {/* Model Performance Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <BarChart3 className="text-primary" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Model Performance</h2>
            <p className="text-sm text-muted-foreground">Based on 15 past events, 2,340 transactions</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="p-4 bg-background/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
            <p className="text-2xl font-bold text-success">87.5%</p>
          </div>
          <div className="p-4 bg-background/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">R² Score</p>
            <p className="text-2xl font-bold">0.85</p>
          </div>
          <div className="p-4 bg-background/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Mean Error</p>
            <p className="text-2xl font-bold">±12 units</p>
          </div>
          <div className="p-4 bg-background/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Confidence</p>
            <Badge className="text-lg">High</Badge>
          </div>
        </div>

        <div className="p-4 bg-primary/5 rounded-lg flex gap-2">
          <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">What is Linear Regression?</p>
            <p className="text-sm text-muted-foreground">
              This model analyzes past sales patterns to predict future demand based on factors like event type, 
              product popularity, and seasonal trends.
            </p>
          </div>
        </div>
      </Card>

      {/* Forecast Selection */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Select Event & Product to Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Event</label>
            <select className="w-full p-2 border border-border rounded-lg bg-background">
              <option>Intramurals 2025</option>
              <option>Foundation Week 2025</option>
              <option>Tech Week 2025</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Product</label>
            <select className="w-full p-2 border border-border rounded-lg bg-background">
              <option>CoDeS T-Shirt - Blue</option>
              <option>CoDeS Lanyard</option>
              <option>CoDeS Keychain</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <input 
              type="text" 
              value="Feb 1 - Feb 3, 2025" 
              className="w-full p-2 border border-border rounded-lg bg-background"
              readOnly 
            />
          </div>
        </div>
        <Button size="lg" className="w-full gap-2">
          <Brain size={20} />
          Generate Prediction
        </Button>
      </Card>

      {/* Main Prediction Result */}
      <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target size={28} className="text-primary" />
            <h2 className="text-2xl font-bold">Predicted Demand</h2>
          </div>
          <div className="text-7xl font-bold text-primary mb-4">156 units</div>
          <div className="flex items-center justify-center gap-6 text-muted-foreground mb-4">
            <span className="flex items-center gap-2">
              <TrendingUp size={20} />
              Expected Range: 140 - 172 units
            </span>
            <span>•</span>
            <span>Confidence Interval: ±10% (High Confidence)</span>
          </div>
          <Badge className="text-lg px-4 py-2 bg-success">High Confidence</Badge>
        </div>

        <div className="p-6 bg-background/50 rounded-lg">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              💡
            </div>
            <div>
              <p className="font-semibold mb-2">Recommendation:</p>
              <p className="text-muted-foreground">
                Order <span className="font-bold text-foreground">165 units</span> to account for uncertainty and 
                avoid stockouts. Based on similar past events.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Historical Trend Graph */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp size={24} />
          Sales Trend Analysis
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={historicalTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="event" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="actual" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" name="Actual Sales" />
            <Line type="linear" dataKey="predicted" stroke="hsl(var(--success))" strokeWidth={2} name="Trend Line" />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Historical sales data with linear regression trend line and future prediction
        </p>
      </Card>

      {/* Feature Importance Chart */}
      <Card className="p-6">
        <div className="flex items-start gap-2 mb-4">
          <Info size={20} className="text-primary mt-1" />
          <div>
            <h2 className="text-xl font-bold">Factors Affecting Prediction</h2>
            <p className="text-sm text-muted-foreground">These factors most influence the prediction</p>
          </div>
        </div>
        <div className="space-y-4">
          {featureImportance.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{item.factor}</span>
                <span className="text-sm font-bold">{item.importance}%</span>
              </div>
              <Progress value={item.importance} className="h-3" />
            </div>
          ))}
        </div>
      </Card>

      {/* Comparative Analysis */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Comparison with Similar Events</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Event</th>
                <th className="text-left py-3 px-4">Actual</th>
                <th className="text-left py-3 px-4">Predicted</th>
                <th className="text-left py-3 px-4">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {comparativeData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">{row.event}</td>
                  <td className="py-3 px-4">{row.actual}</td>
                  <td className="py-3 px-4">{row.predicted}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="bg-success/10">
                      {row.accuracy} ✓
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-4 bg-muted rounded-lg text-center">
          <span className="font-semibold">Average Model Accuracy: </span>
          <span className="text-2xl font-bold text-success">94.2%</span>
        </div>
      </Card>

      {/* Residual Error Graph */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Prediction Error Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={errorDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="error" label={{ value: 'Error (units)', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="frequency" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Most predictions are within ±10 units of actual sales
        </p>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button variant="outline" className="gap-2">
          <Download size={20} />
          Export Report (PDF)
        </Button>
        <Button variant="outline" className="gap-2">
          <FileText size={20} />
          Export Data (CSV)
        </Button>
        <Button variant="outline" className="gap-2">
          <Activity size={20} />
          Create Purchase Order
        </Button>
        <Button variant="outline" className="gap-2">
          <RefreshCw size={20} />
          Retrain Model
        </Button>
      </div>

      {/* Training History */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Training History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Date Trained</th>
                <th className="text-left py-3 px-4">Events Used</th>
                <th className="text-left py-3 px-4">R² Score</th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {trainingHistory.map((row, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">{row.date}</td>
                  <td className="py-3 px-4">{row.events}</td>
                  <td className="py-3 px-4 font-mono">{row.r2}</td>
                  <td className="py-3 px-4">
                    <Badge variant={row.status === "Active" ? "default" : "outline"}>
                      {row.status === "Active" ? "✓ " : ""}
                      {row.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          Model improves as more event data is collected
        </p>
      </Card>
    </div>
  );
};

export default Forecasting;