import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useSelector } from "react-redux";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.bubble.css";

import { useBoardDetail } from "../../features/board/hooks/useBoardDetail";
import {
  deleteBoardApi,
  writeReplyApi,
  deleteReplyApi,
  toggleLikeApi,
} from "../../features/board/api/boardApi";
import BoardSubNavbar from "./components/BoardSubNavbar";

export default function BoardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { detail, isLoading, error, refetch } = useBoardDetail(id);

  const loginMember = useSelector((state) =>
    state.member.accessToken ? state.member : null,
  );

  //카테고리별 메타 정보
  const boardMeta = {
    FREE: {
      title: "자유게시판",
      subtitle: "반려동물에 대한 자유로운 이야기와 정보를 나눠보세요.",
    },
    PRODUCT_REVIEW: {
      title: "상품후기게시판",
      subtitle: "반려동물에 대한 자유로운 이야기와 정보를 나눠보세요.",
    },
    FAC_REVIEW: {
      title: "시설후기게시판",
      subtitle:
        "반려동물과 함께 방문한 병원, 카페, 펜션 등의 생생한 후기를 확인하세요.",
    },
    FAQ: {
      title: "FAQ게시판",
      subtitle: "자주 묻는 질문 게시판",
    },
    NEWS: {
      title: "뉴스게시판",
      subtitle: "동물뉴스들을 한눈에 확인하세요~!",
    },
  };

  //좋아요 상태 관리
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  //댓글 상태 관리
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // 대댓글용 상태
  const [activeReplyParentId, setActiveReplyParentId] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  // 게시글 상세정보 수신 시 댓글 목록 및 좋아요 상태 동기화
  useEffect(() => {
    if (detail) {
      if (detail.replies) {
        setComments(detail.replies);
      }
      setLikesCount(detail.likeCount ?? 0);
      setIsLiked(!!detail.isLiked);
    }
  }, [detail]);

  const handleLikeToggle = async () => {
    if (!loginMember) {
      alert("로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.");
      navigate("/member/login");
      return;
    }
    try {
      const resp = await toggleLikeApi(id);
      setLikesCount(resp.data.likeCount);
      setIsLiked(resp.data.isLiked);
    } catch (err) {
      console.error("좋아요 처리 실패:", err);
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  //댓글 등록 핸들러
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      return;
    }

    try {
      await writeReplyApi(id, newComment.trim());
      setNewComment("");
      refetch();
    } catch (err) {
      console.error("댓글 등록 실패:", err);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  // 대댓글 등록 핸들러
  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      return;
    }

    try {
      await writeReplyApi(id, replyContent.trim(), parentId);
      setReplyContent("");
      setActiveReplyParentId(null);
      refetch();
    } catch (err) {
      console.error("답글 등록 실패:", err);
      alert("답글 등록에 실패했습니다.");
    }
  };

  // 댓글 삭제 핸들러
  const handleCommentDelete = async (replyId) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;
    try {
      await deleteReplyApi(replyId);
      refetch();
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  // 게시글 수정 이동 핸들러
  const handleEditRedirect = () => {
    if (!detail) return;
    navigate(`/community/write`, {
      state: {
        board: {
          id: detail.boardId,
          title: detail.title,
          content: detail.content,
          category: detail.boardCategory,
          subCategory: detail.boardSubCategory,
          stars: detail.stars,
        },
      },
    });
  };

  //게시글 삭제 핸들로
  const handleDelete = async () => {
    if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;
    try {
      await deleteBoardApi(id);
      alert("게시글이 정삭적으로 삭제되었습니다.");
      navigate(`/community/list?category=${detail?.boardCategory || "FREE"}`);
    } catch (error) {
      console.log("게시글 삭제 실패", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  const activeCategory = detail?.boardCategory || "FREE";
  const meta = boardMeta[activeCategory] || boardMeta.FREE;

  //총 댓글 개수 계산(대댓글도)
  const totalCommentsCount = comments.reduce(
    (acc, cur) => acc + 1 + (cur.replies ? cur.replies.length : 0),
    0,
  );

  if (error || !detail) {
    return (
      <Container>
        <div id="board-subnavbar-portal" style={{ width: "100%" }} />
        <ErrorMessage>
          게시글을 찾을 수 없거나 불러오는 중에 오류가 발생했습니다. <br />
          <BackButton onClick={() => navigate(-1)}>이전으로</BackButton>
        </ErrorMessage>
      </Container>
    );
  }

  const userRole = (() => {
    const saved = localStorage.getItem("loginMember");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.role) return parsed.role;
      } catch (e) {
        console.error("loginMember parse error", e);
      }
    }
    const token =
      loginMember?.accessToken || localStorage.getItem("accessToken");
    if (token) {
      try {
        const payloadPart = token.split(".")[1];
        if (payloadPart) {
          const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
          const decodedPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map(
                (char) =>
                  `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`,
              )
              .join(""),
          );
          const payload = JSON.parse(decodedPayload);
          return payload.role;
        }
      } catch (e) {
        console.error("Token decode error", e);
      }
    }
    return loginMember?.role;
  })();
  const isSuperAdmin = userRole === "A" || userRole === "ADMIN";
  const isBoardAdmin = userRole === "B" || userRole === "BOARD";

  //본인글 또는 관리자 권한 확인 (백엔드 추가 연동 완료)
  const hasEditPermission =
    loginMember?.username === detail.writerUsername ||
    (activeCategory === "FAQ" && (isSuperAdmin || isBoardAdmin));

  const hasDeletepermission =
    loginMember?.username === detail.writerUsername ||
    isSuperAdmin ||
    isBoardAdmin;

  return (
    <Container>
      {/* 상단 서브 네브바 (포털 우회하여 인라인 렌더링) */}
      <BoardSubNavbar
        activeTab={activeCategory}
        bypassPortal={true}
        onTabChange={(tab) => {
          if (tab === "HOME") {
            navigate("/community");
          } else {
            navigate(`/community/list?category=${tab}`);
          }
        }}
      />

      <ContentWrapper>
        {/* 게시판 타이틀 및 설명 헤더 */}
        <BoardHeaderSection>
          <BoardTitle>{meta.title}</BoardTitle>
          <BoardSubtitle>{meta.subtitle}</BoardSubtitle>
        </BoardHeaderSection>

        {/* 게시글 메인 카드 */}
        <PostCard>
          {/*말머리 태그  */}
          {detail.boardCategory === "FREE" && detail.boardSubCategory && (
            <CategoryBadge>{detail.boardSubCategory}</CategoryBadge>
          )}
          <PostTitle>{detail.title}</PostTitle>
          {/* 작성자 정보 및 메타데이터 행 */}
          <PostMetaRow>
            <MetaLeft>
              <AuthorAvatarWrapper>
                {detail.writerProfileImageUrl &&
                detail.writerProfileImageUrl !==
                  "/images/default-profile.png" ? (
                  <img src={detail.writerProfileImageUrl} alt="작성자 프로필" />
                ) : (
                  <DefaultAvatarChar>🐾</DefaultAvatarChar>
                )}
              </AuthorAvatarWrapper>
              <AuthorTextInfo>
                <AuthorNameRow>
                  <LevelBadge>Lv.{detail.writerLevel || 1}</LevelBadge>
                  <AuthorName>
                    {detail.writerNickname || "탈퇴한 회원"}
                  </AuthorName>
                </AuthorNameRow>
                <CreatedAtTime>
                  {new Date(detail.createdAt).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </CreatedAtTime>
              </AuthorTextInfo>
            </MetaLeft>

            <MetaRight>
              <StatItem>
                <SvgComment />
                <span>{totalCommentsCount}</span>
              </StatItem>
              <StatItem>
                <SvgEye />
                <span>{(detail.hits ?? 0).toLocaleString()}</span>
              </StatItem>
              <StatItem>
                <SvgHeart />
                <span>{likesCount}</span>
              </StatItem>
            </MetaRight>
          </PostMetaRow>

          {/* 게시글 본문 (Quill 뷰어 모드로 안전 렌더링) */}
          <PostBody>
            <ReactQuill value={detail.content} readOnly={true} theme="bubble" />
          </PostBody>

          {/*좋아요 액션 버튼 */}
          {activeCategory !== "FAQ" && (
            <LikeActionArea>
              <LikeButtonBox onClick={handleLikeToggle} $liked={isLiked}>
                <LikeIconWrapper $liked={isLiked}>
                  <SvgHeartFilled />
                </LikeIconWrapper>
                <LikeCountText>{likesCount}</LikeCountText>
              </LikeButtonBox>

              <ReportShareRow>
                <ActionLinkButton onClick={() => alert("신고되었습니다.")}>
                  신고
                </ActionLinkButton>
                <ActionSeparator>|</ActionSeparator>
                <ActionLinkButton
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("현재 게시글 주소가 클립보드에 복사되었습니다.");
                  }}
                >
                  공유
                </ActionLinkButton>
              </ReportShareRow>
            </LikeActionArea>
          )}

          {/* 목록 / 수정 / 삭제 액션바 */}
          <PostActionBar>
            <ActionButton
              onClick={() =>
                navigate(
                  `/community/list?category=${detail.boardCategory || "FREE"}`,
                )
              }
            >
              목록
            </ActionButton>

            <RightActions>
              {hasEditPermission && (
                <ActionButton onClick={handleEditRedirect}>수정</ActionButton>
              )}
              {hasDeletepermission && (
                <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
              )}
            </RightActions>
          </PostActionBar>
        </PostCard>

        {/* 댓글 영역 */}
        <CommentsSection>
          <CommentsHeader>댓글 {totalCommentsCount}</CommentsHeader>

          {/* 댓글 입력창 */}
          <CommentInputForm onSubmit={handleCommentSubmit}>
            <CommentTextarea
              placeholder={
                loginMember
                  ? "댓글을 남겨보세요"
                  : "로그인 후 댓글 작성이 가능합니다."
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!loginMember}
            />
            <CommentSubmitButton type="submit" disabled={!loginMember}>
              등록
            </CommentSubmitButton>
          </CommentInputForm>

          {/*댓글 리스트 */}
          <CommentList>
            {comments.length === 0 ? (
              <EmptyCommentsMessage>
                등록된 댓글이 없습니다. 첫 댓글을 남겨보세요!
              </EmptyCommentsMessage>
            ) : (
              comments.map((comment) => (
                <Fragment key={comment.id}>
                  {/* 메인 댓글 */}
                  <CommentItem>
                    <CommentAvatarWrapper>
                      {comment.profileImageUrl &&
                      comment.profileImageUrl !==
                        "/images/default-profile.png" ? (
                        <img
                          src={comment.profileImageUrl}
                          alt={comment.writerNickname}
                        />
                      ) : (
                        <DefaultCommentAvatarChar>🐾</DefaultCommentAvatarChar>
                      )}
                    </CommentAvatarWrapper>

                    <CommentContentBox>
                      <CommentMetaRow>
                        <LevelBadge>Lv.{comment.writerLevel}</LevelBadge>
                        <CommentAuthor>{comment.writerNickname}</CommentAuthor>
                        {comment.isAuthor && <AuthorBadge>작성자</AuthorBadge>}
                      </CommentMetaRow>
                      <CommentText>{comment.content}</CommentText>
                      <CommentFooterRow>
                        {loginMember && (
                          <CommentActionLink
                            onClick={() => {
                              if (activeReplyParentId === comment.id) {
                                setActiveReplyParentId(null);
                              } else {
                                setActiveReplyParentId(comment.id);
                                setReplyContent("");
                              }
                            }}
                          >
                            {activeReplyParentId === comment.id
                              ? "취소"
                              : "답글달기"}
                          </CommentActionLink>
                        )}
                        {(loginMember?.nickname === comment.writerNickname ||
                          isSuperAdmin ||
                          isBoardAdmin) && (
                          <CommentReportLink
                            style={{ color: "#ff6b6b" }}
                            onClick={() => handleCommentDelete(comment.id)}
                          >
                            삭제
                          </CommentReportLink>
                        )}
                        <CommentReportLink
                          onClick={() => alert("신고되었습니다.")}
                        >
                          신고
                        </CommentReportLink>
                      </CommentFooterRow>
                    </CommentContentBox>
                  </CommentItem>

                  {/* 대댓글 작성 창 */}
                  {activeReplyParentId === comment.id && (
                    <ReplyInputForm
                      onSubmit={(e) => handleReplySubmit(e, comment.id)}
                    >
                      <ReplyTextarea
                        placeholder="답글을 남겨보세요"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                      />
                      <ReplySubmitButton type="submit">등록</ReplySubmitButton>
                    </ReplyInputForm>
                  )}

                  {/*대댓글 */}
                  {comment.replies &&
                    comment.replies.map((reply) => (
                      <ReplyItem key={reply.id}>
                        <ReplyIndentArrow>↳</ReplyIndentArrow>
                        <ReplyContentCard>
                          <CommentAvatarWrapper>
                            {reply.profileImageUrl &&
                            reply.profileImageUrl !==
                              "/images/default-profile.png" ? (
                              <img
                                src={reply.profileImageUrl}
                                alt={reply.writerNickname}
                              />
                            ) : (
                              <DefaultCommentAvatarChar>
                                🐾
                              </DefaultCommentAvatarChar>
                            )}
                          </CommentAvatarWrapper>
                          <CommentContentBox>
                            <CommentMetaRow>
                              <LevelBadge>Lv.{reply.writerLevel}</LevelBadge>
                              <CommentAuthor>
                                {reply.writerNickname}
                              </CommentAuthor>
                              {reply.isAuthor && (
                                <AuthorBadge>작성자</AuthorBadge>
                              )}
                            </CommentMetaRow>
                            <CommentText>{reply.content}</CommentText>
                            <CommentFooterRow>
                              {(loginMember?.nickname ===
                                reply.writerNickname ||
                                isSuperAdmin ||
                                isBoardAdmin) && (
                                <CommentReportLink
                                  style={{ color: "#ff6b6b" }}
                                  onClick={() => handleCommentDelete(reply.id)}
                                >
                                  삭제
                                </CommentReportLink>
                              )}
                              <CommentReportLink
                                onClick={() => alert("신고되었습니다")}
                              >
                                신고
                              </CommentReportLink>
                            </CommentFooterRow>
                          </CommentContentBox>
                        </ReplyContentCard>
                      </ReplyItem>
                    ))}
                </Fragment>
              ))
            )}
          </CommentList>
        </CommentsSection>
      </ContentWrapper>
    </Container>
  );
}

