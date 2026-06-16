import { useEffect, useState } from "react";
import { fetchProductList } from "../api/petStoreApi";

export default function usePetStoreProductList(targetPetType, category) {
  const [productList, setProductList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("latest");
  const [tagId, setTagId] = useState("");

  async function loadProductList({
    nextKeyword = keyword,
    nextSort = sort,
    nextTagId = tagId,
  } = {}) {
    setLoading(true);

    try {
      const response = await fetchProductList({
        targetPetType,
        category,
        keyword: nextKeyword,
        tagId: nextTagId,
        sort: nextSort,
      });

      setProductList(response.data ?? []);
    } catch (error) {
      setProductList([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    loadProductList({
      nextKeyword: keyword,
      nextSort: sort,
      nextTagId: tagId,
    });
  }

  function handleChangeSort(nextSort) {
    setSort(nextSort);

    loadProductList({
      nextKeyword: keyword,
      nextSort,
      nextTagId: tagId,
    });
  }

  function handleChangeTagId(nextTagId) {
    setTagId(nextTagId);

    loadProductList({
      nextKeyword: keyword,
      nextSort: sort,
      nextTagId,
    });
  }

  function updateProductWishState(productId, wished) {
    setProductList((prev) =>
      prev.map((product) =>
        product.productId === productId
          ? {
              ...product,
              wished,
            }
          : product,
      ),
    );
  }

  useEffect(() => {
    loadProductList({
      nextKeyword: "",
      nextSort: "latest",
      nextTagId: "",
    });
  }, [targetPetType, category]);

  return {
    productList,
    isLoading,

    keyword,
    setKeyword,

    sort,
    tagId,

    loadProductList,
    updateProductWishState,

    handleSearch,
    handleChangeSort,
    handleChangeTagId,
  };
}
