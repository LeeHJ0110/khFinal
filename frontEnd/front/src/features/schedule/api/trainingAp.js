import api from "../../../app/api/axios";

export async function fetchTrainingInsert(vo) {
  return await api.post(`/training`, vo);
}

export async function checkDate(date) {
  return await api.get(`/training/checkDate`, { params: { date } });
}
