export function getPointErrorMessage(error, fallbackMessage) {
  return error.response?.data?.message || fallbackMessage;
}

export function showPointMessage(message) {
  if (!message) {
    return;
  }

  alert(message);
}

export function getEarnPointMessage({
  beforePoint,
  afterPoint,
  earnAmount,
  successMessage,
}) {
  const diff = afterPoint - beforePoint;

  if (diff >= earnAmount) {
    return successMessage;
  }

  // 미지급일 때는 알림 안 띄움
  return "";
}

export function getUsePointMessage({
  beforePoint,
  afterPoint,
  useAmount,
  successMessage,
}) {
  const diff = beforePoint - afterPoint;

  if (diff >= useAmount) {
    return successMessage;
  }

  return "";
}
