# NOMAS - Modern E-Commerce Platform

A full-stack, production-ready e-commerce platform built with React, Node.js, Express, and MySQL. Designed for luxury fashion brands with a clean, minimalist aesthetic.

## 🎯 Features

### User Features
- ✅ User authentication and account management
- ✅ Product browsing with category filtering
- ✅ Shopping cart with quantity management
- ✅ Secure checkout process
- ✅ Multiple payment methods (Cash on Delivery, Card)
- ✅ Order tracking and history
- ✅ Responsive design for all devices

### Admin Features
- ✅ Product management (add, edit, delete)
- ✅ Product image uploads
- ✅ Order management and status tracking
- ✅ User management
- ✅ Sales analytics

### Technical Features
- ✅ Type-safe backend with tRPC
- ✅ Real-time data synchronization
- ✅ SQL injection prevention
- ✅ Input validation and sanitization
- ✅ Secure session management
- ✅ RESTful API design
- ✅ Comprehensive error handling

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- pnpm package manager
- MySQL v8.0 or higher

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd shopping_website

# 2. Install dependencies
pnpm install

# 3. Create .env file
cp .env.example .env

# 4. Configure environment variables
# Edit .env with your database credentials and secrets

# 5. Create database
mysql -u root -p < database.sql

# 6. Run migrations
pnpm db:push

# 7. Start development server
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 📁 Project Structure

```
shopping_website/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── lib/              # Utilities and helpers
│   │   ├── contexts/         # React contexts
│   │   ├── App.tsx           # Main app component
│   │   └── index.css         # Global styles
│   └── public/               # Static assets
├── server/                    # Node.js backend
│   ├── routers.ts            # tRPC route definitions
│   ├── db.ts                 # Database queries
│   └── _core/                # Core server utilities
├── drizzle/                  # Database schema
│   └── schema.ts             # Table definitions
├── shared/                   # Shared types and constants
├── DEPLOYMENT_GUIDE.md       # Complete deployment guide
├── README.md                 # This file
└── package.json              # Dependencies

```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price VARCHAR(20) NOT NULL,
  category VARCHAR(100),
  imageUrl TEXT,
  stock INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  totalAmount VARCHAR(20) NOT NULL,
  paymentMethod ENUM('cod', 'card') NOT NULL,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  customerName VARCHAR(255) NOT NULL,
  customerEmail VARCHAR(320) NOT NULL,
  customerPhone VARCHAR(20) NOT NULL,
  shippingAddress TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **SQL Injection Prevention**: Prepared statements via Drizzle ORM
- **CSRF Protection**: Secure session cookies
- **Input Validation**: Zod schema validation
- **HTTPS/SSL**: Enforced in production
- **Rate Limiting**: Implemented on API endpoints
- **CORS**: Configured for trusted domains
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.

## 📝 API Documentation

### Authentication
```typescript
// Login
POST /api/oauth/callback

// Logout
POST /api/trpc/auth.logout

// Get current user
GET /api/trpc/auth.me
```

### Products
```typescript
// List products
GET /api/trpc/products.list?category=men

// Get product by ID
GET /api/trpc/products.getById?input=1

// Create product (admin only)
POST /api/trpc/products.create

// Update product (admin only)
POST /api/trpc/products.update

// Delete product (admin only)
POST /api/trpc/products.delete
```

### Cart
```typescript
// Get cart items
GET /api/trpc/cart.getItems

// Add to cart
POST /api/trpc/cart.addItem

// Update cart item
POST /api/trpc/cart.updateItem

// Remove from cart
POST /api/trpc/cart.removeItem

// Clear cart
POST /api/trpc/cart.clear
```

### Orders
```typescript
// Create order
POST /api/trpc/orders.create

// Get user orders
GET /api/trpc/orders.getMyOrders

// Get order by ID
GET /api/trpc/orders.getById

// Get order items
GET /api/trpc/orders.getItems

// Update order status (admin only)
POST /api/trpc/orders.updateStatus

// Get all orders (admin only)
GET /api/trpc/orders.getAllOrders
```

## 🛠️ Development

### Available Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Type check
pnpm type-check

# Lint code
pnpm lint

# Format code
pnpm format

# Database migrations
pnpm db:push
pnpm db:generate
```

### Environment Variables

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/nomas_db

# Authentication
JWT_SECRET=your-secret-key-here-min-32-characters

# Application
VITE_APP_TITLE=NOMAS
VITE_APP_LOGO=/logo.png
NODE_ENV=development
PORT=3000
```

## 📦 Deployment

### Quick Deployment Options

1. **Shared Hosting (cPanel)**: See DEPLOYMENT_GUIDE.md
2. **VPS (Ubuntu)**: See DEPLOYMENT_GUIDE.md
3. **Heroku**: See DEPLOYMENT_GUIDE.md
4. **Docker**: See docker-compose.yml (if available)

### Production Checklist

- [ ] Set strong `JWT_SECRET`
- [ ] Configure production database
- [ ] Enable HTTPS/SSL
- [ ] Set up regular backups
- [ ] Configure email notifications
- [ ] Set up monitoring and logging
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set security headers
- [ ] Test payment processing

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Verify MySQL is running
sudo systemctl status mysql

# Check DATABASE_URL format
# mysql://username:password@host:port/database
```

### Port Already in Use
```bash
# Use different port
PORT=3001 pnpm dev

# Or kill process using port 3000
lsof -i :3000
kill -9 <PID>
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Node.js Documentation](https://nodejs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 💡 Tips for Customization

### Change Brand Name
1. Update `VITE_APP_TITLE` in `.env`
2. Update logo in `client/public/`
3. Update `APP_LOGO` in `client/src/const.ts`
4. Update footer text in page components

### Add New Product Categories
1. Add category to database
2. Update category filter in Products page
3. Update navigation menu

### Customize Colors
1. Edit CSS variables in `client/src/index.css`
2. Update Tailwind theme colors
3. Modify component styling

### Add Payment Gateway
1. Choose payment provider (Stripe, PayPal, etc.)
2. Install provider SDK
3. Update checkout form
4. Add payment processing to backend

## 📞 Support

For issues or questions:
1. Check DEPLOYMENT_GUIDE.md
2. Review code comments
3. Check error logs
4. Verify environment variables

## 📄 License

This project is provided as-is for personal and commercial use.

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Built with**: React, Node.js, Express, MySQL, Tailwind CSS
