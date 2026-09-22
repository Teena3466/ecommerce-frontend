import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError("");

        const response = await api.get("/products");

        setProducts(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch products:",
          error
        );

        setError(
          "Unable to load products."
        );
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) => {
      const productName =
        product.name?.toLowerCase() || "";

      const matchesSearch =
        productName.includes(
          search.toLowerCase()
        );

      const matchesPrice =
        maxPrice === "" ||
        product.price <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesPrice
      );
    }
  );

  const clearFilters = () => {
    setSearch("");
    setMaxPrice("");
  };

  return (
    <div className="products-page">

      {/* ================= HEADER ================= */}

      <div className="products-header">

        <div>

          <h1>
            Our Products
          </h1>

          <p>
            Explore our products and find what you need.
          </p>

        </div>

        <div className="products-count">

          {filteredProducts.length} product
          {filteredProducts.length !== 1
            ? "s"
            : ""}

        </div>

      </div>

      {/* ================= ERROR ================= */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* ================= FILTERS ================= */}

      <div className="products-controls">

        <input
          type="text"
          className="products-search"
          placeholder="🔍  Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <input
          type="number"
          className="products-price-filter"
          min="0"
          placeholder="₹ Maximum price"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(e.target.value)
          }
        />

        {(search || maxPrice) && (
          <button
            type="button"
            className="clear-filter-button"
            onClick={clearFilters}
          >
            Clear
          </button>
        )}

      </div>

      {/* ================= LOADING ================= */}

      {products.length === 0 && !error && (
        <div className="loading-message">

          <p>
            Loading products...
          </p>

        </div>
      )}

      {/* ================= NO PRODUCTS ================= */}

      {products.length > 0 &&
        filteredProducts.length === 0 && (
          <div className="empty-products">

            <div className="empty-icon">
              🔎
            </div>

            <h3>
              No products found
            </h3>

            <p>
              Try changing your search or
              price filter.
            </p>

            <button
              type="button"
              className="clear-filter-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

          </div>
        )}

      {/* ================= PRODUCTS ================= */}

      {filteredProducts.length > 0 && (
        <div className="products-grid">

          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}

        </div>
      )}

    </div>
  );
}

export default Products;