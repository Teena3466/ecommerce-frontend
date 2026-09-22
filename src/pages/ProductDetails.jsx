import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/products/${id}`
        );

        setProduct(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch product:",
          error
        );

        if (error.response?.status === 404) {
          setError("Product not found.");
        } else {
          setError(
            "Unable to load product details."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    if (Number(product.quantity || 0) <= 0) {
      return;
    }

    if (!isAuthenticated) {
      alert(
        "Please login before adding products to cart."
      );

      navigate("/login");

      return;
    }

    await addToCart(product);
  };

  const handleBuyNow = async () => {
    if (!product) {
      return;
    }

    if (Number(product.quantity || 0) <= 0) {
      return;
    }

    if (!isAuthenticated) {
      alert(
        "Please login before buying a product."
      );

      navigate("/login");

      return;
    }

    const addedSuccessfully =
      await addToCart(product);

    if (!addedSuccessfully) {
      return;
    }

    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="product-details-page">

        <div className="loading-message">

          <p>
            Loading product details...
          </p>

        </div>

      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page">

        <div className="product-details-error">

          <div className="product-details-icon">
            📦
          </div>

          <h2>
            {error || "Product not found."}
          </h2>

          <button
            type="button"
            className="checkout-button"
            onClick={() =>
              navigate("/products")
            }
          >
            Back to Products
          </button>

        </div>

      </div>
    );
  }

  const isOutOfStock =
    Number(product.quantity || 0) <= 0;

  return (
    <div className="product-details-page">

      {/* Back Button */}

      <button
        type="button"
        className="back-products-button"
        onClick={() =>
          navigate("/products")
        }
      >
        ← Back to Products
      </button>

      {/* Product */}

      <div className="product-details-card">

        {/* Product Image */}

        <div className="product-details-image">
          📦
        </div>

        {/* Product Information */}

        <div className="product-details-info">

          <span className="product-details-label">
            PRODUCT DETAILS
          </span>

          <h1>
            {product.name}
          </h1>

          <p className="product-details-description">
            {product.description ||
              "No description available for this product."}
          </p>

          <div className="product-details-price">

            ₹
            {Number(
              product.price || 0
            ).toLocaleString("en-IN")}

          </div>

          <div
            className={
              isOutOfStock
                ? "product-details-stock out"
                : "product-details-stock"
            }
          >
            {isOutOfStock
              ? "Out of stock"
              : `${product.quantity} available`}
          </div>

          <div className="product-details-actions">

            <button
              type="button"
              className="view-product-button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              {isOutOfStock
                ? "Out of Stock"
                : "Add to Cart"}
            </button>

            <button
              type="button"
              className="add-to-cart-button"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
              {isOutOfStock
                ? "Unavailable"
                : "Buy Now"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;