import usePetStoreAdminProductList from "../../features/petStore/hooks/usePetStoreAdminProductList";
import usePetStoreProductModal from "../../features/petStore/hooks/usePetStoreProductModal";
import PetStoreProductModal from "../../features/petStore/components/PetStoreProductModal";
import PetStoreAdminNav from "./PetStoreAdminNav";

export default function PetStoreAdminProductListPage() {
  const {
    productList,
    currentPage,
    totalPages,
    totalElements,
    isLoading,
    loadProductList,
    handleStop,
    handleResume,
  } = usePetStoreAdminProductList();

  const {
    isOpen,
    mode,
    detailData,
    isSubmitting,
    openInsertModal,
    openUpdateModal,
    closeModal,
    submitProduct,
  } = usePetStoreProductModal(loadProductList, currentPage);

  return (
    <>
      <PetStoreAdminNav />

      <div className="pet-store-admin-page">
        <div className="pet-store-admin-header">
          <div>
            <h2>상품관리</h2>
            <p>총 {totalElements}개 상품</p>
          </div>

          <button type="button" onClick={openInsertModal}>
            상품등록 +
          </button>
        </div>

        {isLoading ? (
          <div>상품 목록을 불러오는 중입니다...</div>
        ) : (
          <table className="pet-store-admin-table">
            <thead>
              <tr>
                <th>상품ID</th>
                <th>이미지</th>
                <th>상품명</th>
                <th>카테고리</th>
                <th>대상동물</th>
                <th>가격</th>
                <th>판매상태</th>
                <th>조회수</th>
                <th>관리</th>
              </tr>
            </thead>

            <tbody>
              {productList.map((product) => (
                <tr key={product.productId}>
                  <td>{product.productId}</td>
                  <td>
                    {product.thumbnailUrl ? (
                      <img
                        src={product.thumbnailUrl}
                        alt={product.productName}
                        className="pet-store-admin-thumbnail"
                      />
                    ) : (
                      <div className="pet-store-admin-no-image">NO IMG</div>
                    )}
                  </td>
                  <td>{product.productName}</td>
                  <td>{product.productCategory}</td>
                  <td>
                    {product.productTargetPetType === "D" ? "강아지" : "고양이"}
                  </td>
                  <td>{product.productPrice?.toLocaleString()}원</td>
                  <td>
                    {product.productSaleYn === "Y" ? "판매중" : "판매중지"}
                  </td>
                  <td>{product.productViewCount}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => openUpdateModal(product.productId)}
                    >
                      수정
                    </button>

                    {product.productSaleYn === "Y" ? (
                      <button
                        type="button"
                        onClick={() => handleStop(product.productId)}
                      >
                        판매중지
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleResume(product.productId)}
                      >
                        판매재개
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="pet-store-pagination">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              type="button"
              disabled={currentPage === index}
              onClick={() => loadProductList(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {isOpen && (
          <PetStoreProductModal
            mode={mode}
            detailData={detailData}
            isSubmitting={isSubmitting}
            onClose={closeModal}
            onSubmit={submitProduct}
          />
        )}
      </div>
    </>
  );
}
