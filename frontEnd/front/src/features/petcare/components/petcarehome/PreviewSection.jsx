import styled from "styled-components";
import diagnosisPreviewImg from "../../img/petsidehome2.png";

function PreviewSection() {
  return (
    <Wrapper>
      <PreviewImage src={diagnosisPreviewImg} alt="건강진단 미리보기" />
    </Wrapper>
  );
}

export default PreviewSection;

const Wrapper = styled.section`
  width: 100%;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;

  min-height: 420px;

  object-fit: cover;

  border-radius: 14px;
  display: block;
`;
