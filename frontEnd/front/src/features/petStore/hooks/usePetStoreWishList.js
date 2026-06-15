import { useEffect, useMemo, useState } from "react";
import { deleteWishProduct, fetchWishList } from "../api/petStoreApi";

function normalizeWishPage(responseData) {
  // 백엔드가 Page로 오는 경우
  if (Array.isArray(responseData?.content)) {
    return {
      wishList: responseData.content,
      totalElements: responseData.totalElements ?? responseData.content.length,
      totalPages: responseData.totalPages ?? 1,
      currentPage: responseData.number ?? 0,
    };
  }

  // 백엔드가 아직 List로 오는 경우
  if (Array.isArray(responseData)) {
    return {
      wishList: responseData,
      totalElements: responseData.length,
      totalPages: 1,
      currentPage: 0,
    };
  }

  return {
    wishList: [],
    totalElements: 0,
    totalPages: 1,
    currentPage: 0,
  };
}

export default function usePetStoreWishList() {
  const [wishPage, setWishPage] = useState({
    wishList: [],
    totalElements: 0,
    totalPages: 1,
    currentPage: 0,
  });

  const [page, setPage] = useState(0);
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const wishList = useMemo(() => {
    return wishPage.wishList ?? [];
  }, [wishPage]);

  async function loadWishList(nextPage = page, nextCategory = category) {
    setIsLoading(true);

    try {
      const response = await fetchWishList({
        page: nextPage,
        category: nextCategory || undefined,
      });

      const normalized = normalizeWishPage(response.data);
      setWishPage(normalized);
    } catch (error) {
      setWishPage({
        wishList: [],
        totalElements: 0,
        totalPages: 1,
        currentPage: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteWish(wishlistId) {
    await deleteWishProduct(wishlistId);

    const nextPage = wishList.length === 1 && page > 0 ? page - 1 : page;

    if (nextPage !== page) {
      setPage(nextPage);
      await loadWishList(nextPage, category);
      return;
    }

    await loadWishList(page, category);
  }

  function handleChangeCategory(nextCategory) {
    setCategory(nextCategory);
    setPage(0);
  }

  function handleChangePage(nextPage) {
    setPage(nextPage);
  }

  useEffect(() => {
    loadWishList(page, category);
  }, [page, category]);

  return {
    wishPage,
    wishList,
    totalElements: wishPage.totalElements,
    totalPages: wishPage.totalPages,
    currentPage: wishPage.currentPage,

    page,
    category,
    isLoading,

    setPage,
    setCategory,
    loadWishList,
    handleDeleteWish,
    handleChangePage,
    handleChangeCategory,
  };
}
