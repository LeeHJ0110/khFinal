import { useState } from "react";
import { fetchScheduleEdit } from "../api/scheduleApi";

export default function useScheduleEdit() {
  const [isSuccess, setSuccess] = useState(false);

  async function handleEdit(vo) {
    setSuccess(false);
    const resp = await fetchScheduleEdit(vo.id, vo);
    if (resp.status == 200) {
      setSuccess(true);
    }
  }

  return { handleEdit, isSuccess };
}
