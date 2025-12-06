// src/services/productService.ts
// Connects to YOUR existing backend at /api/products
// Fixed with better error handling and logging

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface Product {
  id?: string;
  name: string;
  sku: string;
  category: string;
  description?: string;
  price: number;
  cost?: number;
  stock: number;
  reorderLevel?: number;
  maxStock?: number;
  imageUrl?: string;
  status: "Active" | "Inactive" | "Out of Stock";
  createdAt?: string;
  updatedAt?: string;
}

export const productService = {
  // Get all products from backend
  async getAllProducts(): Promise<Product[]> {
    try {
      console.log("🔄 Fetching all products from:", `${API_URL}/products`);
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      
      console.log("✅ Products response:", data);
      
      if (data.success) {
        return data.data || [];
      }
      console.error("❌ Failed to fetch products:", data.error);
      return [];
    } catch (error) {
      console.error("❌ Get all products error:", error);
      return [];
    }
  },

  // Get single product by ID
  async getProductById(productId: string): Promise<Product | null> {
    try {
      console.log("🔄 Fetching product:", productId);
      const response = await fetch(`${API_URL}/products/${productId}`);
      const data = await response.json();
      
      if (data.success) {
        console.log("✅ Product fetched:", data.data);
        return data.data;
      }
      return null;
    } catch (error) {
      console.error("❌ Get product by ID error:", error);
      return null;
    }
  },

  // Create new product
  async createProduct(productData: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<{ success: boolean; message: string; productId?: string }> {
    try {
      console.log("🔄 Creating product:", productData);
      
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();
      console.log("📡 Create response:", data);

      if (data.success) {
        console.log("✅ Product created successfully:", data.id);
        return {
          success: true,
          message: data.message || "Product created successfully",
          productId: data.id,
        };
      } else {
        console.error("❌ Create failed:", data.error);
        return {
          success: false,
          message: data.error || "Failed to create product",
        };
      }
    } catch (error: any) {
      console.error("❌ Create product error:", error);
      return {
        success: false,
        message: error.message || "Failed to create product. Check if backend is running.",
      };
    }
  },

  // Update product
  async updateProduct(productId: string, updates: Partial<Product>): Promise<{ success: boolean; message: string }> {
    try {
      console.log("🔄 Updating product:", productId, updates);
      
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ Product updated successfully");
        return {
          success: true,
          message: data.message || "Product updated successfully",
        };
      } else {
        console.error("❌ Update failed:", data.error);
        return {
          success: false,
          message: data.error || "Failed to update product",
        };
      }
    } catch (error: any) {
      console.error("❌ Update product error:", error);
      return {
        success: false,
        message: error.message || "Failed to update product",
      };
    }
  },

  // Delete product
  async deleteProduct(productId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log("🔄 Deleting product:", productId);
      
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ Product deleted successfully");
        return {
          success: true,
          message: data.message || "Product deleted successfully",
        };
      } else {
        console.error("❌ Delete failed:", data.error);
        return {
          success: false,
          message: data.error || "Failed to delete product",
        };
      }
    } catch (error: any) {
      console.error("❌ Delete product error:", error);
      return {
        success: false,
        message: error.message || "Failed to delete product",
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

      console.log("🔄 Updating stock for:", productId, "New stock:", newStock);

      const response = await fetch(`${API_URL}/products/${productId}/stock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: newStock }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ Stock updated successfully");
        return {
          success: true,
          message: data.message || "Stock updated successfully",
        };
      } else {
        return {
          success: false,
          message: data.error || "Failed to update stock",
        };
      }
    } catch (error: any) {
      console.error("❌ Update stock error:", error);
      return {
        success: false,
        message: error.message || "Failed to update stock",
      };
    }
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products/filter/category/${category}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data || [];
      }
      return [];
    } catch (error) {
      console.error("❌ Get products by category error:", error);
      return [];
    }
  },

  // Get low stock products
  async getLowStockProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products/filter/low-stock`);
      const data = await response.json();
      
      if (data.success) {
        return data.data || [];
      }
      return [];
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