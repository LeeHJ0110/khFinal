import styled from "styled-components";
import ScheduleMain from "../../features/schedule/components/ScheduleMain";
import TrainingDiaryModal from "../../features/schedule/components/TrainingDiaryModal";
import useTraining from "../../features/schedule/hooks/useTraining";

export default function ScheduleMainPage() {
  const { openDetail, detailOpen } = useTraining();
  // const initialState = {
  //   id: "",
  //   content: "",
  //   at: "",
  //   petList: [],
  //   isEdit: "false",
  // };
  // const { formData, handleChange } = useFormData(initialState);
  return (
    <Wrapper>
      <button onClick={openDetail}>훈련일기작성</button>
      <TrainingDiaryModal detail={detailOpen} />
      <ScheduleMain />
    </Wrapper>
  );
}

const Wrapper = styled.div``;
