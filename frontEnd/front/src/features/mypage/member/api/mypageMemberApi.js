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

export function uploadProfileImage(file) {
  const formData = new FormData();

  formData.append("file", file);

  return api.post("/member/me/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
