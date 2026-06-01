import { useEffect, useState } from "react";
import { fetchProductDetail } from "../api/petStoreApi";

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
    } catch (error) {
      console.error("상품 상세 조회 실패", error);
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
