import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  deleteWishProductByProductId,
  insertWishProduct,
} from "../api/petStoreApi";

export default function usePetStoreWishToggle() {
  const navigate = useNavigate();
  const location = useLocation();

  const [wishSubmittingId, setWishSubmittingId] = useState(null);

  function moveToLoginWithRedirect() {
    const currentPath = location.pathname + location.search + location.hash;

    alert("로그인이 필요한 서비스입니다.");
    navigate(`/member/login?redirect=${encodeURIComponent(currentPath)}`);
  }

  function hasLoginInfo() {
    const storageList = [localStorage, sessionStorage];

    for (const storage of storageList) {
      for (let i = 0; i < storage.length; i += 1) {
        const key = storage.key(i);
        const value = storage.getItem(key);

        if (!key || !value) {
          continue;
        }

        const lowerKey = key.toLowerCase();
        const lowerValue = value.toLowerCase();

        const keyLooksLikeLogin =
          lowerKey.includes("token") ||
          lowerKey.includes("jwt") ||
          lowerKey.includes("authorization") ||
          lowerKey.includes("auth") ||
          lowerKey.includes("login") ||
          lowerKey.includes("member") ||
          lowerKey.includes("user");

        const valueLooksLikeLogin =
          lowerValue.includes("bearer ") ||
          lowerValue.includes("access") ||
          lowerValue.includes("refresh") ||
          lowerValue.includes("token") ||
          lowerValue.includes("jwt") ||
          lowerValue.includes("role") ||
          lowerValue.includes("username") ||
          lowerValue.includes("nickname");

        const valueLooksLikeJwt =
          /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(value);

        if (keyLooksLikeLogin || valueLooksLikeLogin || valueLooksLikeJwt) {
          return true;
        }
      }
    }

    return false;
  }

  function isAuthError(error) {
    const status =
      error?.response?.status ??
      error?.status ??
      error?.response?.data?.status ??
      "";

    const code =
      error?.response?.data?.code ??
      error?.response?.data?.errorCode ??
      error?.response?.data?.error ??
      "";

    const message =
      error?.response?.data?.message ??
      error?.response?.data ??
      error?.message ??
      "";

    const statusText = String(status);
    const codeText = String(code).toUpperCase();
    const messageText = String(message).toUpperCase();

    return (
      statusText === "401" ||
      statusText === "403" ||
      codeText.includes("401") ||
      codeText.includes("403") ||
      codeText.includes("UNAUTHORIZED") ||
      codeText.includes("FORBIDDEN") ||
      messageText.includes("401") ||
      messageText.includes("403") ||
      messageText.includes("UNAUTHORIZED") ||
      messageText.includes("FORBIDDEN") ||
      messageText.includes("LOGIN") ||
      messageText.includes("로그인")
    );
  }

  async function handleToggleWishlist(evt, product, onSuccess) {
    evt.stopPropagation();

    if (!product?.productId) {
      alert("상품 정보를 찾을 수 없습니다.");
      return;
    }

    if (!hasLoginInfo()) {
      moveToLoginWithRedirect();
      return;
    }

    try {
      setWishSubmittingId(product.productId);

      if (product.wished) {
        await deleteWishProductByProductId(product.productId);

        onSuccess?.({
          ...product,
          wished: false,
          wishlistId: null,
        });

        return;
      }

      await insertWishProduct({
        productId: product.productId,
      });

      onSuccess?.({
        ...product,
        wished: true,
      });
    } catch (error) {
      console.error("관심상품 토글 실패", error);

      if (isAuthError(error)) {
        moveToLoginWithRedirect();
        return;
      }

      const message =
        error?.response?.data?.message || error?.response?.data || "";

      if (typeof message === "string" && message.includes("이미 관심상품")) {
        onSuccess?.({
          ...product,
          wished: true,
        });

        alert("이미 관심상품에 등록된 상품입니다.");
        return;
      }

      alert("관심상품 처리에 실패했습니다.");
    } finally {
      setWishSubmittingId(null);
    }
  }

  return {
    wishSubmittingId,
    handleToggleWishlist,
  };
}
