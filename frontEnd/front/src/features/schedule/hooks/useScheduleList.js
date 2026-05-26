import { useState } from "react";
import { fetchScheduleList } from "../api/scheduleApi";

export default function useScheduleList() {
  const [list, setList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  async function asyncFetchScheduleList() {
    setLoading(true);
    const resp = await fetchScheduleList();

    const parsedList = resp.data.map((item) => ({
      id: item.id,

      title: item.title,

      start: item.startDate,

      end: item.endDate,

      backgroundColor: `#${item.backgroundColor}`,

      borderColor: `#${item.backgroundColor}`,

      allDay: true,
    }));

    setList(parsedList);
    setLoading(false);
  }

  return { list, isLoading, asyncFetchScheduleList };
}
