import { useEffect, useState } from "react";

import {
  getAdminInsurances,
  getAdminInsuranceDetail,
  approveInsuranceBulk,
  rejectInsuranceBulk,
} from "../api/adminInsuranceApi";

export default function useAdminInsurance() {
  const [status, setStatus] = useState("WAITING");

  const [applications, setApplications] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]);

  const [openId, setOpenId] = useState(null);

  const [details, setDetails] = useState({});

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  async function fetchApplications(nextPage = page, nextStatus = status) {
    const resp = await getAdminInsurances({
      status: nextStatus,
      page: nextPage,
      size: 10,
    });

    setApplications(resp.data.content);
    setPage(resp.data.number);
    setTotalPages(resp.data.totalPages);
  }

  async function changeStatus(nextStatus) {
    setStatus(nextStatus);

    setSelectedIds([]);
    setOpenId(null);

    await fetchApplications(0, nextStatus);
  }

  async function toggleOpen(applicationId) {
    setOpenId((prev) => (prev === applicationId ? null : applicationId));

    if (!details[applicationId]) {
      const resp = await getAdminInsuranceDetail(applicationId);

      setDetails((prev) => ({
        ...prev,
        [applicationId]: resp.data,
      }));
    }
  }

  function toggleSelect(applicationId) {
    setSelectedIds((prev) =>
      prev.includes(applicationId)
        ? prev.filter((id) => id !== applicationId)
        : [...prev, applicationId],
    );
  }

  async function handleApprove() {
    await approveInsuranceBulk(selectedIds);

    alert("승인 완료");

    setSelectedIds([]);

    await fetchApplications(page, status);
  }

  async function handleReject() {
    await rejectInsuranceBulk(selectedIds);

    alert("반려 완료");

    setSelectedIds([]);

    await fetchApplications(page, status);
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    status,
    applications,
    selectedIds,
    openId,
    details,

    page,
    totalPages,

    changeStatus,
    toggleOpen,
    toggleSelect,

    handleApprove,
    handleReject,

    fetchApplications,
  };
}
