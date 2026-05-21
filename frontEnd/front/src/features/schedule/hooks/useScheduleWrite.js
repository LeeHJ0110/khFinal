import { useState } from "react";

export default function useScheduleWrite() {
  const [isSuccess, setSuccess] = useState(false);

  async function handleWrite(vo) {
    const resp = await insertSchedule(vo);
    if (resp.status == 201) {
      setSuccess(true);
    }
  }

  return { handleWrite, isSuccess };
}