// ==========================================
// SVGs
// ==========================================
const SvgComment = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="#888888">
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
  </svg>
);

const SvgEye = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="#888888">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

const SvgHeart = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="#ea4c89">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const SvgHeartFilled = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// ==========================================
// Styled Components
// ==========================================
const Container = styled.div`
  width: 100%;
  background-color: #fafbfc;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Paperozi", "Noto Sans KR", sans-serif;
  padding-bottom: 80px;
`;

const ContentWrapper = styled.div`
  width: 1000px;
  display: flex;
  flex-direction: column;
  margin-top: 40px;
`;

const BoardHeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid var(--color-dark);
  padding-bottom: 20px;
`;

const BoardTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: var(--color-dark);
  margin: 0;
`;

const BoardSubtitle = styled.p`
  font-size: 14px;
  color: #888888;
  margin: 0;
`;

const LoadingMessage = styled.div`
  padding: 100px 0;
  font-size: 16px;
  color: #888888;
  text-align: center;
`;

const ErrorMessage = styled.div`
  padding: 100px 0;
  font-size: 16px;
  color: #ff6b6b;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const BackButton = styled.button`
  padding: 10px 24px;
  background-color: var(--color-main);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
`;

const PostCard = styled.div`
  background-color: #ffffff;
  border: 1px solid #eef1f2;
  border-radius: 12px;
  padding: 40px 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 30px;
