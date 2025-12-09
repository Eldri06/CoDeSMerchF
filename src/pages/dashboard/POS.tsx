import { useEffect, useMemo, useState } from "react";
import { Search, Filter, ShoppingCart, Package, X, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { productService, Product } from "@/services/productService";
import { transactionService } from "@/services/transactionService";
import { useEventContext } from "@/context/EventContext";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authService } from "@/services/authService";
import codesLogo from "@/assets/codes-logo.png";
import { database } from "@/config/firebase";
import { onValue, ref } from "firebase/database";

interface CartItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  sku?: string;
}

interface ReceiptTxnItem { name: string; quantity: number; price: number }
interface ReceiptTxn {
  id?: string;
  items: ReceiptTxnItem[];
  subtotal: number;
  total: number;
  eventName: string;
  createdAt: string;
  paymentMethod: string;
  cashier: string;
}

const CartContent = ({
  cartItems,
  subtotal,
  total,
  discount,
  setDiscount,
  paymentMethod,
  setPaymentMethod,
  updateQuantity,
  removeFromCart,
  checkout,
}: {
  cartItems: CartItem[];
  subtotal: number;
  total: number;
  discount: number;
  setDiscount: (n: number) => void;
  paymentMethod: string;
  setPaymentMethod: (v: string) => void;
  updateQuantity: (id: string, change: number) => void;
  removeFromCart: (id: string) => void;
  checkout: () => Promise<void> | void;
}) => (
  <>
    <div className="flex-1 overflow-y-auto space-y-3 mb-4">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <ShoppingCart size={48} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-medium">Your cart is empty</p>
          <p className="text-sm text-muted-foreground">Select products to start a sale</p>
        </div>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className="flex gap-3 p-3 bg-muted rounded-lg">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-background rounded flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">₱{item.price} each</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 w-6 p-0"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  -
                </Button>
                <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 w-6 p-0"
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
              className="h-6 w-6 p-0"
              onClick={() => removeFromCart(item.id)}
            >
              <X size={14} />
            </Button>
          </div>
        ))
      )}
    </div>

    <div className="space-y-3 pt-4 border-t">
      <div className="space-y-2 bg-muted p-3 md:p-4 rounded-lg">
        <div className="flex justify-between text-sm">
          <span>Items ({cartItems.length})</span>
          <span>₱{subtotal.toFixed(2)}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 items-center text-sm">
          <span>Discount</span>
          <Input
            type="number"
            min={0}
            step={0.01}
            value={discount}
            onChange={(e) => {
              const val = Number(e.target.value || 0);
              const clamped = Math.max(0, Math.min(val, subtotal));
              setDiscount(Number.isFinite(clamped) ? clamped : 0);
            }}
            className="h-8 text-right"
          />
        </div>
        <div className="h-px bg-border my-2" />
        <div className="flex justify-between text-base md:text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">₱{total.toFixed(2)}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <span className="text-xs text-muted-foreground">Payment</span>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="mt-1 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="gcash">GCash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-muted-foreground flex items-end justify-end">
            <span>Cashier: {authService.getCurrentUser()?.fullName || ""}</span>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full"
        disabled={cartItems.length === 0}
        onClick={checkout}
      >
        Checkout <span className="ml-2">→</span>
      </Button>
    </div>
  </>
);

