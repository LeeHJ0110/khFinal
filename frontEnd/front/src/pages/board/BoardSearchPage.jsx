import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fetchUnifiedSearchApi } from "../../features/board/api/boardApi";

export default function BoardSearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const navigate = useNavigate();

  const [data, setData] = useState({ boardList: [], productList: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!keyword.trim()) return;

    const fetchUnifiedData = async () => {
      setIsLoading(true);
      try {
        const resp = await fetchUnifiedSearchApi(keyword.trim());
        setData(resp.data || { boardList: [], productList: [] });
      } catch (err) {
        console.error("통합검색 에러:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnifiedData();
  }, [keyword]);

  if (isLoading) {
    return (
      <LoadingWrapper>
        <LoadingText>검색 결과를 분석 중입니다... 🐾</LoadingText>
      </LoadingWrapper>
    );
  }

  return (
    <PageContainer>
      <TitleWrapper>
        <KeywordText>‘{keyword}’</KeywordText> 로 검색된 결과입니다.
      </TitleWrapper>

      <ResultCardContainer>
        {/* 커뮤니티 영역 */}
        <SectionWrapper>
          <SectionHeader>커뮤니티</SectionHeader>
          {data.boardList && data.boardList.length > 0 ? (
            <CommunityGrid>
              {data.boardList.map((post) => (
                <PostCard
                  key={post.id}
                  onClick={() => navigate(`/community/detail/${post.id}`)}
                >
                  <PostInfoArea>
                    <PostHeaderRow>
                      <PostTitle>{post.title}</PostTitle>
                      {post.categoryName && (
                        <CategoryBadge>{post.categoryName}</CategoryBadge>
                      )}
                    </PostHeaderRow>
                    <PostContentSummary>{post.content}</PostContentSummary>
                    <PostFooterRow>
                      <AuthorText>{post.writerNickname}</AuthorText>
                      <DateText>{post.createdAt}</DateText>
                    </PostFooterRow>
                  </PostInfoArea>

                  {post.thumbnailUrl && (
                    <PostThumbnail src={post.thumbnailUrl} alt="Thumbnail" />
                  )}
                </PostCard>
              ))}
            </CommunityGrid>
          ) : (
            <EmptyMessage>
              검색 결과와 일치하는 게시글이 없습니다. 🐾
            </EmptyMessage>
          )}

          <MoreButtonWrapper>
            <MoreButton
              onClick={() => navigate("/community/list?category=FREE")}
            >
              커뮤니티에서 더 찾아보기
            </MoreButton>
          </MoreButtonWrapper>
        </SectionWrapper>

        <Divider />

        {/* 스토어 영역 */}
        <SectionWrapper>
          <SectionHeader>스토어</SectionHeader>
          {data.productList && data.productList.length > 0 ? (
            <StoreGrid>
              {data.productList.map((product) => (
                <ProductCard
                  key={product.productId}
                  onClick={() =>
                    navigate(`/store/product/${product.productId}`)
                  }
                >
                  <ProductImageWrapper>
                    {product.mainImageUrl ? (
                      <ProductImage
                        src={product.mainImageUrl}
                        alt={product.productName}
                      />
                    ) : (
                      <ProductImagePlaceholder>
                        No Image
                      </ProductImagePlaceholder>
                    )}
                  </ProductImageWrapper>
                  <ProductInfoArea>
                    <ProductName>{product.productName}</ProductName>
                    <ProductPrice>
                      {product.productPrice.toLocaleString()} 원
                    </ProductPrice>
                    <ReviewRow>
                      <StarIcon>★</StarIcon>
                      <RatingText>
                        {product.reviewRatingAvg.toFixed(1)}
                      </RatingText>
                      <ReviewCountText>({product.reviewCount})</ReviewCountText>
                    </ReviewRow>
                  </ProductInfoArea>
                </ProductCard>
              ))}
            </StoreGrid>
          ) : (
            <EmptyMessage>
              검색 결과와 일치하는 상품이 없습니다. 🛍️
            </EmptyMessage>
          )}

          <MoreButtonWrapper>
            <MoreButton onClick={() => navigate("/store")}>
              스토어에서 더 찾아보기
            </MoreButton>
          </MoreButtonWrapper>
        </SectionWrapper>
      </ResultCardContainer>
    </PageContainer>
  );
}

// Styled Components
const PageContainer = styled.div`
  width: 1200px;
  margin: 60px auto 100px auto;
  font-family: "Noto Sans KR", sans-serif;
`;

const TitleWrapper = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #111111;
  margin-bottom: 30px;
  letter-spacing: -0.5px;
`;

const KeywordText = styled.span`
  color: #111111;
  font-weight: 800;
`;

const ResultCardContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e1e4e6;
  border-radius: 32px;
  padding: 40px 50px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.02);
`;

const SectionWrapper = styled.div`
  margin-bottom: 40px;
`;

const SectionHeader = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #222222;
  margin-top: 0;
  margin-bottom: 24px;
`;

const CommunityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px 40px;
`;

const PostCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f1f3f5;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const PostInfoArea = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-right: 20px;
`;

const PostHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const PostTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #111111;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
`;

const CategoryBadge = styled.span`
  font-size: 11px;
  color: #888888;
  background: #f1f3f5;
  padding: 2px 6px;
  border-radius: 4px;
`;

const PostContentSummary = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0 0 12px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 42px;
`;

const PostFooterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AuthorText = styled.span`
  font-size: 12px;
  color: #888888;
`;

const DateText = styled.span`
  font-size: 12px;
  color: #b5b5b5;
`;

const PostThumbnail = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 12px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e1e4e6;
  margin: 20px 0 40px 0;
`;

const StoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 30px;
`;

const ProductCard = styled.div`
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  border: 1px solid #f1f3f5;
  border-radius: 16px;
  overflow: hidden;
  background: #ffffff;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
  }
`;

const ProductImageWrapper = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ProductImagePlaceholder = styled.div`
  font-size: 14px;
  color: #cccccc;
`;

const ProductInfoArea = styled.div`
  padding: 16px;
`;

const ProductName = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: #111111;
  margin: 0 0 6px 0;
  line-height: 1.4;
  height: 40px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductPrice = styled.div`
  font-size: 15px;
  font-weight: 800;
  color: #111111;
  margin-bottom: 8px;
`;

const ReviewRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const StarIcon = styled.span`
  color: #ffb800;
  font-size: 13px;
`;

const RatingText = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #333333;
`;

const ReviewCountText = styled.span`
  font-size: 12px;
  color: #888888;
`;

const MoreButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const MoreButton = styled.button`
  background: #eaeaea;
  border: none;
  border-radius: 20px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 700;
  color: #555555;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #dddddd;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #888888;
  font-size: 14px;
  padding: 40px 0;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
`;

const LoadingText = styled.div`
  font-size: 16px;
  color: #666666;
`;
