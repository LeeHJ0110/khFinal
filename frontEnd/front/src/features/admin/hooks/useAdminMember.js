import { useEffect, useState } from "react";
import { getAdminMemberDetail, getAdminMembers } from "../api/adminMemberApi";

export default function useAdminMember() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchType, setSearchType] = useState("username");
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState({
    petType: "",
    marketingAgreeYn: "",
    status: "",
    role: "",
    adminOnly: "",
  });

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  async function fetchMembers(nextPage = page) {
    const params = {
      page: nextPage,
      size,
      keyword: keyword || null,
      petType: filters.petType || null,
      marketingAgreeYn: filters.marketingAgreeYn || null,
      status: filters.status || null,
      role: filters.role || null,
      adminOnly: filters.adminOnly || null,
      searchType,
    };

    const resp = await getAdminMembers(params);

    setMembers(resp.data.content);
    setTotalPages(resp.data.totalPages);
    setPage(resp.data.number);
  }

  async function fetchMemberDetail(memberId) {
    const resp = await getAdminMemberDetail(memberId);
    setSelectedMember(resp.data);
  }

  function handleSearch() {
    fetchMembers(0);
  }

  function toggleFilter(name, value) {
    setFilters((prev) => {
      const nextValue = prev[name] === value ? "" : value;

      return {
        ...prev,
        [name]: nextValue,
      };
    });

    setPage(0);
  }

  useEffect(() => {
    fetchMembers(0);
  }, [filters]);

  async function refresh() {
    await fetchMembers(page);

    if (selectedMember) {
      await fetchMemberDetail(selectedMember.memberId);
    }
  }
  return {
    members,
    selectedMember,
    keyword,
    setKeyword,
    filters,
    page,
    totalPages,
    fetchMembers,
    fetchMemberDetail,
    handleSearch,
    toggleFilter,
    refresh,
    searchType,
    setSearchType,
  };
}