`;

const CategoryBadge = styled.span`
  background-color: #fff9db;
  color: #ff922b;
  border: 1px solid #ffd8a8;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 800;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const PostTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #122d2e;
  margin: 0 0 20px 0;
  line-height: 1.4;
`;

const PostMetaRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f3f4;
  margin-bottom: 30px;
`;

const MetaLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AuthorAvatarWrapper = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f1f3f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DefaultAvatarChar = styled.span`
  font-size: 20px;
`;

const AuthorTextInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AuthorNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LevelBadge = styled.span`
  background-color: #ecfdf6;
  color: #00a97b;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
`;

const AuthorName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #333333;
`;

const CreatedAtTime = styled.span`
  font-size: 12px;
  color: #999999;
`;

const MetaRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #777777;

  svg {
    flex-shrink: 0;
  }
`;

const PostBody = styled.div`
  width: 100%;
  min-height: 200px;
  margin-bottom: 40px;

  .ql-container.ql-bubble {
    font-family: inherit;
    font-size: 15px;
    line-height: 1.8;
    color: #222222;
  }
  .ql-editor {
    padding: 0;
  }
  .ql-editor img {
    max-width: 100%;
    border-radius: 8px;
    margin: 20px 0;
    display: block;
  }
`;

const LikeActionArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-bottom: 40px;
`;

const LikeButtonBox = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.08);
  }
`;

