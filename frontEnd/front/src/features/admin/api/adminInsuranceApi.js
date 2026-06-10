import api from "./../../../app/api/axios";

export function getAdminInsurances(params) {
  return api.get("/admin/pet-insurances", { params });
}

export function getAdminInsuranceDetail(applicationId) {
  return api.get(`/admin/pet-insurances/${applicationId}`);
}

export function approveInsurance(applicationId) {
  return api.put(`/admin/pet-insurances/${applicationId}/approve`);
}

export function rejectInsurance(applicationId) {
  return api.put(`/admin/pet-insurances/${applicationId}/reject`);
}

export function approveInsuranceBulk(applicationIds) {
  return api.put("/admin/pet-insurances/approve", {
    applicationIds,
  });
}

export function rejectInsuranceBulk(applicationIds) {
  return api.put("/admin/pet-insurances/reject", {
    applicationIds,
  });
}
