import api from "../../../app/api/axios";

export async function fetchScore(petId, category) {
  return await api.get(`/score`, {
    params: {
      petId: petId,
      category: category,
    },
  });
}
export async function fetchScoreAvg(breedId, petType) {
  return await api.get(`/score/avg`, {
    params: {
      breedId: breedId,
      petType: petType,
    },
  });
}
export async function fetchScoreHistory(petId) {
  return await api.get(`/score/history`, { params: { petId: petId } });
}
