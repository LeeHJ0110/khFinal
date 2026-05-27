import api from "../../../app/api/axios";

// 질문 목록 조회
export async function fetchQuestionList(petType) {
  return await api.get(`/petcare/diagnosis/questions?petType=${petType}`);
}
// 건강진단 신청
export async function requestDiagnosis(vo, eyeFiles, skinFiles, teethFiles) {
  const fd = new FormData();

  // JSON 데이터
  fd.append(
    "data",
    new Blob([JSON.stringify(vo)], { type: "application/json" }),
  );

  // 눈 사진
  if (eyeFiles && eyeFiles.length > 0) {
    eyeFiles.forEach((file) => {
      fd.append("eyeFiles", file);
    });
  }

  // 피부 사진
  if (skinFiles && skinFiles.length > 0) {
    skinFiles.forEach((file) => {
      fd.append("skinFiles", file);
    });
  }

  // 치아 사진
  if (teethFiles && teethFiles.length > 0) {
    teethFiles.forEach((file) => {
      fd.append("teethFiles", file);
    });
  }

  return await api.post(`/petcare/diagnosis`, fd);
}
//목록보기
export async function fetchPetCareList(pno) {
  return await api.get(`/petcare/diagnosis/list?pno=${pno}`);
}

//상세보기
export async function fetchPetCareDetail(id) {
  return await api.get(`/petcare/diagnosis/${id}`);
}