const POS = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { currentEventId, currentEventName } = useEventContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastTxn, setLastTxn] = useState<ReceiptTxn | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [discount, setDiscount] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categoryOptions = ["All", "T-Shirt", "Shirts", "Lanyards", "Keychains", "Others"];

  useEffect(() => {
    const r = ref(database, "products");
    const unsub = onValue(r, (snap) => {
      const obj = snap.exists() ? (snap.val() as Record<string, Product>) : {};
      const list: Product[] = Object.entries(obj).map(([id, p]) => ({ ...(p as Product), id }));
      setProducts(list);
    });
    return () => unsub();
  }, []);

  const displayedProducts = useMemo(() => {
    const norm = (v: string | null | undefined) => String(v || "").trim().toLowerCase();
    const cand = [norm(currentEventId), norm(currentEventName)];
    let list = [...products];
    if (currentEventId) {
      const idOrNameMatches = (p: Product) => {
        if ((p.eventId ?? null) && cand.includes(norm(p.eventId as string))) return true;
        const keys = Object.keys(p.stockByEvent || {});
        return keys.some((k) => cand.includes(norm(k)));
      };
      list = list.filter(idOrNameMatches);
    }
    if (selectedCategory !== "All") {
      const cat = selectedCategory.toLowerCase();
      list = list.filter((p) => String(p.category || "").toLowerCase().includes(cat));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || String(p.category || "").toLowerCase().includes(q));
    }
    if (currentEventId) {
      return list.map((p) => {
        const keys = Object.keys(p.stockByEvent || {});
        const matchKey = keys.find((k) => cand.includes(norm(k)));
        if (matchKey) {
          return { ...p, stock: Number(p.stockByEvent?.[matchKey] ?? 0) } as Product;
        }
        if ((p.eventId ?? null) && cand.includes(norm(p.eventId as string))) {
          return { ...p, stock: Number(p.stock ?? 0) } as Product;
        }
        return { ...p, stock: 0 } as Product;
      });
    }
    return list;
  }, [products, currentEventId, currentEventName, searchQuery, selectedCategory]);

  const addToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === (product.id as string));
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === (product.id as string) ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id as string,
          name: product.name,
          price: product.price,
          stock: Number(product.stock ?? 0),
          quantity: 1,
          sku: product.sku,
        },
      ]);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, Math.min(item.stock, item.quantity + change));
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discount);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const checkout = async () => {
    if (cartItems.length === 0) return;
    const items = cartItems.map((it) => ({
      productId: String(it.id),
      name: it.name,
      price: it.price,
      quantity: it.quantity,
      sku: it.sku,
    }));
    const user = authService.getCurrentUser();
    const res = await transactionService.create({
      eventId: currentEventId ?? null,
      items,
      subtotal,
      total,
      paymentMethod,
      cashier: user?.fullName || "",
    });
    if (res.success) {
      setLastTxn({ id: res.id, items, subtotal, total, eventName: currentEventName, createdAt: new Date().toLocaleString(), paymentMethod, cashier: user?.fullName || "" });
      setIsReceiptOpen(true);
      setCartItems([]);
      setIsCartOpen(false);
      setDiscount(0);
    }
  };

  

  return (
    <div className="flex flex-col md:flex-row h-full gap-4 md:gap-6">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col gap-3 md:gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search products..."
              className="pl-10 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="flex-shrink-0">
            <Filter size={18} />
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {categoryOptions.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              size="sm"
              className="whitespace-nowrap text-xs md:text-sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 overflow-y-auto pb-20 md:pb-0">
          {displayedProducts.map((product) => (
            <Card
              key={product.id}
              className="p-3 md:p-4 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 active:scale-95"
              onClick={() => addToCart(product)}
            >
              <div className="aspect-square bg-muted rounded-lg mb-2 md:mb-3 flex items-center justify-center">
                <Package size={32} className="text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1 text-xs md:text-sm truncate">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm md:text-lg font-bold text-primary">₱{product.price}</span>
                <Badge variant={product.stock > 20 ? "default" : product.stock > 5 ? "secondary" : "destructive"} className="text-[10px] md:text-xs">{product.stock}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Mobile Cart Floating Button & Sheet */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="w-full shadow-xl relative">
              <ShoppingCart size={20} className="mr-2" />
              View Cart
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center">
                  {totalItems}
                </Badge>
              )}
              <span className="ml-auto font-bold">₱{total.toFixed(2)}</span>
              <ChevronUp size={20} className="ml-2" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] flex flex-col">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                Current Sale
                <Badge>{currentEventName}</Badge>
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 flex flex-col overflow-hidden mt-4">
              <CartContent
                cartItems={cartItems}
                subtotal={subtotal}
                total={total}
                discount={discount}
                setDiscount={setDiscount}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                checkout={checkout}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Cart Sidebar */}
      <Card className="hidden md:flex w-[350px] lg:w-[400px] p-4 lg:p-6 flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg lg:text-xl font-bold">Current Sale</h2>
          <Badge>{currentEventName}</Badge>
        </div>
        <CartContent
          cartItems={cartItems}
          subtotal={subtotal}
          total={total}
          discount={discount}
          setDiscount={setDiscount}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          checkout={checkout}
        />
      </Card>

      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Receipt</DialogTitle>
          </DialogHeader>
          {lastTxn ? (
            <div className="print-area space-y-3">
              <div className="flex items-center gap-3 pb-2 border-b">
                <img src={codesLogo} alt="CoDeS" className="w-10 h-10" />
                <div>
                  <p className="font-bold text-sm">CoDeSMerch</p>
                  <p className="text-xs text-muted-foreground">UM Tagum College</p>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex justify-between"><span>Event</span><span>{lastTxn.eventName}</span></div>
                <div className="flex justify-between"><span>Transaction</span><span>{lastTxn.id || "(unsynced)"}</span></div>
                <div className="flex justify-between"><span>Date</span><span>{lastTxn.createdAt}</span></div>
                <div className="flex justify-between"><span>Payment</span><span>{String(lastTxn.paymentMethod).toUpperCase()}</span></div>
                <div className="flex justify-between"><span>Cashier</span><span>{lastTxn.cashier || ""}</span></div>
              </div>
              <div className="border-t pt-2 space-y-1">
                {lastTxn.items.map((it: { name: string; quantity: number; price: number }, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="truncate">{it.name} × {it.quantity}</span>
                    <span>₱{(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>₱{lastTxn.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold"><span>Total</span><span>₱{lastTxn.total.toFixed(2)}</span></div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReceiptOpen(false)}>Close</Button>
            <Button onClick={() => window.print()}>Print</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default POS;
