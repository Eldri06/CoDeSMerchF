import { database } from "@/config/firebase";
import { ref, push, set, get } from "firebase/database";
import { productService } from "@/services/productService";

export interface TransactionItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  sku?: string;
}

export interface Transaction {
  id?: string;
  eventId: string | null;
  items: TransactionItem[];
  subtotal: number;
  total: number;
  paymentMethod?: string;
  cashier?: string;
  customerName?: string;
  yearLevel?: "1st Year" | "2nd Year" | "3rd Year" | "4th Year";
  createdAt?: string;
}

export const transactionService = {
  async create(transaction: Omit<Transaction, "id" | "createdAt">): Promise<{ success: boolean; id?: string; message: string }>{
    try {
      const now = new Date().toISOString();
      const newRef = push(ref(database, "transactions"));
      const items = (transaction.items || []).map((it) => ({
        productId: String(it.productId),
        name: it.name,
        price: Number(it.price || 0),
        quantity: Number(it.quantity || 0),
        ...(it.sku ? { sku: it.sku } : {}),
      }));
      const payload: Record<string, unknown> = {
        eventId: transaction.eventId ?? null,
        items,
        subtotal: Number(transaction.subtotal || 0),
        total: Number(transaction.total || 0),
        createdAt: now,
      };
      if (transaction.paymentMethod) payload.paymentMethod = transaction.paymentMethod;
      if (transaction.cashier) payload.cashier = transaction.cashier;
      if (transaction.customerName) payload.customerName = transaction.customerName;
      if (transaction.yearLevel) payload.yearLevel = transaction.yearLevel;
      await set(newRef, payload);
      await Promise.all(
        transaction.items.map(async (it) => {
          if (transaction.eventId) {
            await productService.updateEventStock(it.productId, transaction.eventId, -Number(it.quantity || 0));
          } else {
            const product = await productService.getProductById(it.productId);
            const current = product?.stock ?? 0;
            const next = Math.max(0, current - it.quantity);
            await productService.updateStock(it.productId, next);
          }
          await productService.recordStockMovement(it.productId, { type: "sale", qty: Number(it.quantity || 0), eventId: transaction.eventId, note: "POS checkout" });
        })
      );
      return { success: true, id: newRef.key ?? undefined, message: "Transaction recorded" };
    } catch (e) {
      console.error("Create transaction error", e);
      return { success: false, message: "Failed to record transaction" };
    }
  },
  async getTransactionsByEvent(eventId: string): Promise<Transaction[]> {
    try {
      const snap = await get(ref(database, "transactions"));
      if (!snap.exists()) return [];
      const obj = snap.val() as Record<string, Transaction>;
      return Object.entries(obj)
        .map(([id, t]) => ({ ...t, id }))
        .filter((t) => (t.eventId ?? null) === eventId);
    } catch (e) {
      console.error("Get transactions by event error", e);
      return [];
    }
  },
  async getAllTransactions(): Promise<Transaction[]> {
    try {
      const snap = await get(ref(database, "transactions"));
      if (!snap.exists()) return [];
      const obj = snap.val() as Record<string, Transaction>;
      return Object.entries(obj).map(([id, t]) => ({ ...t, id }));
    } catch (e) {
      console.error("Get all transactions error", e);
      return [];
    }
  },
};
