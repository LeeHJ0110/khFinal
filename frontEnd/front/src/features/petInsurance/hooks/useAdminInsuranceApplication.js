import { useCallback, useEffect, useState } from "react";

import {
  approveInsuranceApplication,
  fetchWaitingInsuranceApplicationList,
  rejectInsuranceApplication,
} from "../api/petInsuranceApi";

// =========================================================
// 관리자 펫보험 신청 목록 및 승인·반려 처리
// =========================================================
export default function useAdminInsuranceApplication() {
  const [applicationList, setApplicationList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [processingApplicationId, setProcessingApplicationId] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  // =========================================================
  // 관리자용 보험 가입 신청 목록 조회
  // =========================================================
  const loadApplicationList = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetchWaitingInsuranceApplicationList();

      setApplicationList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("보험 가입 신청 목록 조회 실패:", error);

      setApplicationList([]);

      setErrorMessage(
        getErrorMessage(error, "보험 가입 신청 목록을 불러오지 못했습니다."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // =========================================================
  // 관리자 보험 가입 승인
  // 승인 처리와 자동 쪽지 발송은 백엔드에서 함께 처리
  // =========================================================
  async function approveApplication(applicationId) {
    if (!applicationId) {
      setErrorMessage("승인할 보험 가입 신청 정보를 찾을 수 없습니다.");

      return;
    }

    const isConfirmed = window.confirm(
      "해당 펫보험 가입 신청을 승인하시겠습니까?\n\n승인 시 최초 월 보험료가 결제됩니다.",
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setProcessingApplicationId(applicationId);
      setErrorMessage("");

      await approveInsuranceApplication(applicationId);

      window.alert("펫보험 가입 신청이 승인되었습니다.");

      await loadApplicationList();
    } catch (error) {
      console.error("보험 가입 승인 실패:", error);

      setErrorMessage(
        getErrorMessage(error, "보험 가입 승인 처리에 실패했습니다."),
      );
    } finally {
      setProcessingApplicationId(null);
    }
  }

  // =========================================================
  // 관리자 보험 가입 반려
  // 반려 처리와 자동 쪽지 발송은 백엔드에서 함께 처리
  // =========================================================
  async function rejectApplication(applicationId) {
    if (!applicationId) {
      setErrorMessage("반려할 보험 가입 신청 정보를 찾을 수 없습니다.");

      return;
    }

    const isConfirmed = window.confirm(
      "해당 펫보험 가입 신청을 반려하시겠습니까?",
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setProcessingApplicationId(applicationId);
      setErrorMessage("");

      await rejectInsuranceApplication(applicationId);

      window.alert("펫보험 가입 신청이 반려되었습니다.");

      await loadApplicationList();
    } catch (error) {
      console.error("보험 가입 반려 실패:", error);

      setErrorMessage(
        getErrorMessage(error, "보험 가입 반려 처리에 실패했습니다."),
      );
    } finally {
      setProcessingApplicationId(null);
    }
  }

  // =========================================================
  // 관리자 페이지 최초 진입 시 목록 조회
  // =========================================================
  useEffect(() => {
    loadApplicationList();
  }, [loadApplicationList]);

  return {
    applicationList,

    isLoading,

    processingApplicationId,

    errorMessage,

    loadApplicationList,

    approveApplication,

    rejectApplication,
  };
}

// =========================================================
// 백엔드 에러 메시지 추출
// =========================================================
function getErrorMessage(error, defaultMessage) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    defaultMessage
  );
}
