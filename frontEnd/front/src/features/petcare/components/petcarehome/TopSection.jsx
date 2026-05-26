import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function TopSection() {
  const navigate = useNavigate();

  const [petInfo, setPetInfo] = useState({
    petName: "깨깨",
    breedName: "비숑 프리제",
    age: "5살",
    weight: "7kg",
  });

  useEffect(() => {
    // TODO : 반려동물 조회 API 연결 예정
    // const res = await api.get("/pet/my");
    // setPetInfo(res.data);
  }, []);

  return (
    <Wrapper>
      <LeftArea>
        <Label>전문 수의사님 상시 대기</Label>

        <Title>
          PET&I FOR <span>진단의 필요성</span>
        </Title>

        <Description>
          병원 내원 없이 집에서 문진하고, 전문 수의사가 직접 문진과 이미지
          데이터를 분석하여 아이만을 위한 맞춤형 진단결과를 제공합니다.
        </Description>
      </LeftArea>

      <ApplyButton onClick={() => navigate("/healthcare/request")}>
        지금 신청하러 가기
      </ApplyButton>

      <PetArea>
        <PetImage />

        <PetName>{petInfo.petName}</PetName>

        <PetBreed>{petInfo.breedName}</PetBreed>

        <PetInfo>
          <span>{petInfo.age}</span>
          <span>{petInfo.weight}</span>
        </PetInfo>

        <ButtonGroup>
          <SubButton>지난기록 보기</SubButton>
          <ActiveButton>신청 가능</ActiveButton>
        </ButtonGroup>
      </PetArea>
    </Wrapper>
  );
}

export default TopSection;

const Wrapper = styled.section`
  width: 100%;
  min-height: 170px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 28px 44px;

  border: 1px solid #d8eee6;
  border-radius: 14px;

  background-color: #eef8f4;
`;

const LeftArea = styled.div`
  flex: 1;
`;

const Label = styled.p`
  color: #00a97b;
  font-size: 15px;
  font-weight: 700;

  margin-bottom: 14px;
`;

const Title = styled.h1`
  color: #00a97b;
  font-size: 34px;
  font-weight: 800;

  margin-bottom: 14px;

  span {
    color: #222;
  }
`;

const Description = styled.p`
  width: 560px;

  color: #111;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
`;

const ApplyButton = styled.button`
  width: 180px;
  height: 72px;

  border: 1px solid #00a97b;
  border-radius: 12px;

  background-color: white;

  color: #00a97b;
  font-size: 18px;
  font-weight: 700;

  cursor: pointer;
`;

const PetArea = styled.div`
  width: 230px;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PetImage = styled.div`
  width: 96px;
  height: 96px;

  border-radius: 50%;

  background-color: #ddd;

  margin-bottom: 8px;
`;

const PetName = styled.h3`
  font-size: 26px;
  font-weight: 800;
`;

const PetBreed = styled.p`
  font-size: 14px;
  color: #555;

  margin-bottom: 6px;
`;

const PetInfo = styled.div`
  display: flex;
  gap: 6px;

  margin-bottom: 10px;

  span {
    padding: 3px 8px;

    border-radius: 10px;

    background-color: white;

    color: #00a97b;
    font-size: 12px;
    font-weight: 700;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const SubButton = styled.button`
  padding: 8px 12px;

  border: 1px solid #ddd;
  border-radius: 6px;

  background-color: white;

  color: #555;
  font-size: 12px;
`;

const ActiveButton = styled.button`
  padding: 8px 12px;

  border: 1px solid #00a97b;
  border-radius: 6px;

  background-color: white;

  color: #00a97b;
  font-size: 12px;
  font-weight: 700;
`;
