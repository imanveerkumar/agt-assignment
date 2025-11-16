const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const Product = require('../models/Product');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Product report generation and download
 */

/**
 * @swagger
 * /api/reports/products:
 *   get:
 *     summary: Generate and download product report in CSV or XLSX format
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [csv, xlsx]
 *           default: csv
 *         description: Report file format
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for product name
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [created_at, name, price]
 *           default: created_at
 *         description: Field to sort by
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Report file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No products found
 *       401:
 *         description: Unauthorized
 */
// Generate and download product report
router.get('/products', authenticateToken, async (req, res, next) => {
  try {
    const format = req.query.format || 'csv'; // csv or xlsx
    const search = req.query.search || '';
    const categoryId = req.query.category_id ? parseInt(req.query.category_id) : null;
    const sortBy = req.query.sort_by || 'created_at';
    const sortOrder = req.query.sort_order || 'DESC';

    // Fetch all products (no pagination for reports)
    const options = {
      limit: null,
      offset: 0,
      search,
      categoryId,
      sortBy,
      sortOrder
    };

    const result = await Product.getAll(options);
    const products = result.products;

    if (products.length === 0) {
      return res.status(404).json({ error: 'No products found' });
    }

    // Prepare data for export
    const exportData = products.map(product => ({
      'Unique ID': product.unique_id,
      'Name': product.name,
      'Price': product.price,
      'Category': product.category_name,
      'Category Unique ID': product.category_unique_id,
      'Image URL': product.image || '',
      'Created At': new Date(product.created_at).toISOString()
    }));

    if (format === 'xlsx') {
      // Generate XLSX
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=products_${Date.now()}.xlsx`);

      // Generate buffer and send
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      res.send(buffer);
    } else {
      // Generate CSV
      const csvRows = [];
      
      // Header row
      const headers = Object.keys(exportData[0]);
      csvRows.push(headers.join(','));

      // Data rows
      exportData.forEach(row => {
        const values = headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        });
        csvRows.push(values.join(','));
      });

      const csvContent = csvRows.join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=products_${Date.now()}.csv`);
      res.send(csvContent);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;


