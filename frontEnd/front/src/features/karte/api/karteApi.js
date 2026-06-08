import api from "../../../app/api/axios";

export async function fetchKarteList(page) {
  return await api.get(`/karte?pno=${page}`);
}

export async function fetchKarteWrite(vo) {
  return await api.post(`/karte`, vo);
}

export async function fetchKarteDelete(params) {
  return await api.delete(`/karte/${params}`);
}

export async function fetchKarteDetail(params) {
  return await api.get(`/karte/${params}`);
}
