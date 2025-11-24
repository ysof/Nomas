# NOMAS E-Commerce Platform - Project TODO

## Phase 1: Project Setup & Database
- [ ] Set up Flask project structure
- [ ] Create database schema (users, products, cart, orders, order_items)
- [ ] Implement SQLite database initialization
- [ ] Create database migration scripts

## Phase 2: Backend - Authentication & Core Features
- [ ] Implement user registration endpoint
- [ ] Implement user login endpoint with password hashing
- [ ] Implement user logout endpoint
- [ ] Create session/JWT token management
- [ ] Implement password validation and security
- [ ] Create user profile endpoints

## Phase 3: Backend - Product Management
- [ ] Create product model and database table
- [ ] Implement product listing endpoint (with pagination)
- [ ] Implement product detail endpoint
- [ ] Implement product search/filter endpoint
- [ ] Create admin endpoint to add products
- [ ] Create admin endpoint to edit products
- [ ] Create admin endpoint to delete products
- [ ] Implement product image upload functionality

## Phase 4: Backend - Shopping Cart
- [ ] Create cart model and database table
- [ ] Implement add to cart endpoint
- [ ] Implement remove from cart endpoint
- [ ] Implement update cart quantity endpoint
- [ ] Implement get cart endpoint
- [ ] Implement clear cart endpoint

## Phase 5: Backend - Orders & Checkout
- [ ] Create order model and database table
- [ ] Create order items model
- [ ] Implement create order endpoint (COD)
- [ ] Implement create order endpoint (Card - form structure)
- [ ] Implement get user orders endpoint
- [ ] Implement order status update endpoint (admin only)
- [ ] Implement order details endpoint

## Phase 6: Backend - Admin Features
- [ ] Create admin-only middleware/decorator
- [ ] Implement admin dashboard data endpoints (stats, recent orders)
- [ ] Implement admin product management endpoints
- [ ] Implement admin order management endpoints
- [ ] Implement admin user management endpoints

## Phase 7: Frontend - User Interface
- [ ] Create home/landing page with featured collections
- [ ] Create product listing page (Men's, Women's, All)
- [ ] Create product detail page
- [ ] Implement shopping cart UI
- [ ] Implement cart page with quantity adjustment
- [ ] Implement checkout page with COD option
- [ ] Implement checkout page with Card payment form
- [ ] Implement order confirmation page
- [ ] Create user account/profile page
- [ ] Implement user order history page
- [ ] Create login/registration forms
- [ ] Implement responsive design for all pages

## Phase 8: Frontend - Admin Dashboard
- [ ] Create admin login page
- [ ] Create admin dashboard home (stats overview)
- [ ] Create products management page (list, add, edit, delete)
- [ ] Create product image upload UI
- [ ] Create orders management page
- [ ] Create order status update UI
- [ ] Implement responsive admin dashboard

## Phase 9: Security & Validation
- [ ] Implement input validation (frontend)
- [ ] Implement input validation (backend)
- [ ] Implement SQL injection prevention (prepared statements)
- [ ] Implement CSRF protection
- [ ] Implement password hashing (bcrypt)
- [ ] Implement rate limiting for login attempts
- [ ] Implement secure session management
- [ ] Add security headers (CORS, CSP, etc.)
- [ ] Implement file upload security (for product images)

## Phase 10: Testing & Documentation
- [ ] Create comprehensive PDF guide
- [ ] Write installation instructions
- [ ] Write database setup instructions
- [ ] Write deployment guide (shared hosting, VPS, local)
- [ ] Write security recommendations
- [ ] Document admin login credentials setup
- [ ] Create API documentation
- [ ] Test all features manually

## Phase 11: Final Packaging
- [ ] Organize all files into /code directory
- [ ] Create /guide directory with PDF
- [ ] Create ZIP file with /code and /guide
- [ ] Verify ZIP structure and contents
- [ ] Prepare final deliverable

## Design Notes
- Preserve NOMAS luxury aesthetic (gold #cfa55a, warm off-white #fdfaf6, dark text #2b2b2b)
- Use Playfair Display for headings, Inter for body text
- Maintain responsive design across all pages
- Keep UI clean and minimalist (inspired by luxury fashion sites)
- Implement smooth animations and transitions
