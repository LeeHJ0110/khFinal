import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import usePetStoreAdminProductList from "../../features/petStore/hooks/usePetStoreAdminProductList";
import usePetStoreProductModal from "../../features/petStore/hooks/usePetStoreProductModal";
import PetStoreProductModal from "../../features/petStore/components/PetStoreProductModal";
import PetStoreAdminNav from "./PetStoreAdminNav";

const PAGE_GROUP_SIZE = 10;

export default function PetStoreAdminProductListPage() {
  const navigate = useNavigate();

  const {
    productList,
    currentPage,
    totalPages,
    totalElements,
    isLoading,

    searchCondition,
    statusCounts,

    handleChangeSearchCondition,
    handleSearch,
    handleClickSaleFilter,
    handleResetFilter,

    loadProductList,
    loadStatusCounts,
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
  } = usePetStoreProductModal(async (page = currentPage) => {
    await loadProductList(page, searchCondition);
    await loadStatusCounts();
  }, currentPage);

  const pageNumbers = getPageNumbers({
    currentPage,
    totalPages,
    pageGroupSize: PAGE_GROUP_SIZE,
  });

  const currentPageGroup = Math.floor(currentPage / PAGE_GROUP_SIZE);
  const lastPageGroup = Math.floor(
    (Math.max(totalPages, 1) - 1) / PAGE_GROUP_SIZE,
  );

  const hasPrevPageGroup = currentPageGroup > 0;
  const hasNextPageGroup = currentPageGroup < lastPageGroup;

  function handleMoveDetail(productId) {
    navigate(`/store/product/${productId}`);
  }

  function handleMovePrevPageGroup() {
    const currentGroup = Math.floor(currentPage / PAGE_GROUP_SIZE);

    if (currentGroup <= 0) {
      return;
    }

    const prevGroupFirstPage = (currentGroup - 1) * PAGE_GROUP_SIZE;

    loadProductList(prevGroupFirstPage, searchCondition);
  }

  function handleMoveNextPageGroup() {
    const currentGroup = Math.floor(currentPage / PAGE_GROUP_SIZE);
    const nextGroupFirstPage = (currentGroup + 1) * PAGE_GROUP_SIZE;

    if (nextGroupFirstPage >= totalPages) {
      return;
    }

    loadProductList(nextGroupFirstPage, searchCondition);
  }

  function handleSearchKeyDown(evt) {
    if (evt.key !== "Enter") {
      return;
    }

    if (evt.nativeEvent?.isComposing) {
      return;
    }

    evt.preventDefault();
    handleSearch();
  }

  return (
    <>
      <PetStoreAdminNav />

      <Wrapper>
        <HeaderArea>
          <TitleRow>
            <PageTitle>상품관리</PageTitle>
            <PageDesc>스토어 관리자의 작고 소중한 업무 페이지</PageDesc>
          </TitleRow>
        </HeaderArea>

        <StatusAndActionRow>
          <StatusTabs>
            <StatusTabButton
              type="button"
              $active={searchCondition.saleYn === ""}
              onClick={() => handleClickSaleFilter("")}
            >
              <span>전체</span>
              <strong>{statusCounts.all}</strong>
            </StatusTabButton>

            <StatusTabButton
              type="button"
              $active={searchCondition.saleYn === "Y"}
              onClick={() => handleClickSaleFilter("Y")}
            >
              <span>판매중</span>
              <strong>{statusCounts.selling}</strong>
            </StatusTabButton>

            <StatusTabButton
              type="button"
              $active={searchCondition.saleYn === "N"}
              onClick={() => handleClickSaleFilter("N")}
            >
              <span>판매중지</span>
              <strong>{statusCounts.stopped}</strong>
            </StatusTabButton>
          </StatusTabs>

          <InsertButton type="button" onClick={openInsertModal}>
            <span>상품등록</span>
            <strong>+</strong>
          </InsertButton>
        </StatusAndActionRow>

        <ListCard>
          <FilterRow>
            <SearchBox>
              <SearchInput
                type="text"
                name="keyword"
                placeholder="제품명을 입력하세요."
                value={searchCondition.keyword}
                onChange={handleChangeSearchCondition}
                onKeyDown={handleSearchKeyDown}
              />

              <SearchButton
                type="button"
                aria-label="상품명 검색"
                onClick={handleSearch}
              >
                ⌕
              </SearchButton>
            </SearchBox>

            <FilterSelectBox>
              <FilterLabel>대상동물</FilterLabel>

              <FilterSelect
                name="targetPetType"
                value={searchCondition.targetPetType}
                onChange={handleChangeSearchCondition}
              >
                <option value="">전체</option>
                <option value="D">강아지</option>
                <option value="C">고양이</option>
              </FilterSelect>
            </FilterSelectBox>

            <FilterSelectBox>
              <FilterLabel>카테고리</FilterLabel>

              <FilterSelect
                name="category"
                value={searchCondition.category}
                onChange={handleChangeSearchCondition}
              >
                <option value="">전체</option>
                <option value="FOOD">사료</option>
                <option value="SNACK">간식</option>
                <option value="SUPPLEMENT">영양제</option>
                <option value="TOILET">배변용품</option>
              </FilterSelect>
            </FilterSelectBox>

            <FilterSpacer />

            <FilterSelectBox $wide>
              <FilterLabel>등록일</FilterLabel>

              <FilterSelect
                name="sort"
                value={searchCondition.sort}
                onChange={handleChangeSearchCondition}
              >
                <option value="latest">최신순</option>
                <option value="oldest">오래된순</option>
              </FilterSelect>
            </FilterSelectBox>

            <ResetButton type="button" onClick={handleResetFilter}>
              필터 초기화
            </ResetButton>
          </FilterRow>

          {isLoading ? (
            <LoadingBox>상품 목록을 불러오는 중입니다...</LoadingBox>
          ) : (
            <Table>
              <colgroup>
                <col style={{ width: "70px" }} />
                <col style={{ width: "110px" }} />
                <col style={{ width: "310px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "120px" }} />
                <col style={{ width: "130px" }} />
                <col style={{ width: "125px" }} />
                <col style={{ width: "115px" }} />
                <col style={{ width: "150px" }} />
              </colgroup>

              <thead>
                <tr>
                  <th>번호</th>
                  <th>이미지</th>
                  <th>상품명</th>
                  <th>대상동물</th>
                  <th>카테고리</th>
                  <th>판매가</th>
                  <th>등록일</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>

              <tbody>
                {productList.length === 0 ? (
                  <tr>
                    <EmptyCell colSpan={9}>조회된 상품이 없습니다.</EmptyCell>
                  </tr>
                ) : (
                  productList.map((product, index) => (
                    <tr key={product.productId}>
                      <NumberCell>{currentPage * 10 + index + 1}</NumberCell>

                      <ImageCell>
                        {product.thumbnailUrl ? (
                          <ThumbnailImage
                            src={product.thumbnailUrl}
                            alt={product.productName}
                          />
                        ) : (
                          <NoImageBox>NO IMG</NoImageBox>
                        )}
                      </ImageCell>

                      <ProductNameCell>
                        <ProductLinkButton
                          type="button"
                          onClick={() => handleMoveDetail(product.productId)}
                        >
                          {product.productName}
                        </ProductLinkButton>
                      </ProductNameCell>

                      <td>{getPetTypeLabel(product.productTargetPetType)}</td>
                      <td>{getCategoryLabel(product.productCategory)}</td>
                      <td>{product.productPrice?.toLocaleString()}원</td>

                      <DateCell>{formatDate(product.createdAt)}</DateCell>

                      <td>
                        <SaleBadge $saleYn={product.productSaleYn}>
                          {product.productSaleYn === "Y"
                            ? "판매중"
                            : "판매중지"}
                        </SaleBadge>
                      </td>

                      <td>
                        <ActionBox>
                          <EditButton
                            type="button"
                            onClick={() => openUpdateModal(product.productId)}
                          >
                            수정
                          </EditButton>

                          {product.productSaleYn === "Y" ? (
                            <StopButton
                              type="button"
                              onClick={() => handleStop(product.productId)}
                            >
                              판매중지
                            </StopButton>
                          ) : (
                            <ResumeButton
                              type="button"
                              onClick={() => handleResume(product.productId)}
                            >
                              판매재개
                            </ResumeButton>
                          )}
                        </ActionBox>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </ListCard>

        <Pagination>
          <PageArrowButton
            type="button"
            disabled={!hasPrevPageGroup}
            onClick={handleMovePrevPageGroup}
          >
            ‹
          </PageArrowButton>

          {pageNumbers.map((pageIndex) => (
            <PageNumberButton
              key={pageIndex}
              type="button"
              $active={currentPage === pageIndex}
              disabled={currentPage === pageIndex}
              onClick={() => loadProductList(pageIndex, searchCondition)}
            >
              {pageIndex + 1}
            </PageNumberButton>
          ))}

          <PageArrowButton
            type="button"
            disabled={!hasNextPageGroup}
            onClick={handleMoveNextPageGroup}
          >
            ›
          </PageArrowButton>
        </Pagination>

        {isOpen && (
          <PetStoreProductModal
            mode={mode}
            detailData={detailData}
            isSubmitting={isSubmitting}
            onClose={closeModal}
            onSubmit={submitProduct}
          />
        )}
      </Wrapper>
    </>
  );
}

function getPageNumbers({ currentPage, totalPages, pageGroupSize }) {
  if (!totalPages || totalPages <= 0) {
    return [];
  }

  const currentGroup = Math.floor(currentPage / pageGroupSize);
  const startPage = currentGroup * pageGroupSize;
  const endPage = Math.min(startPage + pageGroupSize, totalPages);

  return Array.from({ length: endPage - startPage }, (_, index) => {
    return startPage + index;
  });
}

function getPetTypeLabel(targetPetType) {
  const map = {
    D: "강아지",
    C: "고양이",
  };

  return map[targetPetType] ?? targetPetType;
}

function getCategoryLabel(category) {
  const map = {
    FOOD: "사료",
    SNACK: "간식",
    SUPPLEMENT: "영양제",
    TOILET: "배변용품",
  };

  return map[category] ?? category;
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  return String(value).slice(0, 10);
}

const Wrapper = styled.main`
  width: 1300px;
  margin: 0 auto;
  padding: 22px 0 52px;
  background-color: #ffffff;
`;

const HeaderArea = styled.section`
  margin-bottom: 18px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 18px;
`;

const PageTitle = styled.h2`
  margin: 0;
  color: #222222;
  font-size: 27px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.8px;
`;

const PageDesc = styled.p`
  margin: 0 0 3px;
  color: #777777;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
`;

const StatusAndActionRow = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const StatusTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusTabButton = styled.button`
  min-width: 74px;
  height: 34px;
  padding: 0 15px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 11px;

  border: 0;
  border-radius: 5px;
  background-color: ${(props) => (props.$active ? "#d9f3e9" : "#eeeeee")};
  color: ${(props) => (props.$active ? "#00a87e" : "#777777")};

  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  span {
    font-weight: 700;
  }

  strong {
    font-size: 14px;
    font-weight: 800;
  }
`;

const InsertButton = styled.button`
  width: 88px;
  height: 36px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  border: 0;
  border-radius: 4px;
  background-color: #00a87e;
  color: #ffffff;

  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  span {
    font-weight: 700;
  }

  strong {
    font-size: 15px;
    font-weight: 800;
  }
`;

const ListCard = styled.section`
  width: 100%;
  border: 1px solid #d7dedb;
  border-radius: 8px;
  overflow: hidden;
  background-color: #ffffff;
`;

const FilterRow = styled.div`
  height: 54px;
  padding: 0 28px;

  display: flex;
  align-items: center;
  gap: 14px;

  border-bottom: 1px solid #d7dedb;
  background-color: #ffffff;
`;

const SearchBox = styled.div`
  width: 230px;
  height: 32px;

  display: grid;
  grid-template-columns: 1fr 36px;

  border: 1px solid #d7dedb;
  border-radius: 4px;
  overflow: hidden;
  background-color: #ffffff;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  padding: 0 12px;

  border: 0;
  outline: none;

  color: #222222;
  font-size: 12px;
  font-weight: 500;

  &::placeholder {
    color: #aaaaaa;
  }
`;

const SearchButton = styled.button`
  border: 0;
  background-color: #ffffff;
  color: #00a87e;

  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
`;

const FilterSelectBox = styled.div`
  width: ${(props) => (props.$wide ? "146px" : "132px")};
  height: 32px;
  padding: 0 10px;

  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 12px;

  border: 1px solid #d7dedb;
  border-radius: 4px;
  background-color: #ffffff;
`;

const FilterLabel = styled.span`
  color: #999999;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

const FilterSelect = styled.select`
  width: 100%;
  height: 100%;

  border: 0;
  outline: none;
  background-color: transparent;

  color: #222222;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const FilterSpacer = styled.div`
  flex: 1;
`;

const ResetButton = styled.button`
  width: 86px;
  height: 32px;

  border: 1px solid #d7dedb;
  border-radius: 4px;
  background-color: #ffffff;
  color: #999999;

  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const LoadingBox = styled.div`
  height: 180px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #777777;
  font-size: 14px;
  font-weight: 600;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  thead tr {
    height: 40px;
    background-color: #dff6ee;
  }

  th {
    color: #222222;
    font-size: 13px;
    font-weight: 700;
    text-align: center;
  }

  tbody tr {
    height: 66px;
    border-bottom: 1px solid #edf2f0;
  }

  tbody tr:last-child {
    border-bottom: 0;
  }

  td {
    color: #222222;
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    vertical-align: middle;
  }
`;

const NumberCell = styled.td`
  color: #222222;
`;

const ImageCell = styled.td``;

const ProductNameCell = styled.td`
  text-align: center !important;
`;

const DateCell = styled.td`
  color: #777777 !important;
`;

const EmptyCell = styled.td`
  height: 180px;
  color: #777777 !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  text-align: center !important;
`;

const ThumbnailImage = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 5px;
  object-fit: cover;
`;

const NoImageBox = styled.div`
  width: 42px;
  height: 42px;
  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 5px;
  background-color: #f2f2f2;
  color: #999999;

  font-size: 10px;
  font-weight: 700;
`;

const ProductLinkButton = styled.button`
  max-width: 280px;

  display: inline-block;

  border: 0;
  background-color: transparent;
  color: #222222;

  font-size: 13px;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  cursor: pointer;

  &:hover {
    color: #00a87e;
  }
`;

const SaleBadge = styled.span`
  min-width: 54px;
  height: 24px;
  padding: 0 10px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border-radius: 4px;

  background-color: ${(props) =>
    props.$saleYn === "Y" ? "#ccefe4" : "#dddddd"};
  color: ${(props) => (props.$saleYn === "Y" ? "#00a87e" : "#888888")};

  font-size: 12px;
  font-weight: 700;
`;

const ActionBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const ActionButtonBase = styled.button`
  width: 54px;
  height: 26px;

  border-radius: 3px;
  background-color: #ffffff;

  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
`;

const EditButton = styled(ActionButtonBase)`
  border: 1px solid #d7dedb;
  color: #999999;
`;

const StopButton = styled(ActionButtonBase)`
  border: 1px solid #ff6b6b;
  color: #ff4d4d;
`;

const ResumeButton = styled(ActionButtonBase)`
  border: 1px solid #00a87e;
  color: #00a87e;
`;

const Pagination = styled.div`
  margin-top: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const PageNumberButton = styled.button`
  width: 22px;
  height: 22px;

  border: 0;
  border-radius: 4px;
  background-color: ${(props) => (props.$active ? "#dff6ee" : "transparent")};
  color: ${(props) => (props.$active ? "#00a87e" : "#222222")};
  box-shadow: ${(props) =>
    props.$active ? "0 2px 8px rgba(0, 168, 126, 0.18)" : "none"};

  font-size: 13px;
  font-weight: 600;
  cursor: ${(props) => (props.$active ? "default" : "pointer")};
`;

const PageArrowButton = styled.button`
  width: 22px;
  height: 22px;

  border: 0;
  background-color: transparent;
  color: #222222;

  font-size: 24px;
  font-weight: 400;
  line-height: 1;
  cursor: pointer;

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;
