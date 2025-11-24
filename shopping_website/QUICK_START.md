# NOMAS - Quick Start Guide

Get your e-commerce platform up and running in 5 minutes!

## 🎯 What You'll Get

- ✅ Complete e-commerce website
- ✅ User authentication system
- ✅ Product catalog with admin panel
- ✅ Shopping cart and checkout
- ✅ Order management
- ✅ Responsive design

## ⚡ 5-Minute Setup

### Step 1: Prepare Your Environment (1 min)

```bash
# Install Node.js from https://nodejs.org (v18+)
# Install MySQL from https://dev.mysql.com/downloads/mysql/

# Verify installations
node --version
npm --version
mysql --version
```

### Step 2: Download & Install (2 min)

```bash
# Extract the project
unzip shopping_website.zip
cd shopping_website

# Install dependencies
npm install
# or if you have pnpm
pnpm install
```

### Step 3: Configure Database (1 min)

```bash
# Create database
mysql -u root -p

# In MySQL prompt:
CREATE DATABASE nomas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'nomas_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON nomas_db.* TO 'nomas_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 4: Set Environment (30 sec)

Create `.env` file in the root directory:

```env
DATABASE_URL=mysql://nomas_user:password123@localhost:3306/nomas_db
JWT_SECRET=your-secret-key-change-this-to-something-long-and-random
VITE_APP_TITLE=NOMAS
NODE_ENV=development
PORT=3000
```

### Step 5: Start Application (30 sec)

```bash
# Run migrations
npm run db:push

# Start development server
npm run dev
```

**Done!** 🎉

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 📱 First Steps

### 1. Add Products

1. Create an admin user (see Admin Setup below)
2. Log in with admin account
3. Navigate to Admin Panel
4. Click "Add Product"
5. Fill in product details
6. Click "Save"

### 2. Test Shopping

1. Log in as regular user
2. Browse products
3. Add items to cart
4. Proceed to checkout
5. Choose payment method
6. Place order

### 3. Manage Orders

1. Log in as admin
2. View all orders
3. Update order status
4. Track shipments

## 👤 Admin Setup

### Make First User an Admin

```bash
# Connect to MySQL
mysql -u nomas_user -p nomas_db

# Update user role
UPDATE users SET role = 'admin' WHERE id = 1;
EXIT;
```

### Admin Credentials

After setup, use these to log in:
- **Email**: Your registered email
- **Password**: Your account password
- **Role**: Admin (after database update)

## 🌐 Deploy to Internet

### Quick Deploy Options

#### Option A: Heroku (Easiest)
```bash
# Install Heroku CLI
# Visit https://www.heroku.com/

# Login and deploy
heroku login
heroku create your-app-name
git push heroku main
```

#### Option B: Shared Hosting
1. Upload files via FTP
2. Create MySQL database
3. Configure `.env` file
4. Set up Node.js support
5. Start application

#### Option C: VPS (Best Control)
1. Rent a VPS (DigitalOcean, Linode, etc.)
2. SSH into server
3. Install Node.js and MySQL
4. Upload project files
5. Configure Nginx reverse proxy
6. Set up SSL certificate
7. Start application with PM2

**See DEPLOYMENT_GUIDE.pdf for detailed instructions**

## 🔧 Common Tasks

### Add New Product Category

Edit `client/src/pages/Products.tsx`:

```typescript
// Find this section:
<Button onClick={() => setSelectedCategory("accessories")}>
  Accessories
</Button>

// Add your new category:
<Button onClick={() => setSelectedCategory("shoes")}>
  Shoes
</Button>
```

### Change Brand Colors

Edit `client/src/index.css`:

```css
:root {
  --primary: oklch(0.65 0.15 50);  /* Change this color */
  --accent: oklch(0.65 0.15 50);   /* And this one */
}
```

### Update Logo

1. Replace image in `client/public/logo.png`
2. Update path in `client/src/const.ts`:
   ```typescript
   export const APP_LOGO = "/logo.png";
   ```

### Enable Payment Processing

For production, integrate a payment gateway:

1. **Stripe** (Recommended)
   - Sign up at stripe.com
   - Get API keys
   - Install Stripe SDK
   - Update checkout form

2. **PayPal**
   - Sign up at paypal.com
   - Get merchant account
   - Install PayPal SDK
   - Update checkout form

## 📊 Database Backup

### Backup Your Data

```bash
# Create backup
mysqldump -u nomas_user -p nomas_db > backup.sql

# Restore backup
mysql -u nomas_user -p nomas_db < backup.sql
```

### Schedule Automatic Backups

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
mysqldump -u nomas_user -p$DB_PASSWORD nomas_db > /backups/nomas_$DATE.sql

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

## 🚨 Troubleshooting

### "Cannot connect to database"
```bash
# Check MySQL is running
sudo systemctl status mysql

# Start MySQL
sudo systemctl start mysql

# Verify credentials in .env
```

### "Port 3000 already in use"
```bash
# Use different port
PORT=3001 npm run dev

# Or kill process
lsof -i :3000
kill -9 <PID>
```

### "Build failed"
```bash
# Clear cache
rm -rf node_modules
npm install

# Try again
npm run build
```

### "Database migrations failed"
```bash
# Check database exists
mysql -u nomas_user -p -e "SHOW DATABASES;"

# Check connection string in .env
# Format: mysql://user:password@host:port/database
```

## 📚 Learn More

- **Full Guide**: See `DEPLOYMENT_GUIDE.pdf`
- **Code Documentation**: See `README.md`
- **Database Schema**: See `drizzle/schema.ts`
- **API Routes**: See `server/routers.ts`

## 💬 Need Help?

1. Check error messages carefully
2. Review logs in terminal
3. Check `.env` configuration
4. Verify database connection
5. See DEPLOYMENT_GUIDE.pdf for detailed troubleshooting

## 🎉 You're Ready!

Your e-commerce platform is now ready to use. Start by:

1. ✅ Adding products
2. ✅ Testing the shopping flow
3. ✅ Setting up admin users
4. ✅ Deploying to production

**Happy selling!** 🛍️

---

**Need more details?** See DEPLOYMENT_GUIDE.pdf for complete setup instructions.
