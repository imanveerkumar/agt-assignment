# Frontend Application

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Open browser:
```
http://localhost:4200
```

## Features

- User authentication (Login/Register)
- User management
- Category management
- Product management with filtering and sorting
- Bulk product upload
- Report generation and download

## Development

The app uses Angular standalone components and modern Angular features.

### Components
- `Login` - Authentication
- `Dashboard` - Main layout with navigation
- `Users` - User CRUD
- `Categories` - Category CRUD
- `Products` - Product CRUD with filters
- `Upload` - Bulk CSV upload
- `Reports` - Report download

### Services
- `AuthService` - Authentication and token management
- `UserService` - User API calls
- `CategoryService` - Category API calls
- `ProductService` - Product API calls

## Build

```bash
npm run build
```
