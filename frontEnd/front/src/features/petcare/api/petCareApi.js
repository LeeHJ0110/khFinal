import api from "../../../app/api/axios";

// =========================================================
// 건강진단 질문 목록 조회
// petType: D 또는 C
// =========================================================
export async function fetchQuestionList(petType) {
  return await api.get("/petcare/diagnosis/questions", {
    params: {
      petType,
    },
  });
}

// =========================================================
// 건강진단 신청 화면용 내 반려동물 목록 조회
// =========================================================
export async function fetchMyPetList() {
  return await api.get("/petcare/diagnosis/pets");
}

// =========================================================
// 건강진단 신청
// JSON 데이터와 이미지를 multipart/form-data로 전송
// =========================================================
export async function requestDiagnosis({
  petId,
  answerList,
  eyeFiles,
  skinFiles,
  teethFiles,
}) {
  const fd = new FormData();

  const data = {
    petId,
    answerList,
  };

  console.log("백엔드로 전송할 건강진단 신청 데이터:", data);

  fd.append("data", JSON.stringify(data));

  eyeFiles?.forEach((file) => {
    fd.append("eyeFiles", file);
  });

  skinFiles?.forEach((file) => {
    fd.append("skinFiles", file);
  });

  teethFiles?.forEach((file) => {
    fd.append("teethFiles", file);
  });

  return await api.post("/petcare/diagnosis", fd);
}

// =========================================================
// 건강진단 완료 처리
// =========================================================
export async function completeDiagnosis(diagnosisReqId) {
  return await api.patch(`/petcare/diagnosis/${diagnosisReqId}/complete`);
}

// =========================================================
// 건강진단 신청 반려 처리
// =========================================================
export async function rejectDiagnosis(diagnosisReqId) {
  return await api.patch(`/petcare/diagnosis/${diagnosisReqId}/reject`);
}

// =========================================================
// 반려동물 몸무게 수정
// =========================================================
export async function updatePetWeight(pet, weight) {
  return await api.put(`/pet/${pet.petId}`, {
    petType: pet.petType,
    breedName: pet.breedName,
    name: pet.name,
    gender: pet.gender,
    birthDate: pet.birthDate,
    weight,
    representYn: pet.representYn,
  });
}

// =========================================================
// 건강진단 신청 목록 조회
//
// pno: 페이지 번호
// petType:
//   ALL = 전체
//   D   = 강아지
//   C   = 고양이
// =========================================================
export async function fetchPetCareList(pno = 0, petType = "ALL") {
  return await api.get("/petcare/diagnosis/list", {
    params: {
      pno,
      petType,
    },
  });
}

// =========================================================
// 건강진단 신청 상세 조회
// =========================================================
export async function fetchPetCareDetail(diagnosisReqId) {
  return await api.get(`/petcare/diagnosis/${diagnosisReqId}`);
}
