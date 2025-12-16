import { Calendar, Plus, MapPin, Users, DollarSign, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { eventService, EventItem } from "@/services/eventService";
import { productService } from "@/services/productService";
import { transactionService, Transaction, TransactionItem } from "@/services/transactionService";
import { useEventContext } from "@/context/EventContext";
import { toast } from "sonner";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from "recharts";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { authService } from "@/services/authService";

const Events = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<EventItem["status"]>("Upcoming");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsTxns, setDetailsTxns] = useState<Transaction[]>([]);
  const [detailsProducts, setDetailsProducts] = useState<EventItem[]>([]);
  const { refreshEvents, setEvent } = useEventContext();
  const currentUser = authService.getCurrentUser();
  const roleLabel = String(currentUser?.role || currentUser?.systemRole || "member").toLowerCase();
  const isMember = roleLabel === "member";
  const canManage = !isMember;

  useEffect(() => {
    const r = ref(database, "events");
    const unsub = onValue(r, (snap) => {
      const obj = snap.exists() ? (snap.val() as Record<string, EventItem>) : {};
      const list = Object.entries(obj).map(([id, e]) => ({ ...e, id }));
      setEvents(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const createEvent = async () => {
    if (!canManage) return;
    if (!name.trim()) {
      toast.error("Event name is required");
      return;
    }
    const res = await eventService.createEvent({ name: name.trim(), status, startDate, endDate });
    if (res.success) {
      toast.success("Event created");
      setIsCreateOpen(false);
      setName("");
      setStartDate("");
      setEndDate("");
      await refreshEvents();
      if (res.id) setEvent(res.id);
    } else {
      toast.error("Failed to create event");
    }
  };

  const openEdit = (ev: EventItem) => {
    setEditId(ev.id || null);
    setName(ev.name);
    setStatus(ev.status);
    setStartDate(ev.startDate || "");
    setEndDate(ev.endDate || "");
    setIsCreateOpen(true);
  };

  const saveEdit = async () => {
    if (!canManage) return;
    if (!editId) return;
    const res = await eventService.updateEvent(editId, { name, status, startDate, endDate });
    if (res.success) {
      toast.success("Event updated");
      setIsCreateOpen(false);
      setEditId(null);
      await refreshEvents();
    } else {
      toast.error("Failed to update event");
    }
  };

  const removeEvent = async (id: string) => {
    if (!canManage) return;
    const res = await eventService.deleteEvent(id);
    if (res.success) {
      toast.success("Event deleted");
      await refreshEvents();
    } else {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Events</h1>
          <p className="text-muted-foreground">Manage CoDeS merchandise events</p>
        </div>
        {canManage && (
          <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
            <Plus size={20} />
            Create Event
          </Button>
        )}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4">All Events</h2>
        {loading ? (
          <div className="p-6 text-center text-muted-foreground">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">No events yet. Click "Create Event" to add one.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event) => (
              <Card key={event.id} className="p-6 border-l-4 border-l-primary">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{event.name}</h3>
                    <p className="text-sm text-muted-foreground">{event.startDate || ""} {event.endDate ? `– ${event.endDate}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary">{event.status}</Badge>
                    {canManage && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(event)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeEvent(event.id!)}>
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <EventStats eventId={event.id!} />
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-xs text-muted-foreground">Event ID: {event.id}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEvent(event.id!)}>Set Active</Button>
                    <Button variant="default" size="sm" onClick={async () => {
                      setDetailsId(event.id!);
                      setIsDetailsOpen(true);
                      const tx = await transactionService.getTransactionsByEvent(event.id!);
                      setDetailsTxns(tx);
                      const products = await productService.getAllProducts();
                      const p = products.filter((pr) => (pr.eventId ?? null) === event.id);
                      setDetailsProducts(p);
                    }}>View Details</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isCreateOpen && canManage} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="ev-name">Name</Label>
              <Input id="ev-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as EventItem["status"])}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Live">Live</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            {canManage && (
              editId ? (
                <Button onClick={saveEdit}>Save</Button>
              ) : (
                <Button onClick={createEvent}>Create</Button>
              )
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-bold mb-2">Products</h3>
              {detailsProducts.length === 0 ? (
                <div className="text-sm text-muted-foreground">No products for this event.</div>
              ) : (
                <div className="space-y-2">
                  {detailsProducts.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{p.name}</span>
                      <span>{formatCurrency(Number(p.price || 0))} • Stock {p.stock}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
            <Card className="p-4">
              <h3 className="font-bold mb-2">Transactions</h3>
              {detailsTxns.length === 0 ? (
                <div className="text-sm text-muted-foreground">No transactions yet.</div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-auto pr-1">
                  {detailsTxns.map((t) => {
                    const itemQty = (t.items || []).reduce((sum, it) => sum + Number(it.quantity || 0), 0);
                    const shortId = String(t.id || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
                    return (
                      <div key={t.id} className="grid grid-cols-2 gap-2 text-sm">
                        <span className="font-mono truncate">{shortId}</span>
                        <span className="text-right">{formatCurrency(Number(t.total || 0))} • {itemQty} items</span>
                        <span className="truncate text-muted-foreground">{t.customerName || ""}{t.yearLevel ? ` • ${t.yearLevel}` : ""}</span>
                        <span className="text-right text-muted-foreground">{formatDateTime(t.createdAt)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
            <Card className="p-4 md:col-span-2">
              <h3 className="font-bold mb-3">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={detailsTxns.reduce((acc: Array<{ date: string; total: number }>, t) => {
                  const d = (t.createdAt || "").slice(0,10);
                  const found = acc.find((x) => x.date === d);
                  if (found) found.total += (t.total || 0);
                  else acc.push({ date: d, total: t.total || 0 });
                  return acc;
                }, []).sort((a,b) => a.date.localeCompare(b.date))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-4 md:col-span-2">
              <h3 className="font-bold mb-3">Top Products</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={(() => {
                  const counts: Record<string, number> = {};
                  detailsTxns.forEach((t) => (t.items || []).forEach((it: TransactionItem) => {
                    counts[it.name] = (counts[it.name] || 0) + Number(it.quantity || 0);
                  }));
                  return Object.entries(counts).map(([name, qty]) => ({ name, qty })).slice(0, 8);
                })()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="qty" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const EventStats = ({ eventId }: { eventId: string }) => {
  const [stats, setStats] = useState<{ products: number; transactions: number; revenue: number }>(
    { products: 0, transactions: 0, revenue: 0 }
  );

  useEffect(() => {
    (async () => {
      const products = await productService.getAllProducts();
      const pCount = products.filter((p) => (p.eventId ?? null) === eventId).length;
      const txns = await transactionService.getTransactionsByEvent(eventId);
      const revenue = txns.reduce((sum, t) => sum + (t.total || 0), 0);
      setStats({ products: pCount, transactions: txns.length, revenue });
    })();
  }, [eventId]);

  return (
    <div className="space-y-3 mb-4">
      <div className="flex items-center gap-2 text-sm">
        <Calendar size={16} className="text-muted-foreground" />
        <span>Products: {stats.products}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Users size={16} className="text-muted-foreground" />
        <span>Transactions: {stats.transactions}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <DollarSign size={16} className="text-muted-foreground" />
        <span>Revenue: {formatCurrency(Number(stats.revenue || 0))}</span>
      </div>
    </div>
  );
};

export default Events;
import { onValue, ref } from "firebase/database";
import { database } from "@/config/firebase";
