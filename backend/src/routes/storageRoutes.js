const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { supabaseAdmin } = require('../config/supabase');

// Ensure bucket exists and is public
router.post('/ensure-bucket', async (req, res) => {
  try {
    const bucketName = String(req.body.bucketName || '').trim();
    const makePublic = Boolean(req.body.public);
    if (!bucketName) {
      return res.status(400).json({ success: false, error: 'bucketName required' });
    }

    // List buckets to check existence
    const { data: buckets, error: listErr } = await supabaseAdmin.storage.listBuckets();
    if (listErr) {
      return res.status(500).json({ success: false, error: listErr.message });
    }
    const exists = Array.isArray(buckets) && buckets.some((b) => b.name === bucketName);

    if (!exists) {
      const { error: createErr } = await supabaseAdmin.storage.createBucket(bucketName, { public: makePublic });
      if (createErr) {
        return res.status(500).json({ success: false, error: createErr.message });
      }
    } else if (makePublic) {
      // Ensure bucket is public
      const { error: updErr } = await supabaseAdmin.storage.updateBucket(bucketName, { public: true });
      if (updErr) {
        return res.status(500).json({ success: false, error: updErr.message });
      }
    }

    return res.json({ success: true, bucket: bucketName });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Upload file via service role (server-side)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const bucket = String(req.body.bucket || 'product-images');
    const path = String(req.body.path || '').trim();
    if (!req.file || !path) {
      return res.status(400).json({ success: false, error: 'file and path required' });
    }

    const { error: uploadErr } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, req.file.buffer, { contentType: req.file.mimetype, upsert: true });
    if (uploadErr) {
      return res.status(400).json({ success: false, error: uploadErr.message });
    }
    const { data: pub } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
    return res.json({ success: true, url: pub?.publicUrl || '' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
