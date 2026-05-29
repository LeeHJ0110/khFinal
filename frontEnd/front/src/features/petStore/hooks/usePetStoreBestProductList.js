import { useEffect, useState } from "react";
import { fetchBestProductList } from "../api/petStoreApi";

export default function usePetStoreBestProductList(targetPetType) {
  const [bestProductList, setBestProductList] = useState([]);
  const [isBestLoading, setIsBestLoading] = useState(false);

  async function loadBestProductList() {
    try {
      setIsBestLoading(true);

      const resp = await fetchBestProductList(targetPetType);

      setBestProductList(resp.data);
    } catch (error) {
      console.error("베스트 상품 조회 실패", error);
      setBestProductList([]);
    } finally {
      setIsBestLoading(false);
    }
  }

  useEffect(() => {
    loadBestProductList();
  }, [targetPetType]);

  return {
    bestProductList,
    isBestLoading,
    loadBestProductList,
  };
}
