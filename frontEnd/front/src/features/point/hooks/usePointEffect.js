import { fetchDailyAttendancePoint, fetchMyPoint } from "../api/pointApi";
import {
  getEarnPointMessage,
  getPointErrorMessage,
  getUsePointMessage,
  showPointMessage,
} from "../utils/pointMessage";
import { POINT_ACTION_POLICY } from "../utils/pointPolicy";

export default function usePointEffect() {
  async function runDailyAttendancePoint() {
    const policy = POINT_ACTION_POLICY.DAILY_ATTENDANCE;

    try {
      const response = await fetchDailyAttendancePoint();

      const message =
        policy.successMessage ||
        response.data?.message ||
        "일일 출석체크 포인트가 지급되었습니다.";

      showPointMessage(message);

      return response;
    } catch (error) {
      const message = getPointErrorMessage(error, policy.errorMessage);

      showPointMessage(message);
      throw error;
    }
  }

  async function checkPointBeforeStart(actionType) {
    const policy = POINT_ACTION_POLICY[actionType];

    if (!policy) {
      console.warn(`등록되지 않은 포인트 액션 타입입니다: ${actionType}`);
      return true;
    }

    try {
      const pointRes = await fetchMyPoint();
      const currentPoint = Number(pointRes.data || 0);

      if (policy.mode === "USE" && currentPoint < policy.amount) {
        showPointMessage(
          policy.blockMessage ||
            `${policy.amount.toLocaleString()}P 이상 보유해야 이용할 수 있습니다.`,
        );

        return false;
      }

      return true;
    } catch (error) {
      const message = getPointErrorMessage(
        error,
        "포인트 정보를 확인하지 못했습니다.",
      );

      showPointMessage(message);
      return false;
    }
  }

  async function startPointAction(actionType) {
    const policy = POINT_ACTION_POLICY[actionType];

    if (!policy) {
      console.warn(`등록되지 않은 포인트 액션 타입입니다: ${actionType}`);

      return {
        async finish() {},
      };
    }

    let beforePoint = 0;
    let canCheckPoint = true;

    try {
      const beforeRes = await fetchMyPoint();
      beforePoint = Number(beforeRes.data || 0);
    } catch (error) {
      canCheckPoint = false;
      console.warn("포인트 사전 조회 실패:", error);

      return {
        async finish() {},
      };
    }

    return {
      async finish() {
        if (!canCheckPoint) {
          return;
        }

        try {
          const afterRes = await fetchMyPoint();
          const afterPoint = Number(afterRes.data || 0);

          let message = "";

          if (policy.mode === "EARN") {
            message = getEarnPointMessage({
              beforePoint,
              afterPoint,
              earnAmount: policy.amount,
              successMessage: policy.successMessage,
            });
          }

          if (policy.mode === "USE") {
            message = getUsePointMessage({
              beforePoint,
              afterPoint,
              useAmount: policy.amount,
              successMessage: policy.successMessage,
            });
          }

          // 성공 알림을 끄고 싶은 포인트 액션은 여기서 차단
          if (policy.showSuccessMessage === false) {
            return;
          }

          // 메시지가 있을 때만 알림 표시
          if (message) {
            showPointMessage(message);
          }
        } catch (error) {
          const message = getPointErrorMessage(error, policy.errorMessage);
          showPointMessage(message);
        }
      },
    };
  }

  return {
    startPointAction,
    checkPointBeforeStart,
    runDailyAttendancePoint,
  };
}
