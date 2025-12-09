import { useState } from "react";
import { Brain, TrendingUp, Target, Info, Download, FileText, BarChart3, Activity, RefreshCw, ChevronDown, ChevronUp, LineChart as LineChartIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";

const TrendChartContent = ({ data }: { data: Array<{ event: string; actual: number | null; predicted: number }> }) => (
  <Card className="p-4 md:p-6">
    <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
      <TrendingUp size={20} />
      Sales Trend Analysis
    </h2>
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="event" stroke="hsl(var(--muted-foreground))" fontSize={10} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
        <Legend />
        <Area type="monotone" dataKey="actual" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" name="Actual Sales" />
        <Line type="linear" dataKey="predicted" stroke="hsl(var(--success))" strokeWidth={2} name="Trend Line" />
      </AreaChart>
    </ResponsiveContainer>
    <p className="text-xs text-muted-foreground mt-3 text-center">
      Historical sales data with linear regression trend line
    </p>
  </Card>
);

const ErrorChartContent = ({ data }: { data: Array<{ error: number; frequency: number }> }) => (
  <Card className="p-4 md:p-6">
    <h2 className="text-lg md:text-xl font-bold mb-4">Prediction Error Distribution</h2>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="error" stroke="hsl(var(--muted-foreground))" fontSize={10} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
        <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
        <Bar dataKey="frequency" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
    <p className="text-xs text-muted-foreground mt-3 text-center">
      Most predictions are within ±10 units of actual sales
    </p>
  </Card>
);

const Forecasting = () => {
  const [showTrendChart, setShowTrendChart] = useState(false);
  const [showErrorChart, setShowErrorChart] = useState(false);

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



  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 flex items-center gap-2">
            <Brain size={24} className="text-primary" />
            AI Forecasting
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">Linear Regression model trained on historical data</p>
          <Badge variant="outline" className="mt-2 text-xs">Last Trained: Jan 20, 2025</Badge>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <RefreshCw size={18} />
          <span className="hidden sm:inline">Generate New Forecast</span>
          <span className="sm:hidden">Generate</span>
        </Button>
      </div>

      {/* Model Performance Card */}
      <Card className="p-4 md:p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex items-start gap-3 md:gap-4 mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <BarChart3 className="text-primary" size={20} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold">Model Performance</h2>
            <p className="text-xs md:text-sm text-muted-foreground">Based on 15 past events</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4">
          <div className="p-3 md:p-4 bg-background/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-0.5">Accuracy</p>
            <p className="text-lg md:text-2xl font-bold text-success">87.5%</p>
          </div>
          <div className="p-3 md:p-4 bg-background/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-0.5">R² Score</p>
            <p className="text-lg md:text-2xl font-bold">0.85</p>
          </div>
          <div className="p-3 md:p-4 bg-background/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-0.5">Mean Error</p>
            <p className="text-lg md:text-2xl font-bold">±12</p>
          </div>
          <div className="p-3 md:p-4 bg-background/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-0.5">Confidence</p>
            <Badge className="text-sm md:text-lg">High</Badge>
          </div>
        </div>

        <div className="p-3 md:p-4 bg-primary/5 rounded-lg flex gap-2">
          <Info size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm mb-1">What is Linear Regression?</p>
            <p className="text-xs text-muted-foreground">
              This model analyzes past sales patterns to predict future demand.
            </p>
          </div>
        </div>
      </Card>

      {/* Forecast Selection */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Select Event & Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4">
          <div>
            <label className="text-xs md:text-sm font-medium mb-1.5 block">Event</label>
            <select className="w-full p-2 text-sm border border-border rounded-lg bg-background">
              <option>Intramurals 2025</option>
              <option>Foundation Week 2025</option>
              <option>Tech Week 2025</option>
            </select>
          </div>
          <div>
            <label className="text-xs md:text-sm font-medium mb-1.5 block">Product</label>
            <select className="w-full p-2 text-sm border border-border rounded-lg bg-background">
              <option>CoDeS T-Shirt - Blue</option>
              <option>CoDeS Lanyard</option>
              <option>CoDeS Keychain</option>
            </select>
          </div>
          <div>
            <label className="text-xs md:text-sm font-medium mb-1.5 block">Date Range</label>
            <input 
              type="text" 
              value="Feb 1 - Feb 3, 2025" 
              className="w-full p-2 text-sm border border-border rounded-lg bg-background"
              readOnly 
            />
          </div>
        </div>
        <Button size="lg" className="w-full gap-2">
          <Brain size={18} />
          Generate Prediction
        </Button>
      </Card>

      {/* Main Prediction Result */}
      <Card className="p-4 md:p-8 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="text-center mb-4 md:mb-6">
          <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
            <Target size={24} className="text-primary" />
            <h2 className="text-xl md:text-2xl font-bold">Predicted Demand</h2>
          </div>
          <div className="text-5xl md:text-7xl font-bold text-primary mb-3 md:mb-4">156 units</div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
            <span className="flex items-center gap-1">
              <TrendingUp size={16} />
              Range: 140 - 172 units
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Confidence: ±10%</span>
          </div>
          <Badge className="text-sm md:text-lg px-3 md:px-4 py-1 md:py-2 bg-success">High Confidence</Badge>
        </div>

        <div className="p-3 md:p-6 bg-background/50 rounded-lg">
          <div className="flex gap-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              💡
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Recommendation:</p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Order <span className="font-bold text-foreground">165 units</span> to account for uncertainty.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Charts - Desktop: Always visible, Mobile: Collapsible */}
      <div className="hidden md:block space-y-6">
        <TrendChartContent data={historicalTrend} />
        <ErrorChartContent data={errorDistribution} />
      </div>

      {/* Mobile Chart Toggles */}
      <div className="md:hidden space-y-3">
        <Collapsible open={showTrendChart} onOpenChange={setShowTrendChart}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-between gap-2 h-12">
              <div className="flex items-center gap-2">
                <LineChartIcon size={18} className="text-primary" />
                <span className="font-medium">Sales Trend Analysis</span>
              </div>
              {showTrendChart ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <TrendChartContent data={historicalTrend} />
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={showErrorChart} onOpenChange={setShowErrorChart}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full flex items-center justify-between gap-2 h-12">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-secondary" />
                <span className="font-medium">Error Distribution</span>
              </div>
              {showErrorChart ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <ErrorChartContent data={errorDistribution} />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Feature Importance */}
      <Card className="p-4 md:p-6">
        <div className="flex items-start gap-2 mb-3 md:mb-4">
          <Info size={18} className="text-primary mt-0.5" />
          <div>
            <h2 className="text-lg md:text-xl font-bold">Factors Affecting Prediction</h2>
            <p className="text-xs text-muted-foreground">Key influences on the forecast</p>
          </div>
        </div>
        <div className="space-y-3 md:space-y-4">
          {featureImportance.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs md:text-sm font-medium">{item.factor}</span>
                <span className="text-xs md:text-sm font-bold">{item.importance}%</span>
              </div>
              <Progress value={item.importance} className="h-2 md:h-3" />
            </div>
          ))}
        </div>
      </Card>

      {/* Comparative Analysis */}
      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Similar Events Comparison</h2>
        
        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {comparativeData.map((row, index) => (
            <div key={index} className="p-3 bg-muted rounded-lg">
              <p className="font-medium text-sm mb-2">{row.event}</p>
              <div className="flex justify-between text-xs">
                <span>Actual: {row.actual}</span>
                <span>Predicted: {row.predicted}</span>
                <Badge variant="outline" className="bg-success/10 text-xs">{row.accuracy}</Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
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
                    <Badge variant="outline" className="bg-success/10">{row.accuracy} ✓</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-3 md:mt-4 p-3 md:p-4 bg-muted rounded-lg text-center">
          <span className="text-sm font-semibold">Average Accuracy: </span>
          <span className="text-xl md:text-2xl font-bold text-success">94.2%</span>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        <Button variant="outline" className="gap-1.5 text-xs md:text-sm">
          <Download size={16} />
          <span className="hidden sm:inline">Export</span> PDF
        </Button>
        <Button variant="outline" className="gap-1.5 text-xs md:text-sm">
          <FileText size={16} />
          <span className="hidden sm:inline">Export</span> CSV
        </Button>
        <Button variant="outline" className="gap-1.5 text-xs md:text-sm">
          <Activity size={16} />
          <span className="hidden sm:inline">Create</span> Order
        </Button>
        <Button variant="outline" className="gap-1.5 text-xs md:text-sm">
          <RefreshCw size={16} />
          Retrain
        </Button>
      </div>
    </div>
  );
};

export default Forecasting;
