import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import "../Orders.css";

function Orders() {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/orders/my-orders"
      );

      console.log(
        "Orders:",
        response.data
      );

      setOrders(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch orders:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "Please login to view your orders."
        );
      } else {
        setError(
          "Unable to load your orders."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const getStatusClass = (status) => {
    if (!status) {
      return "order-status";
    }

    return `order-status ${status.toLowerCase()}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "Date not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date not available";
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

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setCancellingId(orderId);

      await api.delete(
        `/orders/${orderId}`
      );

      alert(
        "Order cancelled successfully!"
      );

      await fetchOrders();
    } catch (error) {
      console.error(
        "Failed to cancel order:",
        error
      );

      if (error.response?.status === 401) {
        alert("Please login again.");
        navigate("/login");
      } else {
        alert(
          error.response?.data?.message ||
            "Unable to cancel the order."
        );
      }
    } finally {
      setCancellingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="orders-page">

        <div className="orders-header">
          <div>
            <span className="orders-label">
              SHOPPING
            </span>

            <h1>My Orders</h1>

            <p>
              Track and manage your orders.
            </p>
          </div>
        </div>

        <div className="orders-error">

          <div className="orders-empty-icon">
            🔒
          </div>

          <h3>
            Please login to view your orders.
          </h3>

          <button
            type="button"
            className="orders-primary-button"
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </button>

        </div>

      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">

        <div className="orders-header">
          <div>
            <span className="orders-label">
              SHOPPING
            </span>

            <h1>My Orders</h1>

            <p>
              Track and manage your orders.
            </p>
          </div>
        </div>

        <div className="loading-message">
          <p>
            Loading your orders...
          </p>
        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">

        <div className="orders-header">
          <div>
            <span className="orders-label">
              SHOPPING
            </span>

            <h1>My Orders</h1>

            <p>
              Track and manage your orders.
            </p>
          </div>
        </div>

        <div className="orders-error">

          <div className="orders-empty-icon">
            ⚠️
          </div>

          <h3>{error}</h3>

          <button
            type="button"
            className="orders-primary-button"
            onClick={fetchOrders}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="orders-page">

      <div className="orders-header">

        <div>
          <span className="orders-label">
            SHOPPING
          </span>

          <h1>My Orders</h1>

          <p>
            Track and manage your orders.
          </p>
        </div>

        {orders.length > 0 && (
          <div className="orders-count">
            {orders.length} order
            {orders.length !== 1
              ? "s"
              : ""}
          </div>
        )}

      </div>

      {orders.length === 0 ? (

        <div className="orders-empty">

          <div className="orders-empty-icon">
            📦
          </div>

          <h2>
            No orders yet
          </h2>

          <p>
            You haven't placed any
            orders yet.
          </p>

          <button
            type="button"
            className="orders-primary-button"
            onClick={() =>
              navigate("/products")
            }
          >
            Start Shopping
          </button>

        </div>

      ) : (

        <div className="orders-list">

          {orders.map((order) => {

            const canCancel =
              order.status !== "CANCELLED" &&
              order.status !== "DELIVERED";

            return (
              <div
                key={order.id}
                className="order-card"
              >

                <div className="order-card-top">

                  <div>
                    <p className="order-label">
                      ORDER
                    </p>

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

                <div className="order-divider"></div>

                <div className="order-details">

                  <div className="order-detail">

                    <span>
                      Order Date
                    </span>

                    <strong>
                      {formatDate(
                        order.createdAt
                      )}
                    </strong>

                  </div>

                  <div className="order-detail">

                    <span>
                      Total Amount
                    </span>

                    <strong className="order-total">
                      ₹
                      {Number(
                        order.totalPrice || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>

                </div>

                {canCancel && (

                  <button
                    type="button"
                    className="cancel-order-button"
                    onClick={() =>
                      handleCancelOrder(
                        order.id
                      )
                    }
                    disabled={
                      cancellingId ===
                      order.id
                    }
                  >
                    {cancellingId ===
                    order.id
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>

                )}

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Orders;