import api from "../../../app/api/axios";

export function getAdminMembers(params) {
  return api.get("/admin/members", { params });
}

export function getAdminMemberDetail(memberId) {
  return api.get(`/admin/members/${memberId}`);
}

export function updateMemberStatus(memberId, status) {
  return api.put(`/admin/members/${memberId}/status`, {
    status,
  });
}

export function updateMemberRole(memberId, role) {
  return api.put(`/admin/members/${memberId}/role`, {
    role,
  });
}

export function cleanMemberNickname(memberId) {
  return api.put(`/admin/members/${memberId}/nickname/clean`);
}

export function getAdminMe() {
  return api.get("/admin/members/profile/me");
}
