import api from "../../../app/api/axios";

export async function fetchTrainingInsert(vo) {
  return await api.post(`/training`, vo);
}

export async function checkDate(date) {
  return await api.get(`/training/checkDate`, { params: { date } });
}

export async function fetchTrainingList() {
  return await api.get(`/training`);
}

export async function fetchTrainingDelete(params) {
  return await api.delete(`/training/${params}`);
}

export async function fetchTrainingEdit(params, vo) {
  return await api.put(`/training/${params}`, vo);
}
