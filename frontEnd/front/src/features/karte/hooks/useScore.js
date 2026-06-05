import { useState } from "react";
import { fetchScore, fetchScoreAvg, fetchScoreHistory } from "../api/scoreApi";

export default function useScore() {
  const [data, setData] = useState({});
  const [listArr, setListArr] = useState([]);
  const [listHis, setListHis] = useState([]);

  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isScoreLoading, setIsScoreLoading] = useState(false);
  const [isAvgLoading, setIsAvgLoading] = useState(false);

  async function asyncFetchScoreHistory(petId) {
    setIsHistoryLoading(true);
    const resp = await fetchScoreHistory(petId);
    setListHis(resp.data);

    setIsHistoryLoading(false);
  }

  async function asyncFetchScore(petId, category) {
    setIsScoreLoading(true);
    const resp = await fetchScore(petId, category);
    setData(resp.data);

    setIsScoreLoading(false);
  }

  async function asyncFetchScoreAvg(petId) {
    setIsAvgLoading(true);
    const resp = await fetchScoreAvg(petId);
    setListArr(resp.data);

    setIsAvgLoading(false);
  }

  const isLoading = isHistoryLoading || isScoreLoading || isAvgLoading;

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
