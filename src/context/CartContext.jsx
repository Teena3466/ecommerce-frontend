import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/cart");

      setCart(response.data);
    } catch (error) {
      console.error(
        "Failed to fetch cart:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setCart([]);
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCart();
  }, []);


  const addToCart = async (product) => {
    try {
      await api.post("/cart", {
        productId: product.id,
        quantity: 1,
      });

      await fetchCart();

      // Return true so the calling component
      // knows that adding to cart succeeded.
      return true;

    } catch (error) {
      console.error(
        "Failed to add product to cart:",
        error
      );

      if (error.response?.status === 401) {
        alert(
          "Please login before adding products to cart."
        );
      } else {
        alert(
          "Unable to add product to cart."
        );
      }

      // Return false when adding fails.
      return false;
    }
  };


  const increaseQuantity = async (
    cartId,
    currentQuantity
  ) => {
    try {
      await api.put(
        `/cart/${cartId}?quantity=${currentQuantity + 1}`
      );

      await fetchCart();

      return true;

    } catch (error) {
      console.error(
        "Failed to increase quantity:",
        error
      );

      alert(
        "Unable to update quantity."
      );

      return false;
    }
  };


  const decreaseQuantity = async (
    cartId,
    currentQuantity
  ) => {
    try {
      if (currentQuantity === 1) {
        await api.delete(
          `/cart/${cartId}`
        );
      } else {
        await api.put(
          `/cart/${cartId}?quantity=${currentQuantity - 1}`
        );
      }

      await fetchCart();

      return true;

    } catch (error) {
      console.error(
        "Failed to decrease quantity:",
        error
      );

      alert(
        "Unable to update quantity."
      );

      return false;
    }
  };


  const removeFromCart = async (cartId) => {
    try {
      await api.delete(
        `/cart/${cartId}`
      );

      await fetchCart();

      return true;

    } catch (error) {
      console.error(
        "Failed to remove cart item:",
        error
      );

      alert(
        "Unable to remove item."
      );

      return false;
    }
  };


  const clearCart = async () => {
    try {
      setLoading(true);

      // Save the current cart before clearing
      // the UI.
      const currentCart = [...cart];

      // Immediately update the UI.
      setCart([]);

      // Delete all items from backend.
      for (const item of currentCart) {
        await api.delete(
          `/cart/${item.id}`
        );
      }

      return true;

    } catch (error) {
      console.error(
        "Failed to clear cart:",
        error
      );

      // Reload the actual backend cart
      // if deletion fails.
      await fetchCart();

      alert(
        "Unable to clear cart."
      );

      return false;

    } finally {
      setLoading(false);
    }
  };


  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


export function useCart() {
  return useContext(CartContext);
}