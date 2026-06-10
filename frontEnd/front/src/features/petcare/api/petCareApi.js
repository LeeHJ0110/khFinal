import api from "../../../app/api/axios";

// =========================================================
// 건강진단 신청 화면
// =========================================================

// 건강진단 질문 목록 조회
// petType: D = 강아지, C = 고양이
export function fetchQuestionList(petType) {
  return api.get("/petcare/diagnosis/questions", {
    params: {
      petType,
    },
  });
}

// 건강진단 신청 화면용 내 반려동물 목록 조회
export function fetchMyPetList() {
  return api.get("/petcare/diagnosis/pets");
}

// 건강진단 신청
// JSON 데이터와 이미지를 multipart/form-data로 전송
export function requestDiagnosis({
  petId,
  answerList,
  eyeFiles,
  skinFiles,
  teethFiles,
}) {
  const formData = new FormData();

  const diagnosisData = {
    petId,
    answerList,
  };

  console.log("백엔드로 전송할 건강진단 신청 데이터:", diagnosisData);

  // 일반 데이터는 JSON 문자열로 변환해서 전송
  formData.append("data", JSON.stringify(diagnosisData));

  // 이미지 파일 목록 추가
  appendFileList(formData, "eyeFiles", eyeFiles);
  appendFileList(formData, "skinFiles", skinFiles);
  appendFileList(formData, "teethFiles", teethFiles);

  return api.post("/petcare/diagnosis", formData);
}

// =========================================================
// 반려동물 정보 수정
// =========================================================

// 반려동물 몸무게 수정
export function updatePetWeight(pet, weight) {
  return api.put(`/pet/${pet.petId}`, {
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
// 수의사·관리자용 건강진단 관리
// =========================================================

// 건강진단 신청 목록 조회
//
// pno: 페이지 번호
// petType:
//   ALL = 전체
//   D   = 강아지
//   C   = 고양이
export function fetchPetCareList(pno = 0, petType = "ALL") {
  return api.get("/petcare/diagnosis/list", {
    params: {
      pno,
      petType,
    },
  });
}

// 건강진단 신청 상세 조회
export function fetchPetCareDetail(diagnosisReqId) {
  return api.get(`/petcare/diagnosis/${diagnosisReqId}`);
}

// 건강진단 완료 처리
export function completeDiagnosis(diagnosisReqId) {
  return api.patch(`/petcare/diagnosis/${diagnosisReqId}/complete`);
}

// 건강진단 신청 반려 처리
export function rejectDiagnosis(diagnosisReqId) {
  return api.patch(`/petcare/diagnosis/${diagnosisReqId}/reject`);
}

// =========================================================
// 내부 공통 함수
// =========================================================

// FormData에 파일 목록 추가
function appendFileList(formData, fieldName, fileList) {
  fileList?.forEach((file) => {
    formData.append(fieldName, file);
  });
}
