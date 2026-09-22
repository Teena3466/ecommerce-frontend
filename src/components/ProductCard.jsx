import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const isOutOfStock =
    Number(product.quantity || 0) <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      return;
    }

    await addToCart(product);
  };

  const handleViewDetails = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="product-card">

      {/* Product Image */}

      <div className="product-card-image">
        📦
      </div>

      {/* Product Content */}

      <div className="product-card-content">

        <h3>
          {product.name}
        </h3>

        <p className="product-card-description">
          {product.description ||
            "No description available."}
        </p>

        {/* Price */}

        <div className="product-card-price">
          ₹
          {Number(
            product.price || 0
          ).toLocaleString("en-IN")}
        </div>

        {/* Stock */}

        <p
          className={
            isOutOfStock
              ? "product-stock out"
              : "product-stock"
          }
        >
          {isOutOfStock
            ? "Out of stock"
            : `${product.quantity} available`}
        </p>

        {/* Actions */}

        <div className="product-card-actions">

          <button
            type="button"
            className="view-product-button"
            onClick={handleViewDetails}
          >
            View Details
          </button>

          <button
            type="button"
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {isOutOfStock
              ? "Out of Stock"
              : "Add to Cart"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;