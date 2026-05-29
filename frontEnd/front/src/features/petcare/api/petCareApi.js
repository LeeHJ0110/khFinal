import api from "../../../app/api/axios";

// 질문 목록 조회
export async function fetchQuestionList(petType) {
  return await api.get(`/petcare/diagnosis/questions?petType=${petType}`);
}
// 건강진단 신청
export async function requestDiagnosis(vo, eyeFiles, skinFiles, teethFiles) {
  const fd = new FormData();

  fd.append(
    "data",
    new Blob([JSON.stringify(vo)], { type: "application/json" }),
  );

  eyeFiles?.forEach((file) => fd.append("eyeFiles", file));
  skinFiles?.forEach((file) => fd.append("skinFiles", file));
  teethFiles?.forEach((file) => fd.append("teethFiles", file));

  return await api.post(`/petcare/diagnosis`, fd);
}
//반려동물 정보불러오기
export async function fetchMyPetList() {
  return await api.get(`petcare/diagnosis/pets`);
}
//목록보기
export async function fetchPetCareList(pno) {
  return await api.get(`/petcare/diagnosis/list?pno=${pno}`);
}

//상세보기
export async function fetchPetCareDetail(id) {
  return await api.get(`/petcare/diagnosis/${id}`);
}
