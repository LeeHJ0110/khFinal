import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { fetchMyPetList } from "../../api/petCareApi";
import diagnosisPreviewImg from "../../img/건강진단 서브.png";
import bell from "../../img/알림.png";

/* =====================================
   생년월일 → 만 나이 계산
   API 형식: YYYYMMDD
===================================== */

function calculateAge(birthDate) {
  if (!birthDate || String(birthDate).length !== 8) {
    return null;
  }

  const dateText = String(birthDate);

  const birthYear = Number(dateText.slice(0, 4));
  const birthMonth = Number(dateText.slice(4, 6));
  const birthDay = Number(dateText.slice(6, 8));

  const today = new Date();

  let age = today.getFullYear() - birthYear;

  const birthdayPassed =
    today.getMonth() + 1 > birthMonth ||
    (today.getMonth() + 1 === birthMonth && today.getDate() >= birthDay);

  if (!birthdayPassed) {
    age -= 1;
  }

  return age;
}

/* =====================================
   프로필 이미지 필드 확인
   실제 DTO 필드명이 확인되면 하나만 남겨도 됨
===================================== */

function getProfileImageUrl(petInfo) {
  return (
    petInfo?.profileImageUrl ??
    petInfo?.profileImgUrl ??
    petInfo?.imageUrl ??
    petInfo?.petImageUrl ??
    petInfo?.profileUrl ??
    null
  );
}

