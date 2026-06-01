import { useState } from "react";
import {
  checkDate,
  fetchTrainingDelete,
  fetchTrainingEdit,
  fetchTrainingInsert,
  fetchTrainingList,
} from "../api/trainingAp";
import { useNavigate } from "react-router-dom";

export default function useTraining() {
  const [isSuccess, setSuccess] = useState(false);

  async function openDetail(iDate) {
    let date = iDate;
    if (date) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");

      date = `${year}-${month}-${day}`;
    }

    const checker = await checkDate(date);

    if (checker == "등록가능") {
      // setDetailOpen(true);
    }
    // alert(checker.data);
  }

  async function insertDiary(formData) {
    setSuccess(false);
    const resp = await fetchTrainingInsert(formData);
    if (resp.status == 201) {
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
    openDetail,
    insertDiary,
    editDiary,
    deleteDiary,
  };
}
