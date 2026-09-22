import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        productsResponse,
        usersResponse,
        ordersResponse,
      ] = await Promise.all([
        api.get("/products"),
        api.get("/users"),
        api.get("/orders"),
      ]);

      setProducts(productsResponse.data);
      setUsers(usersResponse.data);
      setOrders(ordersResponse.data);
    } catch (error) {
      console.error(
        "Failed to load dashboard:",
        error
      );

      if (error.response?.status === 403) {
        setError(
          "You do not have permission to view the admin dashboard."
        );
      } else if (error.response?.status === 401) {
        setError(
          "Please login as an admin."
        );
      } else {
        setError(
          "Unable to load dashboard data."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalSales = orders
    .filter(
      (order) =>
        order.status !== "CANCELLED"
    )
    .reduce(
      (total, order) =>
        total +
        Number(order.totalPrice || 0),
      0
    );

  const placedOrders = orders.filter(
    (order) =>
      order.status === "PLACED"
  ).length;

  const shippedOrders = orders.filter(
    (order) =>
      order.status === "SHIPPED"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.status === "DELIVERED"
  ).length;

  const cancelledOrders = orders.filter(
    (order) =>
      order.status === "CANCELLED"
  ).length;

  const recentOrders = [...orders]
    .sort((a, b) => {
      if (!a.createdAt) {
        return 1;
      }

      if (!b.createdAt) {
        return -1;
      }

      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      );
    })
    .slice(0, 5);

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="admin-dashboard-page">

        <div className="admin-dashboard-header">

          <span className="admin-dashboard-label">
            ADMIN PANEL
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            Overview of your ShopEase store.
          </p>

        </div>

        <div className="loading-message">

          <p>
            Loading dashboard...
          </p>

        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-page">

        <div className="admin-dashboard-header">

          <span className="admin-dashboard-label">
            ADMIN PANEL
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            Overview of your ShopEase store.
          </p>

        </div>

        <div className="admin-dashboard-error">

          <div className="admin-dashboard-icon">
            🔒
          </div>

          <h3>
            {error}
          </h3>

          <button
            type="button"
            className="admin-dashboard-retry-button"
            onClick={fetchDashboardData}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">

      {/* ================= HEADER ================= */}

      <div className="admin-dashboard-header">

        <div>

          <span className="admin-dashboard-label">
            ADMIN PANEL
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            Overview of your ShopEase store.
          </p>

        </div>

      </div>

      {/* ================= STATS ================= */}

      <div className="admin-dashboard-stats">

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            📦
          </div>

          <div>

            <span>
              Total Products
            </span>

            <strong>
              {products.length}
            </strong>

          </div>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            👥
          </div>

          <div>

            <span>
              Total Users
            </span>

            <strong>
              {users.length}
            </strong>

          </div>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🛒
          </div>

          <div>

            <span>
              Total Orders
            </span>

            <strong>
              {orders.length}
            </strong>

          </div>

        </div>

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            💰
          </div>

          <div>

            <span>
              Total Sales
            </span>

            <strong>
              ₹
              {totalSales.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

        </div>

      </div>

      {/* ================= ORDER OVERVIEW ================= */}

      <div className="admin-dashboard-section">

        <div className="admin-dashboard-section-header">

          <div>

            <span className="admin-dashboard-section-label">
              ORDERS
            </span>

            <h2>
              Order Overview
            </h2>

          </div>

        </div>

        <div className="admin-order-overview">

          <div className="admin-order-status-card">

            <span className="admin-status-dot placed"></span>

            <div>

              <span>
                Placed
              </span>

              <strong>
                {placedOrders}
              </strong>

            </div>

          </div>

          <div className="admin-order-status-card">

            <span className="admin-status-dot shipped"></span>

            <div>

              <span>
                Shipped
              </span>

              <strong>
                {shippedOrders}
              </strong>

            </div>

          </div>

          <div className="admin-order-status-card">

            <span className="admin-status-dot delivered"></span>

            <div>

              <span>
                Delivered
              </span>

              <strong>
                {deliveredOrders}
              </strong>

            </div>

          </div>

          <div className="admin-order-status-card">

            <span className="admin-status-dot cancelled"></span>

            <div>

              <span>
                Cancelled
              </span>

              <strong>
                {cancelledOrders}
              </strong>

            </div>

          </div>

        </div>

      </div>

      {/* ================= RECENT ORDERS ================= */}

      <div className="admin-dashboard-section">

        <div className="admin-dashboard-section-header">

          <div>

            <span className="admin-dashboard-section-label">
              RECENT ACTIVITY
            </span>

            <h2>
              Recent Orders
            </h2>

          </div>

        </div>

        {recentOrders.length === 0 ? (

          <div className="admin-dashboard-empty">

            <div>
              🛒
            </div>

            <h3>
              No orders yet
            </h3>

            <p>
              Recent customer orders will appear here.
            </p>

          </div>

        ) : (

          <div className="admin-recent-orders">

            {recentOrders.map(
              (order) => (

                <div
                  key={order.id}
                  className="admin-recent-order"
                >

                  <div className="admin-recent-order-icon">
                    🛒
                  </div>

                  <div className="admin-recent-order-info">

                    <div className="admin-recent-order-title">

                      <strong>
                        Order #{order.id}
                      </strong>

                      <span
                        className={`admin-recent-order-status ${
                          order.status
                            ? order.status.toLowerCase()
                            : ""
                        }`}
                      >
                        {order.status || "UNKNOWN"}
                      </span>

                    </div>

                    <div className="admin-recent-order-details">

                      <span>
                        {order.product?.name ||
                          "Product"}
                      </span>

                      <span>
                        Qty: {order.quantity}
                      </span>

                      <span>
                        {formatDate(
                          order.createdAt
                        )}
                      </span>

                    </div>

                  </div>

                  <div className="admin-recent-order-price">

                    ₹
                    {Number(
                      order.totalPrice || 0
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </div>

                </div>
              )
            )}

          </div>

        )}

      </div>

      {/* ================= INVENTORY ================= */}

      <div className="admin-dashboard-section">

        <div className="admin-dashboard-section-header">

          <div>

            <span className="admin-dashboard-section-label">
              INVENTORY
            </span>

            <h2>
              Product Stock
            </h2>

          </div>

        </div>

        {products.length === 0 ? (

          <div className="admin-dashboard-empty">

            <div>
              📦
            </div>

            <h3>
              No products available
            </h3>

            <p>
              Add products from Product Management.
            </p>

          </div>

        ) : (

          <div className="admin-dashboard-products">

            {products
              .slice(0, 5)
              .map(
                (product) => (

                  <div
                    key={product.id}
                    className="admin-dashboard-product"
                  >

                    <div className="admin-dashboard-product-icon">
                      📦
                    </div>

                    <div className="admin-dashboard-product-info">

                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>

                    <div
                      className={
                        product.quantity <= 0
                          ? "admin-dashboard-stock out"
                          : product.quantity <= 5
                          ? "admin-dashboard-stock low"
                          : "admin-dashboard-stock"
                      }
                    >

                      {product.quantity <= 0
                        ? "Out of stock"
                        : `${product.quantity} in stock`}

                    </div>

                  </div>
                )
              )}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminDashboard;