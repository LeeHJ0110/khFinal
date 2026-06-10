import { useState } from "react";
import { requestDiagnosis } from "../api/petCareApi";

export default function useRequestDiagnosis() {
  //신청상태 관리
  const [isSubmitting, setIsSubmitting] = useState(false); //신청중true 버튼 비활성화
  const [isSuccess, setIsSuccess] = useState(false); //신청이 정상적으로 완료되었는지 여부
  const [errorMessage, setErrorMessage] = useState("");

  async function submitDiagnosis({
    petId,
    answerList,
    eyeFiles,
    skinFiles,
    teethFiles,
  }) {
    try {
      //신창여청보내면 처리중상태 시작, 성공상태 초기화
      setIsSubmitting(true);
      setIsSuccess(false);
      setErrorMessage("");

      //api 호출
      const response = await requestDiagnosis({
        petId,
        answerList,
        eyeFiles,
        skinFiles,
        teethFiles,
      });
      //성공여부 확인
      if (response.status !== 201) {
        throw new Error("건강진단 신청 처리에 실패했습니다.");
      }

      setIsSuccess(true);

      return response;
      //실패메서드 저장
    } catch (error) {
      console.error("건강진단 신청 실패:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "건강진단 신청에 실패했습니다.";

      setErrorMessage(message);

      throw error;
      //요청종료
    } finally {
      setIsSubmitting(false);
    }
  }
  //상태 초기화 함수
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
