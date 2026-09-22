import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Cart() {
  const navigate = useNavigate();

  const {
    cart,
    loading,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const { isAuthenticated } = useAuth();

  const cartTotal = cart.reduce(
    (total, item) =>
      total + Number(item.totalPrice || 0),
    0
  );


  if (!isAuthenticated) {
    return (
      <div className="cart-page">

        <div className="cart-header">
          <h1>Your Cart</h1>
        </div>

        <div className="cart-error">

          <div className="cart-empty-icon">
            🔒
          </div>

          <h3>
            Please login to view your cart.
          </h3>

          <button
            className="checkout-button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

        </div>

      </div>
    );
  }


  if (loading && cart.length === 0) {
    return (
      <div className="cart-page">

        <div className="cart-header">
          <h1>Your Cart</h1>
        </div>

        <div className="loading-message">
          <p>
            Loading your cart...
          </p>
        </div>

      </div>
    );
  }


  if (cart.length === 0) {
    return (
      <div className="cart-page">

        <div className="cart-header">
          <h1>Your Cart</h1>
        </div>

        <div className="empty-cart">

          <div className="cart-empty-icon">
            🛒
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Looks like you haven't added
            anything to your cart yet.
          </p>

          <button
            className="continue-shopping-button"
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


  const handleIncrease = async (
    cartId,
    currentQuantity
  ) => {
    await increaseQuantity(
      cartId,
      currentQuantity
    );
  };


  const handleDecrease = async (
    cartId,
    currentQuantity
  ) => {
    await decreaseQuantity(
      cartId,
      currentQuantity
    );
  };


  const handleRemove = async (cartId) => {
    await removeFromCart(cartId);
  };


  return (
    <div className="cart-page">

      {/* Header */}

      <div className="cart-header">

        <div>

          <h1>
            Your Cart
          </h1>

          <p>
            {cart.length} item
            {cart.length !== 1
              ? "s"
              : ""}{" "}
            in your cart
          </p>

        </div>

      </div>


      <div className="cart-layout">

        {/* Cart Items */}

        <div className="cart-items-section">

          {cart.map((item) => (

            <div
              key={item.id}
              className="cart-item-card"
            >

              <div className="cart-product-icon">
                📦
              </div>


              <div className="cart-item-details">

                <h3>
                  {item.productName}
                </h3>


                <p className="cart-item-price">
                  ₹
                  {Number(
                    item.price || 0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </p>


                <div className="quantity-section">

                  <span>
                    Quantity
                  </span>


                  <div className="quantity-controls">

                    <button
                      type="button"
                      onClick={() =>
                        handleDecrease(
                          item.id,
                          item.quantity
                        )
                      }
                      disabled={loading}
                    >
                      −
                    </button>


                    <span>
                      {item.quantity}
                    </span>


                    <button
                      type="button"
                      onClick={() =>
                        handleIncrease(
                          item.id,
                          item.quantity
                        )
                      }
                      disabled={loading}
                    >
                      +
                    </button>

                  </div>

                </div>

              </div>


              <div className="cart-item-right">

                <p className="cart-item-total">

                  ₹
                  {Number(
                    item.totalPrice || 0
                  ).toLocaleString(
                    "en-IN"
                  )}

                </p>


                <button
                  type="button"
                  className="remove-item-button"
                  onClick={() =>
                    handleRemove(item.id)
                  }
                  disabled={loading}
                >
                  Remove
                </button>

              </div>

            </div>

          ))}


          <button
            type="button"
            className="continue-shopping-button secondary"
            onClick={() =>
              navigate("/products")
            }
          >
            ← Continue Shopping
          </button>

        </div>


        {/* Order Summary */}

        <div className="cart-summary">

          <h2>
            Order Summary
          </h2>


          <div className="summary-row">

            <span>
              Items
            </span>

            <span>
              {cart.length}
            </span>

          </div>


          <div className="summary-row">

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


          <div className="summary-row">

            <span>
              Shipping
            </span>

            <span className="free-shipping">
              Free
            </span>

          </div>


          <div className="summary-divider"></div>


          <div className="summary-total">

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


          <button
            type="button"
            className="checkout-button"
            onClick={() =>
              navigate("/checkout")
            }
            disabled={loading}
          >
            Proceed to Checkout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Cart;