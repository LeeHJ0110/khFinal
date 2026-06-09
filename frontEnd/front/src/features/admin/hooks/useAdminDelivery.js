import { useEffect, useState } from "react";
import {
  getAdminDeliveries,
  getAdminDeliveryDetail,
  startShippingBulk,
} from "../api/adminDeliveryApi";

export default function useAdminDelivery() {
  const [status, setStatus] = useState("READY");
  const [deliveries, setDeliveries] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [details, setDetails] = useState({});

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  async function fetchDeliveries(nextPage = page, nextStatus = status) {
    const resp = await getAdminDeliveries({
      status: nextStatus,
      page: nextPage,
      size,
    });

    setDeliveries(resp.data.content);
    setPage(resp.data.number);
    setTotalPages(resp.data.totalPages);
  }

  function changeStatus(nextStatus) {
    setStatus(nextStatus);
    setSelectedIds([]);
    setOpenId(null);
    fetchDeliveries(0, nextStatus);
  }

  function toggleSelect(deliveryId) {
    setSelectedIds((prev) =>
      prev.includes(deliveryId)
        ? prev.filter((id) => id !== deliveryId)
        : [...prev, deliveryId],
    );
  }

  function toggleSelectAll() {
    if (selectedIds.length === deliveries.length) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(deliveries.map((delivery) => delivery.deliveryId));
  }

  async function toggleOpen(deliveryId) {
    setOpenId((prev) => (prev === deliveryId ? null : deliveryId));

    if (!details[deliveryId]) {
      const resp = await getAdminDeliveryDetail(deliveryId);
      setDetails((prev) => ({
        ...prev,
        [deliveryId]: resp.data,
      }));
    }
  }

  async function handleBulkShipping() {
    if (selectedIds.length === 0) {
      alert("배송중으로 변경할 주문을 선택해주세요.");
      return;
    }

    if (!window.confirm(`${selectedIds.length}건을 배송중으로 변경할까요?`)) {
      return;
    }

    await startShippingBulk({
      deliveryIds: selectedIds,
      deliveryCompanyName: "CJ대한통운",
      deliveryTrackingNumber: "일괄처리",
    });

    alert("선택한 배송건이 배송중으로 변경되었습니다.");
    setSelectedIds([]);
    await fetchDeliveries(page, status);
  }

  useEffect(() => {
    fetchDeliveries(0, status);
  }, []);

  return {
    status,
    deliveries,
    selectedIds,
    openId,
    details,
    page,
    totalPages,
    changeStatus,
    toggleSelect,
    toggleSelectAll,
    toggleOpen,
    handleBulkShipping,
    fetchDeliveries,
  };
}
