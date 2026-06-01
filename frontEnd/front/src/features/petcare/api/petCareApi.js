import api from "../../../app/api/axios";

// 질문 목록 조회
export async function fetchQuestionList(petType) {
  return await api.get(`/petcare/diagnosis/questions?petType=${petType}`);
}

//반려동물 정보불러오기
export async function fetchMyPetList() {
  return await api.get(`petcare/diagnosis/pets`);
}
//건강진단 신청
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

  console.log("백엔드로 전송할 data:", data);

  fd.append("data", JSON.stringify(data));

  eyeFiles?.forEach((file) => fd.append("eyeFiles", file));
  skinFiles?.forEach((file) => fd.append("skinFiles", file));
  teethFiles?.forEach((file) => fd.append("teethFiles", file));

  return await api.post("/petcare/diagnosis", fd);
}
//펫몸무게 수정 요청 백엔드 구현예정 
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

//목록보기
export async function fetchPetCareList(pno) {
  return await api.get(`/petcare/diagnosis/list?pno=${pno}`);
}

//상세보기
export async function fetchPetCareDetail(id) {
  return await api.get(`/petcare/diagnosis/${id}`);
}
