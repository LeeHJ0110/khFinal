import { useState } from "react";
import { fetchTrainingList } from "../api/trainingAp";

export default function useTrainingList() {
  const [trainingList, setTrainingList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  async function fetchDiaryList() {
    setLoading(true);
    const resp = await fetchTrainingList();

    const parsedList = resp.data.map((item) => ({
      title: "training",
      id: item.id,
      start: new Date(item.createdAt),
      extendedProps: {
        type: "training",
        content: item.content,
        trainingTime: item.trainingTime,
        createdAt: item.createdAt,
      },
    }));

    setTrainingList(parsedList);
    setLoading(false);
  }

  return { trainingList, isLoading, fetchDiaryList };
}
