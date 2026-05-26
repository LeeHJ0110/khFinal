import api from "../../../../app/api/axios";

// 펫 등록
export function createPet(data) {
  return api.post("/pet", data);
}

// 로그인한 회원의 펫 목록 조회
export function getMyPetList() {
  return api.get("/pet/me");
}
