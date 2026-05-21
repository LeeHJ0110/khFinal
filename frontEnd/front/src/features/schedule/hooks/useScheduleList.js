import { useState } from "react";
import { fetchBoardList } from "../api/scheduleApi";

export default function useScheduleList() {
  const [list, setList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  async function asyncFetchScheduleList() {
    setLoading(true);
    const resp = await fetchBoardList();
    console.log(resp);

    setList(resp.data);
    setLoading(false);
  }

  return { list, isLoading, asyncFetchScheduleList };
}
