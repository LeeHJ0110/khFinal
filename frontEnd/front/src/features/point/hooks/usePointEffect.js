import { fetchMyPoint } from "../api/pointApi";
import {
  getEarnPointMessage,
  getPointErrorMessage,
  getUsePointMessage,
  showPointMessage,
} from "../utils/pointMessage";
import { POINT_ACTION_POLICY } from "../utils/pointPolicy";

export default function usePointEffect() {
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
              skipMessage: policy.skipMessage,
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

          showPointMessage(message);
        } catch (error) {
          const message = getPointErrorMessage(error, policy.errorMessage);
          showPointMessage(message);
        }
      },
    };
  }

  return {
    startPointAction,
  };
}
