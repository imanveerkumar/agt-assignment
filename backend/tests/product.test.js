const request = require('supertest');
const app = require('../server');
const { pool } = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');

describe('Product API', () => {
  let authToken;
  let categoryId;
  let productId;

  beforeAll(async () => {
    const user = await User.create('producttest@test.com', 'password123');
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'producttest@test.com',
        password: 'password123'
      });
    authToken = loginResponse.body.token;

    const category = await Category.create('Test Category');
    categoryId = category.id;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', ['producttest@test.com']);
    await pool.end();
  });

  describe('POST /api/products', () => {
    it('should create a product', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Product',
          price: 99.99,
          category_id: categoryId,
          image: 'https://example.com/image.jpg'
        });

      expect(response.status).toBe(201);
      expect(response.body.product).toHaveProperty('name', 'Test Product');
      expect(response.body.product).toHaveProperty('unique_id');
      productId = response.body.product.id;
    });
  });

  describe('GET /api/products', () => {
    it('should get all products with pagination', async () => {
      const response = await request(app)
        .get('/api/products?limit=10&offset=0')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('products');
      expect(response.body).toHaveProperty('total');
    });

    it('should support sorting by price', async () => {
      const response = await request(app)
        .get('/api/products?sort_by=price&sort_order=ASC')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
    });

    it('should support search', async () => {
      const response = await request(app)
        .get('/api/products?search=Test')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update product', async () => {
      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Product',
          price: 149.99,
          category_id: categoryId
        });

      expect(response.status).toBe(200);
      expect(response.body.product.name).toBe('Updated Product');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete product', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
    });
  });
});

