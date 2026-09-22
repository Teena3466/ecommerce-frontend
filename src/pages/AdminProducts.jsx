import { useEffect, useState } from "react";
import api from "../services/api";

function AdminProducts() {
  const emptyForm = {
    name: "",
    price: "",
    quantity: "",
    description: "",
  };

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");

      setProducts(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch products:",
        error
      );

      if (error.response?.status === 403) {
        setError(
          "You do not have permission to manage products."
        );
      } else if (error.response?.status === 401) {
        setError(
          "Please login as an admin."
        );
      } else {
        setError(
          "Unable to load products."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };


  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const productData = {
        name: form.name.trim(),
        price: Number(form.price),
        quantity: Number(form.quantity),
        description: form.description.trim(),
      };

      if (editingId) {
        await api.put(
          `/products/${editingId}`,
          productData
        );

        setSuccess(
          "Product updated successfully."
        );
      } else {
        await api.post(
          "/products",
          productData
        );

        setSuccess(
          "Product added successfully."
        );
      }

      setForm(emptyForm);
      setEditingId(null);

      await fetchProducts();

    } catch (error) {
      console.error(
        "Failed to save product:",
        error
      );

      if (error.response?.status === 403) {
        setError(
          "You do not have permission to modify products."
        );
      } else if (error.response?.status === 400) {
        setError(
          error.response?.data?.message ||
            "Please enter valid product details."
        );
      } else {
        setError(
          "Unable to save product."
        );
      }
    } finally {
      setSaving(false);
    }
  };


  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name || "",
      price: product.price ?? "",
      quantity: product.quantity ?? "",
      description:
        product.description || "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const handleDelete = async (productId) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(
        `/products/${productId}`
      );

      setSuccess(
        "Product deleted successfully."
      );

      if (editingId === productId) {
        setForm(emptyForm);
        setEditingId(null);
      }

      await fetchProducts();

    } catch (error) {
      console.error(
        "Failed to delete product:",
        error
      );

      if (error.response?.status === 403) {
        setError(
          "You do not have permission to delete products."
        );
      } else if (error.response?.status === 404) {
        setError(
          "Product not found."
        );
      } else {
        setError(
          "Unable to delete product."
        );
      }
    }
  };


  const clearSearch = () => {
    setSearch("");
  };


  const filteredProducts = products.filter(
    (product) => {
      const productName =
        product.name?.toLowerCase() || "";

      const productDescription =
        product.description?.toLowerCase() || "";

      const searchValue =
        search.toLowerCase().trim();

      return (
        productName.includes(searchValue) ||
        productDescription.includes(searchValue)
      );
    }
  );


  if (loading) {
    return (
      <div className="admin-products-page">

        <div className="admin-products-header">

          <div>

            <span className="admin-products-label">
              ADMIN PANEL
            </span>

            <h1>
              Product Management
            </h1>

            <p>
              Add, update, and manage your
              store products.
            </p>

          </div>

        </div>

        <div className="loading-message">

          <p>
            Loading products...
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="admin-products-page">

      {/* PAGE HEADER */}

      <div className="admin-products-header">

        <div>

          <span className="admin-products-label">
            ADMIN PANEL
          </span>

          <h1>
            Product Management
          </h1>

          <p>
            Add, update, and manage your
            store products.
          </p>

        </div>


        <div className="admin-products-count">

          {products.length} product
          {products.length !== 1
            ? "s"
            : ""}

        </div>

      </div>


      {/* ERROR */}

      {error && (
        <div className="admin-products-error">
          {error}
        </div>
      )}


      {/* SUCCESS */}

      {success && (
        <div className="admin-products-success">
          {success}
        </div>
      )}


      <div className="admin-products-layout">

        {/* =========================
            PRODUCT FORM
        ========================= */}

        <div className="admin-product-form-card">

          <div className="admin-product-form-header">

            <div>

              <span className="admin-product-form-label">

                {editingId
                  ? "EDIT PRODUCT"
                  : "NEW PRODUCT"}

              </span>

              <h2>

                {editingId
                  ? "Update Product"
                  : "Add Product"}

              </h2>

            </div>


            {editingId && (

              <button
                type="button"
                className="admin-cancel-edit-button"
                onClick={resetForm}
              >
                Cancel
              </button>

            )}

          </div>


          <form
            onSubmit={handleSubmit}
            className="admin-product-form"
          >

            {/* Product Name */}

            <div className="admin-form-group">

              <label htmlFor="admin-product-name">
                Product Name
              </label>

              <input
                id="admin-product-name"
                name="name"
                type="text"
                placeholder="Enter product name"
                value={form.name}
                onChange={handleChange}
                required
              />

            </div>


            {/* Price + Quantity */}

            <div className="admin-form-row">

              <div className="admin-form-group">

                <label htmlFor="admin-product-price">
                  Price
                </label>

                <input
                  id="admin-product-price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Enter price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />

              </div>


              <div className="admin-form-group">

                <label htmlFor="admin-product-quantity">
                  Quantity
                </label>

                <input
                  id="admin-product-quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Enter stock"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>


            {/* Description */}

            <div className="admin-form-group">

              <label htmlFor="admin-product-description">
                Description
              </label>

              <textarea
                id="admin-product-description"
                name="description"
                placeholder="Enter product description"
                value={form.description}
                onChange={handleChange}
                rows="4"
              />

            </div>


            {/* Submit */}

            <button
              type="submit"
              className="admin-save-product-button"
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : editingId
                ? "Update Product"
                : "Add Product"}

            </button>

          </form>

        </div>


        {/* =========================
            PRODUCT LIST
        ========================= */}

        <div className="admin-products-list-section">

          <div className="admin-products-list-header">

            <div>

              <span className="admin-product-form-label">
                INVENTORY
              </span>

              <h2>
                All Products
              </h2>

            </div>

          </div>


          {/* SEARCH */}

          <div className="admin-products-search">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (

              <button
                type="button"
                className="admin-clear-search-button"
                onClick={clearSearch}
              >
                Clear
              </button>

            )}

          </div>


          {/* PRODUCT COUNT AFTER SEARCH */}

          {search && (
            <p className="admin-search-result-text">

              Showing{" "}
              <strong>
                {filteredProducts.length}
              </strong>{" "}
              of{" "}
              <strong>
                {products.length}
              </strong>{" "}
              products

            </p>
          )}


          {/* EMPTY INVENTORY */}

          {products.length === 0 ? (

            <div className="admin-products-empty">

              <div className="admin-products-icon">
                📦
              </div>

              <h3>
                No products found
              </h3>

              <p>
                Add your first product using
                the form.
              </p>

            </div>

          ) : filteredProducts.length === 0 ? (

            /* NO SEARCH RESULTS */

            <div className="admin-products-empty">

              <div className="admin-products-icon">
                🔎
              </div>

              <h3>
                No matching products
              </h3>

              <p>
                Try searching with a different
                product name or description.
              </p>

              <button
                type="button"
                className="admin-clear-search-main-button"
                onClick={clearSearch}
              >
                Clear Search
              </button>

            </div>

          ) : (

            <div className="admin-products-list">

              {filteredProducts.map(
                (product) => (

                  <div
                    key={product.id}
                    className="admin-product-card"
                  >

                    {/* ICON */}

                    <div className="admin-product-icon">
                      📦
                    </div>


                    {/* INFORMATION */}

                    <div className="admin-product-info">

                      <div className="admin-product-title-row">

                        <h3>
                          {product.name}
                        </h3>


                        {product.quantity <= 0 && (

                          <span className="admin-out-of-stock">
                            OUT OF STOCK
                          </span>

                        )}

                      </div>


                      <p>
                        {product.description ||
                          "No description available."}
                      </p>


                      <div className="admin-product-meta">

                        <strong>
                          ₹
                          {Number(
                            product.price || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>


                        <span>
                          Stock:{" "}
                          {product.quantity}
                        </span>

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="admin-product-actions">

                      <button
                        type="button"
                        className="admin-edit-product-button"
                        onClick={() =>
                          handleEdit(product)
                        }
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        className="admin-delete-product-button"
                        onClick={() =>
                          handleDelete(
                            product.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminProducts;