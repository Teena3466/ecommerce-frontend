import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../Checkout.css";

function Checkout() {
  const {
    cart,
    clearCart,
  } = useCart();

  const {
    isAuthenticated,
  } = useAuth();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cartTotal = cart.reduce(
    (total, item) =>
      total + Number(item.totalPrice || 0),
    0
  );


  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setError(
        "Please login before placing the order."
      );

      navigate("/login");

      return;
    }


    if (cart.length === 0) {
      setError(
        "Your cart is empty."
      );

      return;
    }


    try {
      setLoading(true);
      setError("");


      const response =
        await api.post(
          "/orders/checkout"
        );


      console.log(
        "Checkout successful:",
        response.data
      );


      const cartCleared =
        await clearCart();


      if (!cartCleared) {
        setError(
          "Order was placed, but the cart could not be cleared. Please check your orders."
        );

        return;
      }


      alert(
        "Order placed successfully!"
      );


      navigate("/orders");

    } catch (error) {

      console.error(
        "Checkout failed:",
        error
      );


      if (
        error.response?.status === 401
      ) {
        setError(
          "Please login before placing the order."
        );

      } else if (
        error.response?.status === 400
      ) {

        setError(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Unable to place the order."
        );

      } else {

        setError(
          "Checkout failed. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  if (!isAuthenticated) {
    return (
      <div className="checkout-page">

        <div className="checkout-empty">

          <div className="checkout-icon">
            🔒
          </div>

          <h2>
            Login Required
          </h2>

          <p>
            Please login before
            proceeding to checkout.
          </p>

          <button
            className="checkout-secondary-button"
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


  if (cart.length === 0) {
    return (
      <div className="checkout-page">

        <div className="checkout-empty">

          <div className="checkout-icon">
            🛒
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add some products before
            proceeding to checkout.
          </p>

          <button
            className="checkout-secondary-button"
            onClick={() =>
              navigate("/products")
            }
          >
            Continue Shopping
          </button>

        </div>

      </div>
    );
  }


  return (
    <div className="checkout-page">

      {/* Header */}

      <div className="checkout-header">

        <h1>
          Checkout
        </h1>

        <p>
          Review your order before
          placing it.
        </p>

      </div>


      <div className="checkout-layout">

        {/* Order Items */}

        <div className="checkout-items">

          <div className="checkout-section-header">

            <h2>
              Order Items
            </h2>

            <span>
              {cart.length} item
              {cart.length !== 1
                ? "s"
                : ""}
            </span>

          </div>


          {cart.map((item) => (

            <div
              key={item.id}
              className="checkout-item"
            >

              <div className="checkout-product-icon">
                📦
              </div>


              <div className="checkout-item-info">

                <h3>
                  {item.productName}
                </h3>

                <p>
                  ₹
                  {Number(
                    item.price || 0
                  ).toLocaleString(
                    "en-IN"
                  )}

                  {" × "}

                  {item.quantity}
                </p>

              </div>


              <strong>
                ₹
                {Number(
                  item.totalPrice || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          ))}


          <button
            type="button"
            className="checkout-secondary-button"
            onClick={() =>
              navigate("/cart")
            }
            disabled={loading}
          >
            ← Back to Cart
          </button>

        </div>


        {/* Summary */}

        <div className="checkout-summary">

          <h2>
            Order Summary
          </h2>


          <div className="checkout-summary-row">

            <span>
              Subtotal
            </span>

            <span>
              ₹
              {cartTotal.toLocaleString(
                "en-IN"
              )}
            </span>

          </div>


          <div className="checkout-summary-row">

            <span>
              Shipping
            </span>

            <span className="checkout-free">
              Free
            </span>

          </div>


          <div className="checkout-divider"></div>


          <div className="checkout-grand-total">

            <span>
              Total
            </span>

            <strong>
              ₹
              {cartTotal.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>


          {error && (
            <div className="checkout-error">
              {error}
            </div>
          )}


          <button
            type="button"
            className="place-order-button"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading
              ? "Processing Order..."
              : "Place Order"}
          </button>


          <p className="secure-checkout">
            🔒 Secure checkout
          </p>

        </div>

      </div>

    </div>
  );
}

export default Checkout;