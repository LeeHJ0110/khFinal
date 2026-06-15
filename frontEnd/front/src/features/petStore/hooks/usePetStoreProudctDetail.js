import { useEffect, useState } from "react";
import { fetchProductDetail } from "../api/petStoreApi";
import { addRecentProduct } from "./useRecentProductStorage";

export default function usePetStoreProductDetail(productId) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadProductDetail() {
    if (!productId) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const resp = await fetchProductDetail(productId);

      setProduct(resp.data);

      //최근조회 상품 저장
      addRecentProduct(resp.data);
    } catch (error) {
      setProduct(null);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProductDetail();
  }, [productId]);

  return {
    product,
    isLoading,
    error,
    loadProductDetail,
  };
}
