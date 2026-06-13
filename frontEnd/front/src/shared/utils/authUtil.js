export function decodeJwtPayload(token) {
  try {
    if (!token) {
      return null;
    }

    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );

    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error("토큰 디코딩 실패", error);
    return null;
  }
}

export function getLoginMemberFromToken() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return null;
  }

  const payload = decodeJwtPayload(token);

  if (!payload) {
    return null;
  }

  return {
    username: payload.username,
    nickname: payload.nickname,
    role: payload.role,
  };
}

export function normalizeRole(role) {
  return String(role ?? "")
    .replace("ROLE_", "")
    .trim()
    .toUpperCase();
}

export function isStoreAdmin(loginMember) {
  const role = normalizeRole(loginMember?.role);

  return ["A", "S", "ADMIN", "STORE"].includes(role);
}

export function isStoreUser(loginMember) {
  const role = normalizeRole(loginMember?.role);

  return ["U", "USER", "MEMBER"].includes(role);
}