const LikeIconWrapper = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid #eef1f2;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  color: ${(props) => (props.$liked ? "#ffffff" : "#00a97b")};
  background-color: ${(props) => (props.$liked ? "#00a97b" : "#ffffff")};
  border-color: ${(props) => (props.$liked ? "#00a97b" : "#eef1f2")};
  transition: all 0.2s ease;

  svg {
    fill: ${(props) => (props.$liked ? "#ffffff" : "#00a97b")};
  }
`;

const LikeCountText = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: #333333;
`;

const ReportShareRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #bbbbbb;
`;

const ActionLinkButton = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  color: #888888;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #444444;
  }
`;

const ActionSeparator = styled.span`
  color: #dee2e6;
`;

const PostActionBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #f1f3f4;
  padding-top: 24px;
`;

const ActionButton = styled.button`
  padding: 8px 20px;
  background-color: #f1f3f5;
  border: 1px solid #e9ecef;
  color: #495057;
  font-size: 13px;
  font-weight: 700;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e9ecef;
  }
`;

const RightActions = styled.div`
  display: flex;
  gap: 8px;
`;

const DeleteButton = styled.button`
  padding: 8px 20px;
  background-color: #fff5f5;
  border: 1px solid #ffe3e3;
  color: #ff6b6b;
  font-size: 13px;
  font-weight: 700;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #ffe3e3;
  }
