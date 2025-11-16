# Product Management System

A full-stack application built with Angular, Node.js, and PostgreSQL for managing users, categories, and products with bulk upload and report generation capabilities.

## Features

### Backend (Node.js/Express)
-  User CRUD operations with encrypted passwords
-  Category CRUD operations with auto-generated unique IDs
-  Product CRUD operations (products must belong to a category)
-  Bulk product upload via CSV (handles large files without timeout)
-  Product report generation (CSV/XLSX) without timeout errors
-  Product list API with:
  - Server-side pagination
  - Sorting by price (asc/desc)
  - Search by category and product names
-  JWT-based authentication
-  PostgreSQL database with proper relationships

### Frontend (Angular)
-  Modern, responsive UI
-  User management interface
-  Category management interface
-  Product management interface with filtering and sorting
-  Bulk upload interface with drag-and-drop
-  Report download interface

## Project Structure

```
Assignment/
├── backend/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── reportRoutes.js
│   ├── tests/
│   │   ├── user.test.js
│   │   ├── category.test.js
│   │   └── product.test.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── components/
│   │       │   ├── login/
│   │       │   ├── dashboard/
│   │       │   ├── users/
│   │       │   ├── categories/
│   │       │   ├── products/
│   │       │   ├── upload/
│   │       │   └── reports/
│   │       └── services/
│   │           ├── auth.service.ts
│   │           ├── user.service.ts
│   │           ├── category.service.ts
│   │           └── product.service.ts
│   └── package.json
├── Postman_Collection.json     # Complete API collection
└── README.md

```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE product_management;
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=product_management
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-in-production
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

Run database migrations:

```bash
npm run migrate
```

Start the backend server:

```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will be available at `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm start
```

The frontend will be available at `http://localhost:4200`

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All endpoints (except register/login) require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication
- `POST /users/register` - Register a new user
- `POST /users/login` - Login and get token

#### Users
- `GET /users` - Get all users (paginated)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

#### Categories
- `GET /categories` - Get all categories (paginated, searchable)
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

#### Products
- `GET /products` - Get all products with pagination, sorting, and search
  - Query params: `limit`, `offset`, `search`, `category_id`, `sort_by`, `sort_order`
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

#### Bulk Upload
- `POST /upload/bulk` - Upload CSV file for bulk product import
  - CSV format: `name,price,category_id,image`

#### Reports
- `GET /reports/products` - Download product report
  - Query params: `format` (csv/xlsx), `search`, `category_id`, `sort_by`, `sort_order`

### Example Requests

#### Register User
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

#### Create Category
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Electronics"}'
```

#### Get Products (Sorted by Price)
```bash
curl -X GET "http://localhost:3000/api/products?sort_by=price&sort_order=ASC&limit=10&offset=0" \
  -H "Authorization: Bearer <token>"
```

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Postman Collection

Import `Postman_Collection.json` into Postman for easy API testing. The collection includes:
- Pre-configured authentication
- All CRUD endpoints
- Bulk upload examples
- Report download examples

## Database Schema

### Users
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR, encrypted)
- `created_at`, `updated_at` (TIMESTAMP)

### Categories
- `id` (SERIAL PRIMARY KEY)
- `unique_id` (VARCHAR, UNIQUE, auto-generated UUID)
- `name` (VARCHAR)
- `created_at`, `updated_at` (TIMESTAMP)

### Products
- `id` (SERIAL PRIMARY KEY)
- `unique_id` (VARCHAR, UNIQUE, auto-generated UUID)
- `name` (VARCHAR)
- `image` (TEXT)
- `price` (DECIMAL)
- `category_id` (INTEGER, FOREIGN KEY to categories)
- `created_at`, `updated_at` (TIMESTAMP)

## Key Features Implementation

### Bulk Upload
- Processes CSV files in memory to avoid timeout
- Validates each row before insertion
- Uses batch inserts for performance
- Returns detailed error report for failed rows

### Report Generation
- Generates CSV or XLSX format
- Supports all product list filters
- Streams response to avoid timeout
- No pagination limit for reports

### Product List API
- Server-side pagination for performance
- Sorting by price, name, or date
- Search across product and category names
- Filter by category

## Security Features

- Password encryption using bcryptjs
- JWT token-based authentication
- SQL injection prevention with parameterized queries
- Input validation on all endpoints

## Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "Error message"
}
```

## Development

### Backend Development
- Uses nodemon for auto-reload
- Environment-based configuration
- Comprehensive error handling

### Frontend Development
- Angular standalone components
- Reactive forms
- Modern CSS styling
- Responsive design

