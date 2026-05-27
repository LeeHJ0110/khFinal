import { useState } from "react";
import { fetchPetCareDetail } from "../api/petCareApi";

export default function usePetCareDetail() {
  const [petCareVo, setPetCareVo] = useState({});
  const [isLoading, setLoading] = useState(false);

  async function asyncFetchPetCareDetail(id) {
    try {
      setLoading(true);

      const resp = await fetchPetCareDetail(id);

      setPetCareVo(resp.data);
    } catch (err) {
      console.error("진단 상세 조회 실패", err);
    } finally {
      setLoading(false);
    }
  }

  return {
    petCareVo,
    asyncFetchPetCareDetail,
    isLoading,
  };
}
