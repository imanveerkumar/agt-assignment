const request = require('supertest');
const app = require('../server');
const { pool } = require('../config/database');
const User = require('../models/User');

describe('Category API', () => {
  let authToken;
  let categoryId;

  beforeAll(async () => {
    const user = await User.create('categorytest@test.com', 'password123');
    const loginResponse = await request(app)
      .post('/api/users/login')
      .send({
        email: 'categorytest@test.com',
        password: 'password123'
      });
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = $1', ['categorytest@test.com']);
    await pool.end();
  });

  describe('POST /api/categories', () => {
    it('should create a category', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Category'
        });

      expect(response.status).toBe(201);
      expect(response.body.category).toHaveProperty('name', 'Test Category');
      expect(response.body.category).toHaveProperty('unique_id');
      categoryId = response.body.category.id;
    });
  });

  describe('GET /api/categories', () => {
    it('should get all categories', async () => {
      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('categories');
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update category', async () => {
      const response = await request(app)
        .put(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Category'
        });

      expect(response.status).toBe(200);
      expect(response.body.category.name).toBe('Updated Category');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete category', async () => {
      const response = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
    });
  });
});

