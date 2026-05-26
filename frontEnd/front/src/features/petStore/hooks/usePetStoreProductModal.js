import { useState } from "react";
import {
  fetchAdminProductDetail,
  insertStoreProduct,
  updateStoreProduct,
} from "../api/petStoreApi";

export default function usePetStoreProductModal(loadProductList, currentPage) {
  const [isOpen, setOpen] = useState(false);
  const [mode, setMode] = useState("insert");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);

  function openInsertModal() {
    setMode("insert");
    setSelectedProductId(null);
    setDetailData(null);
    setOpen(true);
  }

  async function openUpdateModal(productId) {
    setMode("update");
    setSelectedProductId(productId);
    setDetailData(null);
    setOpen(true);

    const resp = await fetchAdminProductDetail(productId);
    setDetailData(resp.data);
  }

  function closeModal() {
    setOpen(false);
    setMode("insert");
    setSelectedProductId(null);
    setDetailData(null);
  }

  async function submitProduct(formData) {
    setSubmitting(true);

    try {
      if (mode === "insert") {
        await insertStoreProduct(formData);
        alert("상품이 등록되었습니다.");
      }

      if (mode === "update") {
        await updateStoreProduct(selectedProductId, formData);
        alert("상품이 수정되었습니다.");
      }

      closeModal();
      await loadProductList(currentPage);
    } finally {
      setSubmitting(false);
    }
  }

  return {
    isOpen,
    mode,
    detailData,
    isSubmitting,
    openInsertModal,
    openUpdateModal,
    closeModal,
    submitProduct,
  };
}
