import { useState } from "react";

export default function useScheduleWrite() {
  const [isSuccess, setSuccess] = useState(false);

  async function handleWrite(vo, fileList) {
    const resp = await insertSchedule(vo, fileList);
    if (resp.status == 201) {
      setSuccess(true);
    }
  }

  return { handleWrite, isSuccess };
}
