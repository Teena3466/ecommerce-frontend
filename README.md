# ShopEase - E-Commerce Frontend

ShopEase is a modern e-commerce frontend application built with React and Vite.

It provides a complete shopping experience with product browsing, product details, cart management, checkout, order tracking, and separate admin functionality.

The frontend communicates with a Spring Boot REST API backend for authentication, products, cart, orders, payments, and admin operations.

---

## 🚀 Features

### 👤 User Features

- User registration and login
- JWT-based authentication
- Browse products without login
- Search products
- Filter products by maximum price
- View product details
- Add products to cart
- Increase/decrease cart quantity
- Remove products from cart
- View cart total
- Checkout
- Place orders
- View order history
- Cancel eligible orders
- Track order status
- Logout

### 🛠️ Admin Features

- Admin authentication
- Admin dashboard
- View total products
- View total users
- View total orders
- View total sales
- View order status statistics
- View recent orders
- View inventory
- Add products
- Edit products
- Delete products
- Search/filter products
- Manage customer orders
- Update order status

Order status flow:

```text
PLACED → SHIPPED → DELIVERED