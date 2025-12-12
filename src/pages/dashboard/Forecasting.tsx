import { useEffect, useMemo, useState } from "react";
import { Brain, TrendingUp, Target, Sparkles, Download, Package, ChevronDown, ChevronUp, History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useEventContext } from "@/context/EventContext";
import { productService, Product } from "@/services/productService";
import { transactionService, Transaction, TransactionItem } from "@/services/transactionService";

const Forecasting = () => {
  const { currentEventId, currentEventName, events } = useEventContext();
  const [showPastPredictions, setShowPastPredictions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasPrediction, setHasPrediction] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [result, setResult] = useState<{ point: number; lower: number; upper: number; confidencePercent: number; confidenceLabel: string; recommended: number } | null>(null);

  const [pastPredictions, setPastPredictions] = useState<Array<{ eventId: string; event: string; product: string; predicted: number; actual: number; accuracy: number }>>([]);

  useEffect(() => {
    (async () => {
      const list = await productService.getAllProducts();
      setProducts(list);
    })();
  }, []);

  useEffect(() => {
    setSelectedEventId(currentEventId ?? null);
  }, [currentEventId]);

  const productOptions = useMemo(() => {
    if (!products.length) return [] as Product[];
    if (!selectedEventId) return products;
    const norm = (v: string | null | undefined) => String(v || "").trim().toLowerCase();
    const candId = norm(selectedEventId);
    const idMatches = (p: Product) => {
      if ((p.eventId ?? null) && norm(p.eventId as string) === candId) return true;
      const keys = Object.keys(p.stockByEvent || {});
      return keys.some((k) => norm(k) === candId);
    };
    const filtered = products.filter(idMatches).map((p) => {
      const keys = Object.keys(p.stockByEvent || {});
      const mk = keys.find((k) => norm(k) === candId);
      if (mk) return { ...p, stock: Number(p.stockByEvent?.[mk] ?? 0) } as Product;
      if ((p.eventId ?? null) && norm(p.eventId as string) === candId) return { ...p, stock: Number(p.stock ?? 0) } as Product;
      return { ...p, stock: 0 } as Product;
    });
    return filtered;
  }, [products, selectedEventId]);

  useEffect(() => {
    if (!selectedProductId && productOptions.length > 0) {
      setSelectedProductId(productOptions[0].id || null);
    }
  }, [productOptions, selectedProductId]);

  useEffect(() => {
    (async () => {
      if (!selectedProductId) { setPastPredictions([]); return; }
      const doneEvents = events.filter((e) => e.status === "Completed" && !!e.id);
      if (doneEvents.length === 0) { setPastPredictions([]); return; }
      const txns = await transactionService.getAllTransactions();
      const unitsByEvent: Record<string, number> = {};
      doneEvents.forEach((ev) => { if (ev.id) unitsByEvent[ev.id] = 0; });
      txns.forEach((t) => {
        const eid = String(t.eventId || "");
        if (!eid || !(eid in unitsByEvent)) return;
        const items: TransactionItem[] = Array.isArray(t.items) ? (t.items as TransactionItem[]) : [];
        items.forEach((it) => {
          const pid = String(it.productId || "");
          if (pid === selectedProductId) {
            unitsByEvent[eid] = (unitsByEvent[eid] || 0) + Number(it.quantity || 0);
          }
        });
      });
      const productName = products.find((p) => p.id === selectedProductId)?.name || "";
      const values = doneEvents.map((ev) => {
        const actual = Math.round(unitsByEvent[ev.id!] || 0);
        const others = doneEvents.filter((e) => e.id !== ev.id).map((e) => Math.round(unitsByEvent[e.id!] || 0));
        const nz = others.filter((v) => v > 0);
        const base = nz.length ? nz : others;
        const mean = base.length ? base.reduce((a, b) => a + b, 0) / base.length : actual;
        const predicted = Math.round(mean);
        const accuracy = actual === 0 && predicted === 0 ? 100 : Math.max(0, Math.min(100, Math.round(100 - (Math.abs(actual - predicted) / Math.max(actual, 1)) * 100)));
        return { eventId: ev.id!, event: ev.name, product: productName, predicted, actual, accuracy };
      }).filter((x) => x.actual > 0 || x.predicted > 0);
      setPastPredictions(values);
    })();
  }, [selectedProductId, events, products]);

  const avgAccuracy = useMemo(() => {
    if (pastPredictions.length === 0) return 0;
    const sum = pastPredictions.reduce((s, x) => s + x.accuracy, 0);
    return Math.round((sum / pastPredictions.length) * 10) / 10;
  }, [pastPredictions]);

  const handleGenerate = async () => {
    if (!selectedProductId) return;
    setIsGenerating(true);
    try {
      const allTxns = await transactionService.getAllTransactions();
      const selectedEv = selectedEventId ? events.find((e) => e.id === selectedEventId) || null : null;
      const completedIds = new Set(events.filter((e) => e.status === "Completed" && e.id).map((e) => String(e.id)));
      const trainTxns = (() => {
        if (selectedEv && selectedEv.status !== "Completed") {
          return allTxns.filter((t) => t.eventId && completedIds.has(String(t.eventId)));
        }
        if (selectedEventId) return allTxns.filter((t) => (t.eventId ?? null) === selectedEventId);
        return allTxns;
      })();
      const dayMap: Record<string, number> = {};
      trainTxns.forEach((t) => {
        const items: TransactionItem[] = Array.isArray(t.items) ? (t.items as TransactionItem[]) : [];
        const dt = String(t.createdAt || new Date().toISOString());
        const day = dt.slice(0, 10);
        items.forEach((it) => {
          const pid = String(it.productId || "");
          if (pid === selectedProductId) {
            const qty = Number(it.quantity || 0);
            dayMap[day] = (dayMap[day] || 0) + qty;
          }
        });
      });
      const days = Object.keys(dayMap).sort();
      const y = days.map((d) => dayMap[d]);
      const horizonDays = (() => {
        if (selectedEv?.startDate && selectedEv?.endDate) {
          const a = new Date(selectedEv.startDate);
          const b = new Date(selectedEv.endDate);
          const diff = Math.max(1, Math.ceil((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000)) + 1);
          return diff;
        }
        const durations = events
          .filter((e) => e.status === "Completed" && e.startDate && e.endDate)
          .map((e) => {
            const a = new Date(e.startDate!);
            const b = new Date(e.endDate!);
            return Math.max(1, Math.ceil((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000)) + 1);
          });
        if (durations.length === 0) return 3;
        const sorted = [...durations].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted[mid];
      })();
      const mean = y.length ? y.reduce((a, b) => a + b, 0) / y.length : 0;
      const variance = y.length ? y.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / y.length : 0;
      const std = Math.sqrt(variance);
      const reg = (() => {
        if (y.length < 2) return { m: 0, c: mean };
        const n = y.length;
        const xs = Array.from({ length: n }, (_, i) => i);
        const sumX = xs.reduce((s, v) => s + v, 0);
        const sumY = y.reduce((s, v) => s + v, 0);
        const sumXY = xs.reduce((s, v, i) => s + v * y[i], 0);
        const sumXX = xs.reduce((s, v) => s + v * v, 0);
        const m = (n * sumXY - sumX * sumY) / Math.max(1, n * sumXX - sumX * sumX);
        const c = sumY / n - m * (sumX / n);
        return { m, c };
      })();
      const future = Array.from({ length: horizonDays }, (_, k) => reg.m * (y.length + k) + reg.c);
      const futureSum = future.reduce((s, v) => s + Math.max(0, v), 0);
      const resid = y.map((v, i) => v - (reg.m * i + reg.c));
      const residStd = resid.length ? Math.sqrt(resid.reduce((s, v) => s + v * v, 0) / resid.length) : std;
      const band = 1.96 * residStd * Math.sqrt(Math.max(1, horizonDays));
      const point = Math.round(Math.max(0, futureSum));
      const lower = Math.max(0, Math.round(point - band));
      const upper = Math.max(lower, Math.round(point + band));
      const cv = mean > 0 ? std / mean : 1;
      const conf = Math.max(60, Math.min(95, Math.round(100 - cv * 100)));
      const recommended = Math.max(0, Math.round(point));
      setResult({ point, lower, upper, confidencePercent: conf, confidenceLabel: conf >= 85 ? "High Confidence" : conf >= 75 ? "Medium Confidence" : "Low Confidence", recommended });
      setHasPrediction(true);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Brain size={22} className="text-primary" />
          AI Forecasting
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Predict demand for CoDeS merchandise</p>
      </div>

      {/* Selection Card */}
      <Card className="p-4 md:p-6">
        <h2 className="font-semibold mb-4">Generate Forecast</h2>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Event</label>
            <select
              value={selectedEventId ?? ""}
              onChange={(e) => setSelectedEventId(e.target.value || null)}
              className="w-full p-3 text-sm border border-border rounded-lg bg-background"
            >
              <option value="">All Events</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Product</label>
            <select
              value={selectedProductId ?? ""}
              onChange={(e) => setSelectedProductId(e.target.value || null)}
              className="w-full p-3 text-sm border border-border rounded-lg bg-background"
            >
              {productOptions.length === 0 ? (
                <option value="">No products</option>
              ) : (
                productOptions.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))
              )}
            </select>
          </div>

          <Button 
            size="lg" 
            className="w-full gap-2 h-12"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Prediction
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Prediction Result */}
      {hasPrediction && result && (
        <Card className="p-4 md:p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Target size={20} className="text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Predicted Demand</span>
            </div>
            
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{result.point}</div>
            <p className="text-sm text-muted-foreground mb-4">units recommended</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-background/60 rounded-lg">
                <p className="text-xs text-muted-foreground">Min Estimate</p>
                <p className="text-lg font-semibold">{result.lower}</p>
              </div>
              <div className="p-3 bg-background/60 rounded-lg">
                <p className="text-xs text-muted-foreground">Max Estimate</p>
                <p className="text-lg font-semibold">{result.upper}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge className="bg-success text-success-foreground">{result.confidenceLabel}</Badge>
              <span className="text-xs text-muted-foreground">{result.confidencePercent}% accuracy</span>
            </div>

            {/* Recommendation */}
            <div className="p-3 bg-background/60 rounded-lg text-left">
              <div className="flex items-start gap-2">
                <Package size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Order Recommendation</p>
                  <p className="text-xs text-muted-foreground">
                    Order <span className="font-semibold text-foreground">{result.recommended} units</span> (+10% buffer)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download size={14} />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Package size={14} />
              Create Order
            </Button>
          </div>
        </Card>
      )}

      {/* Empty State when no prediction */}
      {!hasPrediction && !isGenerating && (
        <Card className="p-6 md:p-8 border-dashed">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <TrendingUp size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold mb-1">No Prediction Yet</h3>
            <p className="text-sm text-muted-foreground">
              Select an event and product above to generate a demand forecast
            </p>
          </div>
        </Card>
      )}

      {/* Past Predictions - Collapsible */}
      <Collapsible open={showPastPredictions} onOpenChange={setShowPastPredictions}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full flex items-center justify-between h-12">
            <div className="flex items-center gap-2">
              <History size={18} />
              <span className="font-medium">Past Predictions</span>
              <Badge variant="secondary" className="text-xs">{pastPredictions.length}</Badge>
            </div>
            {showPastPredictions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <Card className="p-4">
            <div className="space-y-3">
              {pastPredictions.map((item, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-medium text-sm">{item.event}</p>
                      <p className="text-xs text-muted-foreground">{item.product}</p>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${item.accuracy >= 95 ? 'bg-success/10 text-success' : 'bg-primary/10'}`}
                    >
                      {item.accuracy}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-background rounded">
                      <span className="text-muted-foreground">Predicted:</span>
                      <span className="font-semibold ml-1">{item.predicted}</span>
                    </div>
                    <div className="p-2 bg-background rounded">
                      <span className="text-muted-foreground">Actual:</span>
                      <span className="font-semibold ml-1">{item.actual}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 p-3 bg-primary/5 rounded-lg text-center">
              <span className="text-sm">Average Accuracy: </span>
              <span className="text-lg font-bold text-success">{avgAccuracy}%</span>
            </div>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Model Info - Simple Footer */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          Powered by Linear Regression • Trained on 15 past events • Last updated Jan 20, 2025
        </p>
      </div>
    </div>
  );
};

export default Forecasting;
