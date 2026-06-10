import { useState } from "react";
import { fetchScheduleToday } from "../api/scheduleApi";

export default function useScheduleToday() {
  const [todayList, setTodayList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  async function asyncFecthScheduleToday() {
    setLoading(true);
    const resp = await fetchScheduleToday();

    const parsedList = resp.data.map((item) => ({
      id: item.id,
      title: item.title,
      at: item.at,
      content: item.content,
      startDate: item.startDate,
      endDate: item.endDate,
      backgroundColor: item.backgroundColor,
    }));

    setTodayList(parsedList);
    setLoading(false);
  }

  return { isLoading, todayList, asyncFecthScheduleToday };
}
