import { useEffect, useMemo, useState } from "react";
import { fetchProductReviewList } from "../api/petStoreReviewApi";

export default function usePetStoreProductReviewList(productId) {
  const [summary, setSummary] = useState(null);
  const [reviewPage, setReviewPage] = useState(null);
  const [reviewList, setReviewList] = useState([]);
  const [galleryImageList, setGalleryImageList] = useState([]);

  const [page, setPage] = useState(0);
  const [sort, setSort] = useState("latest");
  const [isLoading, setIsLoading] = useState(false);

  const previewImageList = useMemo(() => {
    return galleryImageList.slice(0, 6);
  }, [galleryImageList]);

  async function loadProductReviewList(
    nextPage = page,
    nextSort = sort,
    options = { loadGallery: false },
  ) {
    if (!productId) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetchProductReviewList({
        productId,
        page: nextPage,
        sort: nextSort,
      });

      console.log("상품 리뷰 응답:", response.data);

      const data = response.data ?? {};
      const nextSummary = data.summary ?? null;
      const nextReviewPage = data.reviewPage ?? null;
      const nextReviewList = nextReviewPage?.content ?? [];

      setSummary(nextSummary);
      setReviewPage(nextReviewPage);
      setReviewList(nextReviewList);
      setPage(nextPage);
      setSort(nextSort);

      if (options.loadGallery) {
        await loadAllReviewImages(nextReviewPage);
      }
    } catch (error) {
      console.error("상품 리뷰 목록 조회 실패:", error);
      alert("상품 리뷰를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  async function loadAllReviewImages(firstReviewPage) {
    if (!productId) {
      return;
    }

    const totalPages = firstReviewPage?.totalPages ?? 0;

    if (totalPages <= 0) {
      setGalleryImageList([]);
      return;
    }

    const allReviewList = [];

    for (let pageNumber = 0; pageNumber < totalPages; pageNumber += 1) {
      const response = await fetchProductReviewList({
        productId,
        page: pageNumber,
        sort: "latest",
      });

      const content = response.data?.reviewPage?.content ?? [];
      allReviewList.push(...content);
    }

    const imageList = allReviewList.flatMap((review) => {
      const createdAt = review.createdAt ?? "";
      const reviewId = review.reviewId;
      const imageUrlList =
        review.reviewImageUrlList ?? review.imageUrlList ?? [];

      return imageUrlList.map((url, index) => ({
        url,
        reviewId,
        createdAt,
        sortOrder: index,
      }));
    });

    setGalleryImageList(imageList);
  }

  function handleChangeSort(nextSort) {
    loadProductReviewList(0, nextSort, { loadGallery: false });
  }

  function handleMovePage(nextPage) {
    loadProductReviewList(nextPage, sort, { loadGallery: false });
  }

  useEffect(() => {
    setPage(0);
    setSort("latest");
    setSummary(null);
    setReviewPage(null);
    setReviewList([]);
    setGalleryImageList([]);

    loadProductReviewList(0, "latest", { loadGallery: true });
  }, [productId]);

  return {
    summary,
    reviewPage,
    reviewList,
    galleryImageList,
    previewImageList,

    page,
    sort,
    isLoading,

    loadProductReviewList,
    handleChangeSort,
    handleMovePage,
  };
}
