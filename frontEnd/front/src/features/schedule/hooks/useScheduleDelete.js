import { useState } from "react";
import { fetchScheduleDelete } from "../api/scheduleApi";

export default function useScheduleDelete() {
  const [isSuccess, setSuccess] = useState(false);

  async function handleDelete(id) {
    setSuccess(false);
    const resp = await fetchScheduleDelete(id);
    if (resp.status == 200) {
      setSuccess(true);
    }
  }

  return { handleDelete, isSuccess };
}
