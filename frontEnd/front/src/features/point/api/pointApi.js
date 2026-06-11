import api from "../../../app/api/axios";

/**
 * 내 현재 포인트 조회
 * GET /api/point/me
 */
export async function fetchMyPoint() {
  return await api.get(`/point/me`);
}

/**
 * 내 포인트 내역 조회
 * GET /api/point/history?page=0
 */
export async function fetchMyPointHistory(page = 0) {
  return await api.get(`/point/history`, {
    params: { page },
  });
}

/**
 * 일일 출석체크 포인트 적립
 * POST /api/point/attendance
 */
export async function fetchDailyAttendancePoint() {
  return await api.post(`/point/attendance`);
}

/**
 * 회원가입 감사 이벤트 포인트 적립
 * POST /api/point/event-join
 */
export async function fetchEventJoinPoint() {
  return await api.post(`/point/event-join`);
}
