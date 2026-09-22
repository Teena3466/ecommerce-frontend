import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

import { useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import {
  CartProvider,
  useCart,
} from "./context/CartContext";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";


function Navigation() {
  const {
    cart,
    fetchCart,
  } = useCart();

  const {
    user,
    isAuthenticated,
    isAdmin,
    logout,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const cartCount = cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const handleLogout = () => {
    logout();

    alert(
      "Logged out successfully!"
    );

    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "nav-link active"
      : "nav-link";
  };

  return (
    <nav className="navbar">

      <div className="navbar-container">

        <Link
          to={isAdmin ? "/admin/dashboard" : "/"}
          className="navbar-logo"
        >
          Shop<span>Ease</span>
        </Link>

        <div className="navbar-links">

          {!isAdmin && (
            <Link
              to="/"
              className={isActive("/")}
            >
              Home
            </Link>
          )}

          <Link
            to="/products"
            className={isActive("/products")}
          >
            Products
          </Link>

          {isAuthenticated && (
            <Link
              to="/orders"
              className={isActive("/orders")}
            >
              My Orders
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className={isActive(
                "/admin/dashboard"
              )}
            >
              Dashboard
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/orders"
              className={isActive(
                "/admin/orders"
              )}
            >
              Admin Orders
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin/products"
              className={isActive(
                "/admin/products"
              )}
            >
              Admin Products
            </Link>
          )}

          {isAuthenticated && (
            <Link
              to="/cart"
              className={isActive("/cart")}
            >
              <span className="cart-link">
                🛒 Cart

                <span className="cart-badge">
                  {cartCount}
                </span>

              </span>
            </Link>
          )}

          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className={isActive("/login")}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="register-button"
              >
                Register
              </Link>
            </>
          )}

          {isAuthenticated && (
            <div className="user-menu">

              <div className="user-info">

                <span className="user-icon">
                  👤
                </span>

                <span className="user-email">
                  {user?.email ||
                    "Account"}
                </span>

              </div>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </nav>
  );
}


function AppRoutes() {

  const {
    isAuthenticated,
    isAdmin,
  } = useAuth();

  return (
    <>

      <Navigation />

      <main className="app-content">

        <Routes>

          {/* HOME */}

          <Route
            path="/"
            element={
              isAdmin ? (
                <Navigate
                  to="/admin/dashboard"
                  replace
                />
              ) : (
                <div className="home-page">

                  <div className="home-content">

                    <span className="home-badge">
                      Welcome to ShopEase
                    </span>

                    <h1>
                      Shop Smart.
                      <br />
                      Shop <span>Ease.</span>
                    </h1>

                    <p>
                      Discover quality products,
                      simple shopping, and a secure
                      checkout experience.
                    </p>

                    <Link
                      to="/products"
                      className="shop-now-button"
                    >
                      Start Shopping →
                    </Link>

                  </div>

                </div>
              )
            }
          />


          {/* AUTH */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* PRODUCTS */}

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />


          {/* CART */}

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />


          {/* CHECKOUT */}

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />


          {/* USER ORDERS */}

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />


          {/* ADMIN DASHBOARD */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute
                adminOnly={true}
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />


          {/* ADMIN ORDERS */}

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute
                adminOnly={true}
              >
                <AdminOrders />
              </ProtectedRoute>
            }
          />


          {/* ADMIN PRODUCTS */}

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute
                adminOnly={true}
              >
                <AdminProducts />
              </ProtectedRoute>
            }
          />


        </Routes>

      </main>

    </>
  );
}


function App() {

  return (
    <AuthProvider>

      <CartProvider>

        <BrowserRouter>

          <AppRoutes />

        </BrowserRouter>

      </CartProvider>

    </AuthProvider>
  );
}


export default App;