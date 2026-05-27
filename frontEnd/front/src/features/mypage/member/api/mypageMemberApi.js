import api from "../../../../app/api/axios";

export function getMyInfo() {
  return api.get("/member/me");
}

export function checkNickname(nickname) {
  return api.get("/member/check-nickname", {
    params: { nickname },
  });
}

export function updateMyInfo(data) {
  return api.put("/member/me", data);
}
