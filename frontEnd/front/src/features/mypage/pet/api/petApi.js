import api from "../../../../app/api/axios";

// 펫 등록
export function createPet(data) {
  return api.post("/pet", data);
}

// 로그인한 회원의 펫 목록 조회
export function getMyPetList() {
  return api.get("/pet/me");
}

// 품종 목록 조회

export function getBreedList(petType) {
  return api.get("/pet/breed", {
    params: { petType },
  });
}

export function updatePet(petId, data) {
  return api.put(`/pet/${petId}`, data);
}

export function deletePet(petId) {
  return api.delete(`/pet/${petId}`);
}

export function changeRepresentPet(petId) {
  return api.put(`/pet/${petId}/represent`);
}
