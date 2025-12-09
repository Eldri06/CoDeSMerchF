import { database } from "@/config/firebase";
import { ref, get, push, set, update, remove, runTransaction } from "firebase/database";
const API_URL = import.meta.env.VITE_API_URL || "";

export interface Product {
  id?: string;
  name: string;
  sku: string;
  category: string;
  description?: string;
  price: number;
  cost?: number;
  stock: number;
  stockByEvent?: Record<string, number>;
  reorderLevel?: number;
  maxStock?: number;
  imageUrl?: string;
  eventId?: string | null;
  status: "Active" | "Inactive" | "Out of Stock";
  createdAt?: string;
  updatedAt?: string;
}

export const productService = {
  // Get all products from backend
  async getAllProducts(): Promise<Product[]> {
    try {
      const snapshot = await get(ref(database, "products"));
      if (!snapshot.exists()) {
        return [];
      }

      const obj = snapshot.val() as Record<string, Product>;
      const list: Product[] = Object.entries(obj).map(([id, p]) => ({ ...p, id }));
      return list;
    } catch (error) {
      console.error("❌ Get all products error:", error);
      return [];
    }
  },

  // Get single product by ID
  async getProductById(productId: string): Promise<Product | null> {
    try {
      const snapshot = await get(ref(database, `products/${productId}`));
      if (!snapshot.exists()) {
        return null;
      }
      const product = snapshot.val() as Product;
      return { ...product, id: productId };
    } catch (error) {
      console.error("❌ Get product by ID error:", error);
      return null;
    }
  },

  // Create new product
  async createProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<{ success: boolean; message: string; productId?: string }> {
    try {
      const now = new Date().toISOString();
      const newRef = push(ref(database, "products"));
      const stockByEventInit = (productData.eventId ?? null)
        ? { [productData.eventId as string]: Number(productData.stock || 0) }
        : undefined;
      const payload: Omit<Product, "id"> & { createdAt: string; updatedAt: string } = {
        ...productData,
        createdAt: now,
        updatedAt: now,
      };
      if (stockByEventInit || productData.stockByEvent) {
        payload.stockByEvent = { ...(productData.stockByEvent || {}), ...(stockByEventInit || {}) };
      }
      await set(newRef, payload);
      const newId = newRef.key || undefined;
      return {
        success: true,
        message: "Product created successfully",
        productId: newId,
      };
    } catch (error: unknown) {
      console.error("❌ Create product error:", error);
      return {
        success: false,
        message: (error as Error)?.message || "Failed to create product",
      };
    }
  },

  // Update product
  async updateProduct(productId: string, updates: Partial<Product>): Promise<{ success: boolean; message: string }> {
    try {
      await update(ref(database, `products/${productId}`), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      return {
        success: true,
        message: "Product updated successfully",
      };
    } catch (error: unknown) {
      console.error("❌ Update product error:", error);
      return {
        success: false,
        message: (error as Error)?.message || "Failed to update product",
      };
    }
  },

  // Delete product
  async deleteProduct(productId: string): Promise<{ success: boolean; message: string }> {
    try {
      await remove(ref(database, `products/${productId}`));
      return {
        success: true,
        message: "Product deleted successfully",
      };
    } catch (error: unknown) {
      console.error("❌ Delete product error:", error);
      return {
        success: false,
        message: (error as Error)?.message || "Failed to delete product",
      };
    }
  },

  // Update stock only
  async updateStock(productId: string, newStock: number): Promise<{ success: boolean; message: string }> {
    try {
      if (newStock < 0) {
        return {
          success: false,
          message: "Stock cannot be negative",
        };
      }
      await update(ref(database, `products/${productId}`), {
        stock: newStock,
        updatedAt: new Date().toISOString(),
      });
      return {
        success: true,
        message: "Stock updated successfully",
      };
    } catch (error: unknown) {
      console.error("❌ Update stock error:", error);
      return {
        success: false,
        message: (error as Error)?.message || "Failed to update stock",
      };
    }
  },

  async updateEventStock(productId: string, eventId: string, delta: number): Promise<{ success: boolean; message: string; newStock?: number }> {
    try {
      const productSnap = await get(ref(database, `products/${productId}`));
      const product = productSnap.exists() ? (productSnap.val() as Product) : null;
      const currentEventVal = product?.stockByEvent?.[eventId];
      const eventBound = (product?.eventId ?? null) === eventId;
      const fallbackBase = currentEventVal !== undefined ? Number(currentEventVal || 0) : eventBound ? Number(product?.stock || 0) : 0;

      const path = `products/${productId}/stockByEvent/${eventId}`;
      const node = ref(database, path);
      const res = await runTransaction(node, (current) => {
        const base = current == null ? fallbackBase : Number(current || 0);
        const next = Math.max(0, base + delta);
        return next;
      });
      const newVal = Number(res.snapshot.val() || 0);
      // Recompute global stock as the sum of all event stocks
      const byEventSnap = await get(ref(database, `products/${productId}/stockByEvent`));
      const byEvent = byEventSnap.exists() ? (byEventSnap.val() as Record<string, number>) : {};
      const total = Object.values(byEvent).reduce((sum, v) => sum + Number(v || 0), 0);
      await update(ref(database, `products/${productId}`), { stock: total, updatedAt: new Date().toISOString() });
      return { success: true, message: "Event stock updated", newStock: newVal };
    } catch (error: unknown) {
      console.error("❌ Update event stock error:", error);
      return { success: false, message: (error as Error)?.message || "Failed to update event stock" };
    }
  },

  async recordStockMovement(productId: string, movement: { type: string; qty: number; eventId?: string | null; userId?: string; note?: string; timestamp?: string }): Promise<{ success: boolean; id?: string; message: string }> {
    try {
      const now = new Date().toISOString();
      const newRef = push(ref(database, `stockMovements/${productId}`));
      await set(newRef, { ...movement, timestamp: movement.timestamp || now });
      return { success: true, id: newRef.key ?? undefined, message: "Stock movement recorded" };
    } catch (error: unknown) {
      console.error("❌ Record stock movement error:", error);
      return { success: false, message: (error as Error)?.message || "Failed to record stock movement" };
    }
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const snapshot = await get(ref(database, "products"));
      if (!snapshot.exists()) {
        return [];
      }
      const obj = snapshot.val() as Record<string, Product>;
      return Object.entries(obj)
        .filter(([, p]) => p.category === category)
        .map(([id, p]) => ({ ...p, id }));
    } catch (error) {
      console.error("❌ Get products by category error:", error);
      return [];
    }
  },

  // Get low stock products
  async getLowStockProducts(): Promise<Product[]> {
    try {
      const snapshot = await get(ref(database, "products"));
      if (!snapshot.exists()) {
        return [];
      }
      const obj = snapshot.val() as Record<string, Product>;
      return Object.entries(obj)
        .map(([id, p]) => ({ ...p, id }))
        .filter((p) => (p.stock ?? 0) <= (p.reorderLevel ?? 10));
    } catch (error) {
      console.error("❌ Get low stock products error:", error);
      return [];
    }
  },

  // Search products
  async searchProducts(searchQuery: string): Promise<Product[]> {
    try {
      const products = await this.getAllProducts();
      const query = searchQuery.toLowerCase();

      return products.filter((product) => 
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    } catch (error) {
      console.error("❌ Search products error:", error);
      return [];
    }
  },
};
