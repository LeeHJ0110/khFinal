import { useState } from "react";
import { fetchScore, fetchScoreAvg, fetchScoreHistory } from "../api/scoreApi";

export default function useScore() {
  const [data, setData] = useState({});
  const [listArr, setListArr] = useState([]);
  const [listHis, setListHis] = useState([]);
  const [isLoading, setLoading] = useState(false);

  async function asyncFetchScoreHistory(petId) {
    setLoading(true);
    const resp = await fetchScoreHistory(petId);
    setListHis(resp.data);

    setLoading(false);
  }

  async function asyncFetchScore(petId, category) {
    setLoading(true);
    const resp = await fetchScore(petId, category);
    setData(resp.data);

    setLoading(false);
  }

  async function asyncFetchScoreAvg(breedId, petType) {
    setLoading(true);
    const resp = await fetchScoreAvg(breedId, petType);
    setListArr(resp.data);

    setLoading(false);
  }

  return {
    isLoading,
    data,
    listArr,
    listHis,
    asyncFetchScore,
    asyncFetchScoreAvg,
    asyncFetchScoreHistory,
  };
}
