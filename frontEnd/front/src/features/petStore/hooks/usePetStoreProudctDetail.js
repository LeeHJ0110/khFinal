import { useEffect, useState } from "react";
import { fetchProductDetail } from "../api/petStoreApi";
import { addRecentProduct } from "./useRecentProductStorage";

export default function usePetStoreProductDetail(productId) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadProductDetail() {
    if (!productId) {
      setProduct(null);
      setError({
        response: {
          status: 404,
          data: {
            message: "잘못된 상품 주소입니다.",
          },
        },
      });
      return;
    }

    // 숫자가 아닌 상품 ID 방어
    if (!/^\d+$/.test(String(productId))) {
      setProduct(null);
      setError({
        response: {
          status: 404,
          data: {
            message: "잘못된 상품 주소입니다.",
          },
        },
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const resp = await fetchProductDetail(productId);

      if (!resp.data) {
        setProduct(null);
        setError({
          response: {
            status: 404,
            data: {
              message: "존재하지 않는 상품입니다.",
            },
          },
        });
        return;
      }

      setProduct(resp.data);

      // 최근조회 상품 저장
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
