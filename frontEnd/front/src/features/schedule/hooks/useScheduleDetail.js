import { useState } from "react";
import { fetchScheduleDetail } from "../api/scheduleApi";

export default function useScheduleDetail() {
  const [detail, setDetail] = useState([]);
  const [isLoading, setLoading] = useState(false);

  async function asyncFetchSchedule(faram) {
    setLoading(true);
    const resp = await fetchScheduleDetail(faram);

    const parsedDetail = {
      id: resp.data.id,

      title: resp.data.title,

      start: resp.data.startDate,

      end: resp.data.endDate,

      backgroundColor: `#${resp.data.backgroundColor}`,

      allDay: true,

      extendedProps: {
        content: resp.data.content,
        at: resp.data.at,
      },
    };

    setDetail(parsedDetail);
    setLoading(false);
  }

  return { detail, isLoading, asyncFetchSchedule };
}
