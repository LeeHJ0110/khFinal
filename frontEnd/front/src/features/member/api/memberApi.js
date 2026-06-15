import api from "./../../../app/api/axios";

export async function join(vo) {
  return await api.post(`member/join`, vo);
}

export async function loginApi(vo) {
  return await api.post(`member/login`, vo);
}

export function checkUsername(username) {
  return api.get("/member/check-username", {
    params: { username },
  });
}

export function checkNickname(nickname) {
  return api.get("/member/check-nickname", {
    params: { nickname },
  });
}

export function kakaoJoin(data) {
  return api.post("/member/kakao/join", data);
}

export function kakaoLogin(code) {
  return api.post("/member/kakao/login", {
    code,
  });
}
export function sendPhoneAuthCode(phone) {
  return api.post("/member/phone/send", { phone });
}

export function verifyPhoneAuthCode(phone, code) {
  return api.post("/member/phone/verify", { phone, code });

// 로그인한 내 정보 조회(헤더용)
export function fetchMyInfo() {
  return api.get("/member/me");
}
