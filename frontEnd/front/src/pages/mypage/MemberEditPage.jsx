import { useState } from "react";
import styled from "styled-components";
import MyPageLayout from "./components/MyPageLayout";

export default function MemberEditPage() {
  const [formData, setFormData] = useState({
    nickname: "냥냥러브",
    email: "petrilobe@naver.com",
    phone: "010-4890-6219",
    address: "서울특별시 강남구 테헤란로 123",
    addressDetail: "101동 1001호",
  });

  function handleChange(evt) {
    const { name, value } = evt.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    console.log("수정할 회원 정보:", formData);
    alert("회원 정보 수정 기능은 추후 연결 예정입니다.");
  }

  function handleNicknameCheck() {
    alert("닉네임 중복확인 기능은 추후 연결 예정입니다.");
  }

  function handleAddressSearch() {
    alert("주소 검색 기능은 추후 연결 예정입니다.");
  }

  return (
    <MyPageLayout>
      <Title>회원 정보 수정</Title>

      <FormCard onSubmit={handleSubmit}>
        <FormRow>
          <Label>닉네임</Label>

          <InputGroup>
            <Input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
            />
            <SmallButton type="button" onClick={handleNicknameCheck}>
              중복확인
            </SmallButton>
          </InputGroup>
        </FormRow>

        <FormRow>
          <Label>이메일</Label>

          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </FormRow>

        <FormRow>
          <Label>전화번호</Label>

          <Input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </FormRow>

        <FormRow>
          <Label>주소</Label>

          <InputGroup>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              readOnly
            />
            <SmallButton type="button" onClick={handleAddressSearch}>
              주소검색
            </SmallButton>
          </InputGroup>
        </FormRow>

        <FormRow>
          <Label>상세주소</Label>

          <Input
            type="text"
            name="addressDetail"
            value={formData.addressDetail}
            onChange={handleChange}
          />
        </FormRow>

        <ButtonArea>
          <SubmitButton type="submit">정보수정</SubmitButton>
        </ButtonArea>
      </FormCard>
    </MyPageLayout>
  );
}

const Title = styled.h1`
  font-size: 32px;
  color: #00a982;
  margin-bottom: 28px;
`;

const FormCard = styled.form`
  width: 100%;
  max-width: 760px;
  background: #e9fbf4;
  border-radius: 12px;
  padding: 48px 58px;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 22px;
`;

const Label = styled.label`
  width: 110px;
  font-size: 15px;
  font-weight: 700;
  color: #333;
`;

const InputGroup = styled.div`
  flex: 1;
  display: flex;
  gap: 12px;
`;

const Input = styled.input`
  flex: 1;
  height: 38px;
  border: none;
  border-radius: 999px;
  background: #d9f2e7;
  padding: 0 18px;
  font-size: 14px;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px #00b894;
  }
`;

const SmallButton = styled.button`
  min-width: 92px;
  height: 38px;
  border: none;
  border-radius: 999px;
  background: white;
  color: #00a982;
  font-weight: 700;
  cursor: pointer;
`;

const ButtonArea = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 34px;
`;

const SubmitButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 12px 54px;
  background: white;
  color: #00a982;
  font-weight: 800;
  cursor: pointer;
`;
