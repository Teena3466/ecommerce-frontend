import { useEffect, useState } from "react";
import api from "../services/api";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders");

      setOrders(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch admin orders:",
        error
      );

      if (error.response?.status === 403) {
        setError(
          "You do not have permission to view all orders."
        );
      } else if (error.response?.status === 401) {
        setError(
          "Please login as an admin."
        );
      } else {
        setError(
          "Unable to load orders."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingId(orderId);

      await api.put(
        `/orders/${orderId}/status?status=${status}`
      );

      await fetchOrders();

      alert(
        `Order #${orderId} status updated to ${status}.`
      );
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusClass = (status) => {
    if (!status) {
      return "admin-order-status";
    }

    return `admin-order-status ${status.toLowerCase()}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
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
      <div className="admin-orders-page">

        <div className="admin-orders-header">

          <div>
            <span className="admin-orders-label">
              ADMIN PANEL
            </span>

            <h1>
              All Orders
            </h1>

            <p>
              View and manage all customer orders.
            </p>
          </div>

        </div>

        <div className="loading-message">

          <p>
            Loading orders...
          </p>

        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders-page">

        <div className="admin-orders-header">

          <div>
            <span className="admin-orders-label">
              ADMIN PANEL
            </span>

            <h1>
              All Orders
            </h1>

            <p>
              View and manage all customer orders.
            </p>
          </div>

        </div>

        <div className="admin-orders-error">

          <div className="admin-orders-icon">
            🔒
          </div>

          <h3>
            {error}
          </h3>

          <button
            type="button"
            className="checkout-button"
            onClick={fetchOrders}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="admin-orders-page">

      {/* ================= HEADER ================= */}

      <div className="admin-orders-header">

        <div>

          <span className="admin-orders-label">
            ADMIN PANEL
          </span>

          <h1>
            All Orders
          </h1>

          <p>
            View and manage all customer orders.
          </p>

        </div>

        <div className="admin-orders-count">

          {orders.length} order
          {orders.length !== 1
            ? "s"
            : ""}

        </div>

      </div>

      {/* ================= EMPTY ================= */}

      {orders.length === 0 ? (

        <div className="admin-orders-empty">

          <div className="admin-orders-icon">
            📦
          </div>

          <h2>
            No orders found
          </h2>

          <p>
            There are currently no customer orders.
          </p>

        </div>

      ) : (

        /* ================= ORDERS ================= */

        <div className="admin-orders-list">

          {orders.map((order) => {

            const isCancelled =
              order.status === "CANCELLED";

            const isDelivered =
              order.status === "DELIVERED";

            const canUpdate =
              !isCancelled &&
              !isDelivered;

            return (
              <div
                key={order.id}
                className="admin-order-card"
              >

                {/* ORDER HEADER */}

                <div className="admin-order-card-header">

                  <div>

                    <span className="admin-order-label">
                      ORDER
                    </span>

                    <h2>
                      #{order.id}
                    </h2>

                  </div>

                  <span
                    className={getStatusClass(
                      order.status
                    )}
                  >
                    {order.status ||
                      "PENDING"}
                  </span>

                </div>

                {/* ORDER DETAILS */}

                <div className="admin-order-grid">

                  <div className="admin-order-detail">

                    <span>
                      Customer
                    </span>

                    <strong>
                      {order.user?.name ||
                        "N/A"}
                    </strong>

                  </div>

                  <div className="admin-order-detail">

                    <span>
                      Email
                    </span>

                    <strong>
                      {order.user?.email ||
                        "N/A"}
                    </strong>

                  </div>

                  <div className="admin-order-detail">

                    <span>
                      Product
                    </span>

                    <strong>
                      {order.product?.name ||
                        "N/A"}
                    </strong>

                  </div>

                  <div className="admin-order-detail">

                    <span>
                      Quantity
                    </span>

                    <strong>
                      {order.quantity}
                    </strong>

                  </div>

                  <div className="admin-order-detail">

                    <span>
                      Total
                    </span>

                    <strong className="admin-order-total">

                      ₹
                      {Number(
                        order.totalPrice || 0
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </strong>

                  </div>

                  <div className="admin-order-detail">

                    <span>
                      Order Date
                    </span>

                    <strong>
                      {formatDate(
                        order.createdAt
                      )}
                    </strong>

                  </div>

                </div>

                {/* STATUS ACTIONS */}

                {canUpdate && (

                  <div className="admin-order-actions">

                    <span>
                      Update Status
                    </span>

                    <div className="admin-status-buttons">

                      {order.status ===
                        "PLACED" && (

                        <button
                          type="button"
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              "SHIPPED"
                            )
                          }
                          disabled={
                            updatingId ===
                            order.id
                          }
                        >
                          {updatingId ===
                          order.id
                            ? "Updating..."
                            : "Mark Shipped"}
                        </button>

                      )}

                      {order.status ===
                        "SHIPPED" && (

                        <button
                          type="button"
                          onClick={() =>
                            updateOrderStatus(
                              order.id,
                              "DELIVERED"
                            )
                          }
                          disabled={
                            updatingId ===
                            order.id
                          }
                        >
                          {updatingId ===
                          order.id
                            ? "Updating..."
                            : "Mark Delivered"}
                        </button>

                      )}

                    </div>

                  </div>

                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default AdminOrders;