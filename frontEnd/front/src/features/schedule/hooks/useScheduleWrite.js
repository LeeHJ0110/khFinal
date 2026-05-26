import { useState } from "react";
import { insertSchedule } from "../api/scheduleApi";

export default function useScheduleWrite() {
  const [isSuccess, setSuccess] = useState(false);

  async function handleWrite(vo) {
    console.log(vo);

    const resp = await insertSchedule(vo);
    if (resp.status == 201) {
      setSuccess(true);
    }
  }

  return { handleWrite, isSuccess };
}
