# Backend API Documentation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="db_url_here"
PORT=3000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

3. Run migrations:
```bash
npm run migrate
```

4. Start server:
```bash
npm start
# or
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register
- `POST /api/users/login` - Login

### Users
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Categories
- `GET /api/categories` - List categories
- `GET /api/categories/:id` - Get category
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Products
- `GET /api/products` - List products (with pagination, sorting, search)
- `GET /api/products/:id` - Get product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Bulk Upload
- `POST /api/upload/bulk` - Upload CSV file

### Reports
- `GET /api/reports/products` - Download report (CSV/XLSX)

## Testing

Run tests:
```bash
npm test
```

