export function getTokenPayload() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    return null;
  }
}

export function getLoginRole() {
  const payload = getTokenPayload();
  return payload?.role ?? null;
}