function PreviewSection() {
  const navigate = useNavigate();

  const [petInfo, setPetInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPetInfo() {
      try {
        const res = await fetchMyPetList();

        console.log("반려동물 목록:", res.data);

        const petList = Array.isArray(res.data) ? res.data : [];

        const representPet =
          petList.find((pet) => pet.representYn === "Y") ?? petList[0];

        setPetInfo(representPet ?? null);
      } catch (err) {
        console.error("반려동물 정보 조회 실패:", err);
        setPetInfo(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadPetInfo();
  }, []);

  if (isLoading) {
    return (
      <PreviewWrapper>
        <LoadingText>반려동물 정보를 불러오는 중입니다.</LoadingText>
      </PreviewWrapper>
    );
  }

  const profileImageUrl = getProfileImageUrl(petInfo);
  const age = calculateAge(petInfo?.birthDate);

  //신청중 상태 표시
  const isApplying = petInfo?.diagnosisInProgress === true;

  return (
    <PreviewWrapper>
      {/* =====================================
          1. 로그인한 회원의 반려동물 정보
      ===================================== */}
      <PetProfileArea>
        {petInfo ? (
          <>
            <ProfileImageBox>
              {profileImageUrl ? (
                <ProfileImage
                  src={profileImageUrl}
                  alt={`${petInfo.name ?? "반려동물"} 프로필`}
                />
              ) : (
                <NoProfileImage>이미지 없음</NoProfileImage>
              )}
            </ProfileImageBox>

            <ProfileContent>
              <PetName>{petInfo.name ?? "이름 정보 없음"}</PetName>

              <PetBreed>{petInfo.breedName ?? "품종 정보 없음"}</PetBreed>

              <PetInfoList>
                <PetInfoBadge>
                  💚 {age !== null ? `${age}살` : "나이 정보 없음"}
                </PetInfoBadge>

                <PetInfoBadge>
                  ⚖️{" "}
                  {petInfo.weight !== null && petInfo.weight !== undefined
                    ? `${petInfo.weight}kg`
                    : "체중 정보 없음"}
                </PetInfoBadge>

                <PetInfoBadge>
                  {petInfo.gender === "M"
                    ? "♂ 남아"
                    : petInfo.gender === "F"
                      ? "♀ 여아"
                      : "성별 정보 없음"}
                </PetInfoBadge>
              </PetInfoList>

              <ProfileButtonGroup>
                <SubButton
                  type="button"
                  onClick={() => navigate("/healthcare/history")}
                >
                  지난 기록 보기
                </SubButton>

                <ApplyButton
                  type="button"
                  disabled={isApplying}
                  onClick={() => {
                    if (!isApplying) {
                      navigate("/healthcare/request");
                    }
                  }}
                >
                  {isApplying ? "신청 중" : "신청 가능"}
                </ApplyButton>
              </ProfileButtonGroup>
            </ProfileContent>
          </>
        ) : (
          <EmptyPetArea>
            <EmptyPetText>등록된 반려동물이 없습니다.</EmptyPetText>

            <RegisterButton
              type="button"
              onClick={() => navigate("/mypage/pet-manage")}
            >
              반려동물 등록하기
            </RegisterButton>
          </EmptyPetArea>
        )}
      </PetProfileArea>

      {/* =====================================
          2. 진단이 필요한 경우
      ===================================== */}
      <NeedDiagnosisArea>
        <NeedTextArea>
          <TitleRow>
            <BellIcon src={bell} alt="알림" />
            <NeedTitle>진단이 필요한 경우</NeedTitle>
          </TitleRow>
          <NeedList>
            <NeedItem>
              <CheckIcon>✓</CheckIcon>
              최근 병원 방문이 어려울 때
            </NeedItem>

            <NeedItem>
              <CheckIcon>✓</CheckIcon>
              식욕이나 행동 변화가 있을 때
            </NeedItem>

            <NeedItem>
              <CheckIcon>✓</CheckIcon>
              눈, 피부, 치아 이상이 의심될 때
            </NeedItem>

            <NeedItem>
              <CheckIcon>✓</CheckIcon>
              정기적인 건강 상태 확인이 필요할 때
            </NeedItem>
          </NeedList>
        </NeedTextArea>

        <NeedImage
          src={diagnosisPreviewImg}
          alt="강아지와 고양이 건강진단 안내"
        />
      </NeedDiagnosisArea>
    </PreviewWrapper>
  );
}

export default PreviewSection;

/* =====================================
   전체 영역
===================================== */

const PreviewWrapper = styled.aside`
  width: 95%;
  height: 100%;

  justify-self: start;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 12px;
`;
/* =====================================
   반려동물 정보
===================================== */

const PetProfileArea = styled.section`
  min-height: 178px;

  display: flex;
  align-items: center;
  gap: 18px;

  padding: 16px 18px;

  border: 1px solid rgba(0, 169, 123, 0.18);
  border-radius: 12px;

  background: var(--color-white);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(0, 169, 123, 0.38);
    box-shadow: 0 10px 24px rgba(0, 169, 123, 0.1);
  }
`;

const ProfileImageBox = styled.div`
  width: 128px;
  height: 128px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  overflow: hidden;

  background: var(--color-bg-light);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  ${PetProfileArea}:hover & {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 169, 123, 0.14);
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;

  transition: transform 0.3s ease;

  ${PetProfileArea}:hover & {
    transform: scale(1.08);
  }
`;

const NoProfileImage = styled.span`
  color: var(--text-desc);
  font-size: 12px;
  font-weight: 600;
`;

const ProfileContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const PetName = styled.h2`
  margin: 0 0 4px;

  color: var(--text-main);
  font-size: 25px;
  font-weight: 800;

  transition: color 0.2s ease;

  ${PetProfileArea}:hover & {
    color: var(--color-main);
  }
`;

const PetBreed = styled.p`
  margin: 0 0 12px;

  color: var(--text-sub);
  font-size: 13px;
  font-weight: 500;
`;

const PetInfoList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;

  margin-bottom: 14px;
`;

const PetInfoBadge = styled.span`
  padding: 4px 9px;

  border: 1px solid rgba(0, 169, 123, 0.16);
  border-radius: 6px;

  background: var(--color-white);
  color: var(--text-sub);

  font-size: 11px;
  font-weight: 600;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  ${PetProfileArea}:hover & {
    border-color: rgba(0, 169, 123, 0.3);
    background: var(--color-bg-light);
  }

  &:hover {
    transform: translateY(-2px);
  }
`;

const ProfileButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const SubButton = styled.button`
  height: 40px;

  border: 1px solid var(--text-disabled);
  border-radius: 7px 0 0 7px;

  background: var(--color-white);
  color: var(--text-sub);

  font-size: 11px;
  font-weight: 600;

  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: var(--color-bg-light);
    color: var(--color-main);
  }
`;

const ApplyButton = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 7px;
  background: #00a97b;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;

  &:disabled {
    background: #c5d4cf;
    cursor: not-allowed;
  }
`;

/* =====================================
   반려동물을 등록하지 않은 경우
===================================== */

const EmptyPetArea = styled.div`
  width: 100%;
  min-height: 126px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const EmptyPetText = styled.p`
  margin: 0;

  color: var(--text-sub);
  font-size: 14px;
  font-weight: 600;
`;

const RegisterButton = styled.button`
  padding: 10px 16px;

  border: 1px solid var(--color-main);
  border-radius: 8px;

  background: var(--color-white);
  color: var(--color-main);

  font-size: 13px;
  font-weight: 700;
`;

/* =====================================
   진단이 필요한 경우
===================================== */

const NeedDiagnosisArea = styled.section`
  min-height: 158px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  padding: 2px 18px;

  border-radius: 10px;

  background: color-mix(in srgb, var(--color-bg-soft) 55%, var(--color-white));
`;

const NeedTextArea = styled.div`
  flex: 1;
`;

const NeedTitle = styled.h2`
  color: var(--text-main);
  font-size: 20px;
  font-weight: 800;
`;

const NeedList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 15px;

  padding: 3px;

  list-style: none;
`;

const NeedItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;

  color: var(--text-sub);
  font-size: 15px;
  font-weight: 500;
`;

const CheckIcon = styled.span`
  width: 17px;
  height: 17px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;

  background: var(--color-main);
  color: var(--color-white);

  font-size: 11px;
  font-weight: 800;
`;

const NeedImage = styled.img`
  width: 317px;
  height: auto;
  flex-shrink: 0;
  object-fit: contain;
`;

/* =====================================
   로딩 문구
===================================== */

const LoadingText = styled.p`
  margin: 0;
  padding: 24px;

  color: var(--text-sub);
  font-size: 14px;
  font-weight: 600;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BellIcon = styled.img`
  width: 34px;
  height: 34px;

  object-fit: contain;
`;
