import { useState } from "react";
import {
  checkDate,
  fetchTrainingDelete,
  fetchTrainingEdit,
  fetchTrainingInsert,
  fetchTrainingList,
} from "../api/trainingAp";
import { useNavigate } from "react-router-dom";

//포인트 관련
import usePointEffect from "../../point/hooks/usePointEffect";
import { POINT_ACTION_TYPE } from "../../point/utils/pointPolicy";

export default function useTraining() {
  const [isSuccess, setSuccess] = useState(false);
  const [isDuple, setDuple] = useState(false);

  //포인트 관련
  const { startPointAction } = usePointEffect();

  async function checkToday() {
    setDuple(false);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const date = `${year}-${month}-${day}`;

    const checker = await checkDate(date);

    if (checker.data == "등록가능") {
      setDuple(true);
    } else {
      alert(checker.data);
      setDuple(false);
    }
  }

  async function insertDiary(formData) {
    setSuccess(false);

    //포인트 관련
    const pointWatcher = await startPointAction(
      POINT_ACTION_TYPE.WEEKLY_TRAINING_DIARY,
    );

    const resp = await fetchTrainingInsert(formData);
    if (resp.status == 201) {
      // 포인트 관련: 작성 후 포인트 비교 + 알림
      await pointWatcher.finish();
      setSuccess(true);
    }
  }

  async function editDiary(formData) {
    setSuccess(false);
    const resp = await fetchTrainingEdit(formData.id, formData);
    setSuccess(true);
  }

  async function deleteDiary(formData) {
    setSuccess(false);
    const resp = await fetchTrainingDelete(formData.id);
    setSuccess(true);
  }

  return {
    isSuccess,
    isDuple,
    checkToday,
    insertDiary,
    editDiary,
    deleteDiary,
  };
}
