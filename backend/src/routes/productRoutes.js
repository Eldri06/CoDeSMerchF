// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// Test route
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Product routes working!' });
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.ref('products').once('value');
    const products = [];
    
    snapshot.forEach(childSnapshot => {
      products.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    console.log(`✅ Retrieved ${products.length} products`);
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('❌ Error getting products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a product
router.post('/', async (req, res) => {
  try {
    const productData = req.body;
    
    // Validate required fields
    if (!productData.name || !productData.sku || !productData.price) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, SKU, and price are required' 
      });
    }

    // Check if SKU already exists
    const existingProducts = await db.ref('products')
      .orderByChild('sku')
      .equalTo(productData.sku)
      .once('value');
    
    if (existingProducts.exists()) {
      return res.status(400).json({ 
        success: false, 
        error: 'SKU already exists. Please use a unique SKU.' 
      });
    }

    const newProductRef = db.ref('products').push();
    
    const product = {
      ...productData,
      id: newProductRef.key,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await newProductRef.set(product);
    
    console.log(`✅ Product created: ${productData.name} (${newProductRef.key})`);
    
    res.json({ 
      success: true, 
      id: newProductRef.key, 
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const snapshot = await db.ref(`products/${req.params.id}`).once('value');
    
    if (!snapshot.exists()) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: { 
        id: snapshot.key, 
        ...snapshot.val() 
      } 
    });
  } catch (error) {
    console.error('❌ Error getting product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;
    
    // Check if product exists
    const snapshot = await db.ref(`products/${productId}`).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }

    // If updating SKU, check if new SKU already exists
    if (updates.sku) {
      const existingProducts = await db.ref('products')
        .orderByChild('sku')
        .equalTo(updates.sku)
        .once('value');
      
      let skuExists = false;
      existingProducts.forEach(child => {
        if (child.key !== productId) {
          skuExists = true;
        }
      });

      if (skuExists) {
        return res.status(400).json({ 
          success: false, 
          error: 'SKU already exists. Please use a unique SKU.' 
        });
      }
    }

    await db.ref(`products/${productId}`).update({
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    console.log(`✅ Product updated: ${productId}`);
    
    res.json({ 
      success: true, 
      message: 'Product updated successfully' 
    });
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Check if product exists
    const snapshot = await db.ref(`products/${productId}`).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }

    await db.ref(`products/${productId}`).remove();
    
    console.log(`✅ Product deleted: ${productId}`);
    
    res.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update stock only
router.patch('/:id/stock', async (req, res) => {
  try {
    const productId = req.params.id;
    const { stock } = req.body;

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid stock quantity required' 
      });
    }

    // Check if product exists
    const snapshot = await db.ref(`products/${productId}`).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({ 
        success: false, 
        error: 'Product not found' 
      });
    }

    const status = stock === 0 ? 'Out of Stock' : 'Active';

    await db.ref(`products/${productId}`).update({
      stock,
      status,
      updatedAt: new Date().toISOString()
    });

    console.log(`✅ Stock updated for product: ${productId} - New stock: ${stock}`);

    res.json({ 
      success: true, 
      message: 'Stock updated successfully',
      stock,
      status
    });
  } catch (error) {
    console.error('❌ Error updating stock:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get low stock products
router.get('/filter/low-stock', async (req, res) => {
  try {
    const snapshot = await db.ref('products').once('value');
    const lowStockProducts = [];
    
    snapshot.forEach(childSnapshot => {
      const product = childSnapshot.val();
      if (product.stock <= (product.reorderLevel || 10)) {
        lowStockProducts.push({
          id: childSnapshot.key,
          ...product
        });
      }
    });
    
    res.json({ 
      success: true, 
      data: lowStockProducts,
      count: lowStockProducts.length
    });
  } catch (error) {
    console.error('❌ Error getting low stock products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get products by category
router.get('/filter/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const snapshot = await db.ref('products')
      .orderByChild('category')
      .equalTo(category)
      .once('value');
    
    const products = [];
    snapshot.forEach(childSnapshot => {
      products.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    
    res.json({ 
      success: true, 
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('❌ Error getting products by category:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;