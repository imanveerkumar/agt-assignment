const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Bulk product upload via CSV
 */

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

/**
 * @swagger
 * /api/upload/bulk:
 *   post:
 *     summary: Bulk upload products from CSV file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 'CSV file containing products (columns: name, image, price, category_id)'
 *     responses:
 *       200:
 *         description: Bulk upload completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 processed:
 *                   type: integer
 *                 successful:
 *                   type: integer
 *                 failed:
 *                   type: integer
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Bad request - no file uploaded or invalid file format
 *       401:
 *         description: Unauthorized
 */
// Bulk upload endpoint
router.post('/bulk', authenticateToken, upload.single('file'), async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const rows = [];
  const errors = [];

  return new Promise((resolve, reject) => {
    const stream = require('stream');
    const readableStream = new stream.Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);

    readableStream
      .pipe(csv())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', async () => {
        try {
          const results = [];
          
          // Process each row
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNumber = i + 1;
            
            try {
              if (!row.name || !row.price || !row.category_id) {
                errors.push({
                  row: rowNumber,
                  error: 'Missing required fields: name, price, or category_id'
                });
                continue;
              }

              // Validate price
              const price = parseFloat(row.price);
              if (isNaN(price) || price < 0) {
                errors.push({
                  row: rowNumber,
                  error: 'Invalid price'
                });
                continue;
              }

              // Validate category exists
              const categoryId = parseInt(row.category_id);
              if (isNaN(categoryId)) {
                errors.push({
                  row: rowNumber,
                  error: 'Invalid category_id'
                });
                continue;
              }

              const category = await Category.findById(categoryId);
              if (!category) {
                errors.push({
                  row: rowNumber,
                  error: `Category with ID ${row.category_id} not found`
                });
                continue;
              }

              results.push({
                name: row.name.trim(),
                image: row.image ? row.image.trim() : null,
                price: price,
                category_id: categoryId
              });
            } catch (error) {
              errors.push({
                row: rowNumber,
                error: error.message
              });
            }
          }

          if (results.length === 0) {
            return res.status(400).json({
              error: 'No valid products found in file',
              errors
            });
          }

          const batchSize = 100;
          const insertedProducts = [];

          for (let i = 0; i < results.length; i += batchSize) {
            const batch = results.slice(i, i + batchSize);
            const batchResults = await Product.bulkCreate(batch);
            insertedProducts.push(...batchResults);
          }

          res.json({
            message: 'Bulk upload completed',
            totalProcessed: rows.length,
            successful: insertedProducts.length,
            failed: errors.length,
            errors: errors.length > 0 ? errors : undefined
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  }).catch((error) => {
    next(error);
  });
});

module.exports = router;


