import { useState } from "react";
import { fetchScheduleList } from "../api/scheduleApi";

export default function useScheduleList() {
  const [scheduleList, setScheduleList] = useState([]);
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
      extendedProps: {
        content: item.content,
        at: item.at,
      },
    }));

    setScheduleList(parsedList);
    setLoading(false);
  }

  return { scheduleList, isLoading, asyncFetchScheduleList };
}
