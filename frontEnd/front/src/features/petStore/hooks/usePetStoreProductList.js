import { useEffect, useState } from "react";
import { fetchProductList } from "../api/petStoreApi";

export default function usePetStoreProductList(targetPetType, category) {
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("latest");
  const [tagId, setTagId] = useState("");
  const [tagName, setTagName] = useState("");

  async function loadProductList() {
    try {
      setIsLoading(true);

      const resp = await fetchProductList({
        targetPetType: targetPetType,
        category: category,
        keyword: keyword,
        tagId: tagId,
        tagName: tagName,
        sort: sort,
      });

      setProductList(resp.data);
    } catch (error) {
      console.error("상품 목록 조회 실패", error);
      setProductList([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSearch() {
    loadProductList();
  }

  function handleChangeSort(nextSort) {
    setSort(nextSort);
  }

  function handleChangeTagId(nextTagId) {
    setTagId(nextTagId);
  }

  function resetFilter() {
    setKeyword("");
    setTagId("");
    setTagName("");
    setSort("latest");
  }

  useEffect(() => {
    loadProductList();
  }, [targetPetType, category, sort, tagId]);

  return {
    productList,
    isLoading,

    keyword,
    setKeyword,

    sort,
    setSort,

    tagId,
    setTagId,

    tagName,
    setTagName,

    loadProductList,
    handleSearch,
    handleChangeSort,
    handleChangeTagId,
    resetFilter,
  };
}
