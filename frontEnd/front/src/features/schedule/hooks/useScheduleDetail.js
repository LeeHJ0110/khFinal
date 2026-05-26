import { useState } from "react";
import { fetchBoardList } from "../api/scheduleApi";

export default function useScheduleDetail() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  async function asyncFetchSchedule() {
    setLoading(true);
    const resp = await fetchBoardList();

    const parsedList = resp.data.map((item) => ({
      id: item.id,

      title: item.title,

      start: item.startDate,

      end: item.endDate,

      backgroundColor: `#${item.backgroundColor}`,

      borderColor: `#${item.backgroundColor}`,

      allDay: true,

      extendedProps: {
        content: item.content,
        at: item.at,
      },
    }));

    setData(parsedList);
    setLoading(false);
  }

  return { data, isLoading, asyncFetchSchedule };
}
