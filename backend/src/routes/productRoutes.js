const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

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
    
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a product
router.post('/', async (req, res) => {
  try {
    const productData = req.body;
    const newProductRef = db.ref('products').push();
    
    await newProductRef.set({
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    res.json({ 
      success: true, 
      id: newProductRef.key, 
      message: 'Product created successfully' 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const snapshot = await db.ref(`products/${req.params.id}`).once('value');
    
    if (!snapshot.exists()) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ 
      success: true, 
      data: { id: snapshot.key, ...snapshot.val() } 
    });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const productData = req.body;
    await db.ref(`products/${req.params.id}`).update({
      ...productData,
      updatedAt: new Date().toISOString()
    });
    
    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await db.ref(`products/${req.params.id}`).remove();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;