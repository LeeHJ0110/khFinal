import { useState } from "react";
import { requestDiagnosis } from "../api/petCareApi";

export default function useRequestDiagnosis() {
  const [isSuccess, setSuccess] = useState(false);

  async function request(vo, eyeFiles, skinFiles, teethFiles) {
    const resp = await requestDiagnosis(vo, eyeFiles, skinFiles, teethFiles);

    if (resp.status === 201) {
      setSuccess(true);
    }
  }

  return { request, isSuccess };
}
