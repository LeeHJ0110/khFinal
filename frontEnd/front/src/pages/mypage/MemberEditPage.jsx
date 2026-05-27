import { useEffect, useState } from "react";
import styled from "styled-components";
import MyPageLayout from "./components/MyPageLayout";
import useMypageMember from "../../features/mypage/member/hooks/useMypageMember";

export default function MemberEditPage() {
  const { member, loading, handleNicknameCheck, handleUpdateMyInfo } =
    useMypageMember();

  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    phone: "",
    address: "",
    addressDetail: "",
  });

  const [isNicknameChecked, setNicknameChecked] = useState(false);
  const [checkedNickname, setCheckedNickname] = useState("");

  useEffect(() => {
    if (!member) {
      return;
    }

    setFormData({
      nickname: member.nickname || "",
      email: member.email || "",
      phone: member.phone || "",
      address: member.address || "",
      addressDetail: member.addressDetail || "",
    });
  }, [member]);

  function handleChange(evt) {
    const { name, value } = evt.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "nickname") {
      setNicknameChecked(false);
      setCheckedNickname("");
    }
  }

  async function handleCheckNickname() {
    const result = await handleNicknameCheck(formData.nickname);

    if (result) {
      setNicknameChecked(true);
      setCheckedNickname(formData.nickname);
    }
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    if (!formData.nickname.trim()) {
      alert("닉네임을 입력하세요.");
      return;
    }

    if (!formData.email.trim()) {
      alert("이메일을 입력하세요.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("전화번호를 입력하세요.");
      return;
    }

    if (
      member?.nickname !== formData.nickname &&
      (!isNicknameChecked || checkedNickname !== formData.nickname)
    ) {
      alert("닉네임 중복확인을 해주세요.");
      return;
    }

    await handleUpdateMyInfo(formData);
  }

  return (
    <MyPageLayout>
      <Title>회원 정보 수정</Title>

      <FormCard onSubmit={handleSubmit}>
        {loading && <LoadingText>회원 정보를 불러오는 중...</LoadingText>}

        <FormRow>
          <Label>닉네임</Label>

          <InputGroup>
            <Input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
            />

            <SmallButton type="button" onClick={handleCheckNickname}>
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

            <SmallButton
              type="button"
              onClick={() => alert("주소검색 기능은 추후 연결 예정입니다.")}
            >
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
          <SubmitButton type="submit" disabled={loading}>
            정보수정
          </SubmitButton>
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

const LoadingText = styled.div`
  margin-bottom: 20px;
  color: #777;
  font-weight: 700;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
