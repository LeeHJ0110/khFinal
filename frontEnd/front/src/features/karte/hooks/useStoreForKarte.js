import { useState } from "react";
import { fetchProductList } from "../../petStore/api/petStoreApi";

export default function useStoreForKarte() {
  const [productList, setProductList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  async function loadProductList({ targetPetType, tagId, category } = {}) {
    setLoading(true);
    try {
      const response = await fetchProductList({
        targetPetType: targetPetType,
        category: category,
        keyword: "",
        tagId: tagId,
        sort: "popular",
      });

      setProductList(response.data ?? []);
    } catch (error) {
      console.error("상품 목록 조회 실패", error);
      setProductList([]);
    } finally {
      setLoading(false);
    }
  }
  return { productList, isLoading, loadProductList };
}
