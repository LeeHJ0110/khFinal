import api from "../../../app/api/axios";

export async function insertSchedule(vo) {
  const fd = new FormData();

  fd.append(
    "data",
    new Blob([JSON.stringify(vo)], { type: "application/json" }),
  );

  // if (fileList && fileList.length > 0) { TODO 파일 처리하기
  //   fileList.forEach((file) => {
  //     fd.append("fileList", file);
  //   });
  // }

  return await api.post(`/schedule`, fd);
}

export async function fetchScheduleList() {
  return await api.get(`/schedule`);
}

export async function fetchScheduleDetail(faram) {
  return await api.get(`schedule/${faram}`);
}
