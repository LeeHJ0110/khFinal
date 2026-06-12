const RECENT_PRODUCT_STORAGE_KEY = "petStoreRecentProducts";
const MAX_RECENT_PRODUCT_COUNT = 5;

export function getRecentProducts() {
  try {
    const savedValue = localStorage.getItem(RECENT_PRODUCT_STORAGE_KEY);

    if (!savedValue) {
      return [];
    }

    const parsedValue = JSON.parse(savedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue;
  } catch (error) {
    console.error("최근 본 상품 조회 실패", error);
    return [];
  }
}

export function addRecentProduct(product) {
  if (!product || !product.productId) {
    return;
  }

  const recentProduct = {
    productId: product.productId,
    productName: product.productName,
    productPrice: product.productPrice,
    mainImageUrl: product.mainImageUrl,
    tagName: product.tagName,
  };

  const prevProducts = getRecentProducts();

  const filteredProducts = prevProducts.filter(
    (item) => Number(item.productId) !== Number(recentProduct.productId),
  );

  const nextProducts = [recentProduct, ...filteredProducts].slice(
    0,
    MAX_RECENT_PRODUCT_COUNT,
  );

  localStorage.setItem(
    RECENT_PRODUCT_STORAGE_KEY,
    JSON.stringify(nextProducts),
  );

  window.dispatchEvent(new Event("petStoreRecentProductsChanged"));
}

export function removeRecentProduct(productId) {
  const prevProducts = getRecentProducts();

  const nextProducts = prevProducts.filter(
    (item) => Number(item.productId) !== Number(productId),
  );

  localStorage.setItem(
    RECENT_PRODUCT_STORAGE_KEY,
    JSON.stringify(nextProducts),
  );

  window.dispatchEvent(new Event("petStoreRecentProductsChanged"));
}

export function clearRecentProducts() {
  localStorage.removeItem(RECENT_PRODUCT_STORAGE_KEY);

  window.dispatchEvent(new Event("petStoreRecentProductsChanged"));
}
