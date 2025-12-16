import express from 'express';
const router = express.Router();
import { db } from '../config/firebase.js';

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
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    updates.updatedAt = new Date().toISOString();
    
    await db.ref(`products/${req.params.id}`).update(updates);
    
    res.json({ 
      success: true, 
      message: 'Product updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await db.ref(`products/${req.params.id}`).remove();
    
    res.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