`;

const CommentsSection = styled.div`
  background-color: #ffffff;
  border: 1px solid #eef1f2;
  border-radius: 12px;
  padding: 40px 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
`;

const CommentsHeader = styled.h3`
  font-size: 18px;
  font-weight: 800;
  color: #122d2e;
  margin: 0 0 20px 0;
`;

const CommentInputForm = styled.form`
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
`;

const CommentTextarea = styled.textarea`
  flex: 1;
  height: 68px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  outline: none;
  resize: none;
  font-family: inherit;

  &::placeholder {
    color: #adb5bd;
  }

  &:focus {
    border-color: var(--color-main);
  }
`;

const CommentSubmitButton = styled.button`
  width: 78px;
  height: 68px;
  background-color: var(--color-main);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-main-dark);
  }

  &:disabled {
    background-color: #dee2e6;
    cursor: not-allowed;
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const EmptyCommentsMessage = styled.div`
  text-align: center;
  padding: 50px 0;
  color: #adb5bd;
  font-size: 14px;
  font-weight: 500;
`;

const CommentItem = styled.div`
  display: flex;
  gap: 14px;
  padding: 20px 0;
  border-bottom: 1px solid #f1f3f4;
`;

const CommentAvatarWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f1f3f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DefaultCommentAvatarChar = styled.span`
  font-size: 18px;
`;

const CommentContentBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
`;

const CommentMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CommentAuthor = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #333333;
`;

const AuthorBadge = styled.span`
  background-color: #e8f2ff;
  color: #228be6;
  font-size: 9px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
`;

const CommentText = styled.p`
  font-size: 14px;
  color: #444444;
  margin: 0;
  line-height: 1.5;
  text-align: left;
`;

const CommentFooterRow = styled.div`
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #999999;
  margin-top: 4px;
`;

const CommentActionLink = styled.button`
  background: none;
  border: none;
  font-size: 11px;
  color: #888888;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #444444;
  }
`;

const CommentReportLink = styled.button`
  background: none;
  border: none;
  font-size: 11px;
  color: #aaaaaa;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #ff6b6b;
  }
`;

const ReplyItem = styled.div`
  display: flex;
  gap: 8px;
  padding-left: 30px;
  margin-top: -1px;
  border-bottom: 1px solid #f1f3f4;
`;

const ReplyIndentArrow = styled.span`
  font-size: 14px;
  color: #adb5bd;
  margin-top: 18px;
`;

const ReplyContentCard = styled.div`
  flex: 1;
  background-color: #fafbfc;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  gap: 14px;
  margin: 10px 0;
`;

const ReplyInputForm = styled.form`
  display: flex;
  gap: 12px;
  margin: 10px 0 10px 44px;
`;

const ReplyTextarea = styled.textarea`
  flex: 1;
  height: 50px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  outline: none;
  resize: none;
  font-family: inherit;

  &:focus {
    border-color: var(--color-main);
  }
`;

const ReplySubmitButton = styled.button`
  width: 60px;
  height: 50px;
  background-color: var(--color-main);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-main-dark);
  }
`;
