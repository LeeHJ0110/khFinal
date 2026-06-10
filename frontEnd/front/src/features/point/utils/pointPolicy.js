export const POINT_ACTION_TYPE = {
  DAILY_ATTENDANCE: "DAILY_ATTENDANCE",
  WEEKLY_TRAINING_DIARY: "WEEKLY_TRAINING_DIARY",
  WEEKLY_COMMUNITY_POST: "WEEKLY_COMMUNITY_POST",
  REVIEW_WRITE: "REVIEW_WRITE",
  HEALTHCARE_USE: "HEALTHCARE_USE",
};

export const POINT_ACTION_POLICY = {
  [POINT_ACTION_TYPE.DAILY_ATTENDANCE]: {
    mode: "DIRECT_EARN",
    amount: 100,
    successMessage: "[적립] 일일 출석체크 포인트 100P가 지급되었습니다.",
    errorMessage: "출석체크 처리 중 오류가 발생했습니다.",
  },

  [POINT_ACTION_TYPE.WEEKLY_TRAINING_DIARY]: {
    mode: "EARN",
    amount: 500,
    successMessage: "[적립] 주간 훈련일기 작성 포인트 500P가 지급되었습니다.",
    skipMessage: "[미지급] 이번 주 훈련일기 작성 포인트는 이미 지급되었습니다.",
    errorMessage: "훈련일기 저장 중 오류가 발생했습니다.",
  },

  [POINT_ACTION_TYPE.WEEKLY_COMMUNITY_POST]: {
    mode: "EARN",
    amount: 500,
    successMessage: "[적립] 주간 게시글 작성 포인트 500P가 지급되었습니다.",
    skipMessage: "[미지급] 이번 주 게시글 작성 포인트는 이미 지급되었습니다.",
    errorMessage: "게시글 작성 중 오류가 발생했습니다.",
  },

  [POINT_ACTION_TYPE.REVIEW_WRITE]: {
    mode: "EARN",
    amount: 500,
    successMessage: "[적립] 상품 리뷰 작성 포인트 500P가 지급되었습니다.",
    skipMessage: "[미지급] 상품 리뷰 작성 포인트가 지급되지 않았습니다.",
    errorMessage: "리뷰 작성 중 오류가 발생했습니다.",
  },

  [POINT_ACTION_TYPE.HEALTHCARE_USE]: {
    mode: "USE",
    amount: 2000,
    successMessage: "[사용] 건강진단 서비스 이용으로 2,000P가 차감되었습니다.",
    blockMessage: "건강진단 신청에는 2,000P 이상 보유해야 합니다.",
    errorMessage: "건강진단 신청 중 오류가 발생했습니다.",
  },
};
