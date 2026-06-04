import { useEffect, useState } from "react";
import {
  fetchCartList,
  deleteCartProduct,
  updateCartProductQty,
} from "../api/petStoreOrderApi";

export default function usePetStoreCartList() {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function loadCartList() {
    setIsLoading(true);

    try {
      const response = await fetchCartList();
      setCart(response.data);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteCartItem(cartItemId) {
    await deleteCartProduct(cartItemId);
    await loadCartList();
  }

  async function handleUpdateQty(cartItemId, qty) {
    await updateCartProductQty({
      cartItemId,
      qty,
    });

    await loadCartList();
  }

  useEffect(() => {
    loadCartList();
  }, []);

  return {
    cart,
    isLoading,
    loadCartList,
    handleDeleteCartItem,
    handleUpdateQty,
  };
}
