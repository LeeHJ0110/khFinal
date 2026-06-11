import { useEffect, useMemo, useState } from "react";
import { fetchMyPoint } from "../../point/api/pointApi";

export default function useStorePaymentPoint({
  totalProductAmount = 0,
  orderDeliveryFee = 0,
  initialUsedPoint = 0,
}) {
  const [currentPoint, setCurrentPoint] = useState(0);
  const [isPointLoaded, setIsPointLoaded] = useState(false);
  const [usedPoint, setUsedPoint] = useState(Number(initialUsedPoint || 0));

  const paymentTargetAmount = totalProductAmount + orderDeliveryFee;

  const finalOrderAmount = useMemo(() => {
    return Math.max(paymentTargetAmount - usedPoint, 0);
  }, [paymentTargetAmount, usedPoint]);

  async function loadMyPoint() {
    try {
      const response = await fetchMyPoint();
      setCurrentPoint(Number(response.data || 0));
    } catch (error) {
      console.error("내 포인트 조회 실패:", error);
      setCurrentPoint(0);
    } finally {
      setIsPointLoaded(true);
    }
  }

  function normalizePointUnit(point) {
    return Math.floor(Number(point || 0) / 100) * 100;
  }

  function limitUsedPoint(nextPoint) {
    let point = Number(nextPoint || 0);

    if (Number.isNaN(point)) {
      point = 0;
    }

    if (point < 0) {
      point = 0;
    }

    // 포인트 조회가 끝난 뒤에만 보유 포인트 기준으로 제한
    if (isPointLoaded && point > currentPoint) {
      point = currentPoint;
    }

    if (paymentTargetAmount > 0 && point > paymentTargetAmount) {
      point = paymentTargetAmount;
    }

    return point;
  }

  function handleChangeUsedPoint(nextPoint) {
    setUsedPoint(limitUsedPoint(nextPoint));
  }

  function handleBlurUsedPoint() {
    setUsedPoint((prev) => normalizePointUnit(limitUsedPoint(prev)));
  }

  function handleUseAllPoint() {
    const maxUsablePoint = Math.min(currentPoint, paymentTargetAmount);
    const normalizedPoint = normalizePointUnit(maxUsablePoint);

    setUsedPoint(normalizedPoint);
  }

  function validateUsedPointUnit() {
    if (usedPoint > 0 && usedPoint % 100 !== 0) {
      const normalizedPoint = normalizePointUnit(limitUsedPoint(usedPoint));

      setUsedPoint(normalizedPoint);
      alert("포인트는 100P 단위로만 사용할 수 있습니다.");

      return false;
    }

    return true;
  }

  useEffect(() => {
    loadMyPoint();
  }, []);

  useEffect(() => {
    setUsedPoint(Number(initialUsedPoint || 0));
  }, [initialUsedPoint]);

  useEffect(() => {
    if (paymentTargetAmount <= 0) {
      return;
    }

    setUsedPoint((prev) => {
      if (prev > paymentTargetAmount) {
        return normalizePointUnit(paymentTargetAmount);
      }

      return prev;
    });
  }, [paymentTargetAmount]);

  useEffect(() => {
    if (!isPointLoaded) {
      return;
    }

    setUsedPoint((prev) => {
      if (prev > currentPoint) {
        return normalizePointUnit(currentPoint);
      }

      return prev;
    });
  }, [currentPoint, isPointLoaded]);

  return {
    currentPoint,
    usedPoint,
    finalOrderAmount,

    loadMyPoint,
    handleChangeUsedPoint,
    handleBlurUsedPoint,
    handleUseAllPoint,
    validateUsedPointUnit,
  };
}
