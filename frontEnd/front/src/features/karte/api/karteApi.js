import api from "../../../app/api/axios";

export async function fetchKarteList() {
  return await api.get(`/karte`);
}
