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
