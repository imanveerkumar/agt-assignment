# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
-  Node.js installed (v18+)
-  PostgreSQL installed and running
-  npm or yarn package manager

## Step-by-Step Setup

### 1. Database Setup (5 minutes)

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE product_management;

# Exit psql
\q
```

### 2. Backend Setup (2 minutes)

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=product_management
# DB_USER=postgres
# DB_PASSWORD=your_password

# Run database migrations
npm run migrate

# Start backend server
npm start
```

Backend should now be running at `http://localhost:3000`

### 3. Frontend Setup (2 minutes)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend should now be running at `http://localhost:4200`

### 4. First Steps

1. **Open browser**: Navigate to `http://localhost:4200`
2. **Register**: Create a new user account
3. **Login**: Use your credentials to login
4. **Create Category**: Go to Categories and create a category (e.g., "Electronics")
5. **Create Product**: Go to Products and create a product
6. **Test Bulk Upload**: Use the sample CSV file in `backend/sample_products.csv`

### Testing with Swagger

You can easily test and explore all backend API endpoints using Swagger UI:

1. Make sure the backend server is running.
2. Open your browser and go to: [http://localhost:3000/api-docs/#](http://localhost:3000/api-docs/#)
3. You will see the interactive API documentation.
4. You can "Authorize" using your JWT token after logging in or registering.
5. Try out any API—enter parameters and view responses directly.

Swagger provides a simple way to understand, try, and debug the entire API without writing extra code or using external tools.


## Testing with Postman

1. Import `Postman_Collection.json` into Postman
2. Set the `base_url` variable to `http://localhost:3000/api`
3. Run "Register User" or "Login" request
4. Token will be automatically saved to `auth_token` variable
5. Test other endpoints

## Common Issues

### Database Connection Error
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `.env` file
- Ensure database exists

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Use `ng serve --port 4201`

### Migration Errors
- Ensure database is empty or drop existing tables
- Check PostgreSQL user has CREATE privileges

## Next Steps

- Read the main `README.md` for detailed documentation
- Check `backend/README.md` for API details
- Check `frontend/README.md` for frontend details
- Import Postman collection for API testing

## Sample Data

Use `backend/sample_products.csv` for bulk upload testing. Make sure to:
1. Create categories first (they need IDs)
2. Update `category_id` in CSV to match your category IDs
3. Upload via the Bulk Upload page or Postman

