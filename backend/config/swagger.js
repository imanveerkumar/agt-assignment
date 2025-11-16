const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Management API',
      version: '1.0.0',
      description: 'API documentation for Product Management System with user authentication, categories, products, bulk uploads, and reporting',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when user was created',
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Category ID',
            },
            unique_id: {
              type: 'string',
              description: 'Unique identifier for the category',
            },
            name: {
              type: 'string',
              description: 'Category name',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when category was created',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when category was last updated',
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Product ID',
            },
            unique_id: {
              type: 'string',
              description: 'Unique identifier for the product',
            },
            name: {
              type: 'string',
              description: 'Product name',
            },
            image: {
              type: 'string',
              description: 'Product image URL',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Product price',
            },
            category_id: {
              type: 'integer',
              description: 'ID of the category this product belongs to',
            },
            category_name: {
              type: 'string',
              description: 'Name of the category',
            },
            category_unique_id: {
              type: 'string',
              description: 'Unique ID of the category',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when product was created',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp when product was last updated',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
