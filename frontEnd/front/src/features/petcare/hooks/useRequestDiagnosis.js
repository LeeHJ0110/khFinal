import { useState } from "react";
import { requestDiagnosis } from "../api/petCareApi";

// 포인트 관련
import usePointEffect from "../../point/hooks/usePointEffect";
import { POINT_ACTION_TYPE } from "../../point/utils/pointPolicy";

export default function useRequestDiagnosis() {
  // 신청상태 관리
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 포인트 관련
  const { startPointAction } = usePointEffect();

  async function submitDiagnosis({
    petId,
    answerList,
    eyeFiles,
    skinFiles,
    teethFiles,
  }) {
    try {
      // 신청 요청 보내면 처리중 상태 시작, 성공상태 초기화
      setIsSubmitting(true);
      setIsSuccess(false);
      setErrorMessage("");

      // 포인트 관련: 신청 전 포인트 저장
      const pointWatcher = await startPointAction(
        POINT_ACTION_TYPE.HEALTHCARE_USE,
      );

      // api 호출
      const response = await requestDiagnosis({
        petId,
        answerList,
        eyeFiles,
        skinFiles,
        teethFiles,
      });

      // 성공 여부 확인
      if (response.status !== 201) {
        throw new Error("건강진단 신청 처리에 실패했습니다.");
      }

      // 포인트 관련: 신청 후 포인트 비교 + 차감 알림
      await pointWatcher.finish();

      setIsSuccess(true);

      return response;
    } catch (error) {
      console.error("건강진단 신청 실패:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "건강진단 신청에 실패했습니다.";

      setErrorMessage(message);

      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  // 상태 초기화 함수
  function resetRequestState() {
    setIsSuccess(false);
    setErrorMessage("");
  }

  return {
    submitDiagnosis,
    isSubmitting,
    isSuccess,
    errorMessage,
    resetRequestState,
  };
}
