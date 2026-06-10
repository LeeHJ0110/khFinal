import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { fetchMyPetList } from "../../api/petCareApi";
import diagnosisPreviewImg from "../../img/건강진단 서브.png";
import bell from "../../img/알림.png";

/* =====================================
   생년월일 → 만 나이 계산

   지원 형식
   - YYYYMMDD
   - YYYY-MM-DD
===================================== */

function calculateAge(birthDateValue) {
  if (!birthDateValue) {
    return null;
  }

  const value = String(birthDateValue).trim();

  let birthYear;
  let birthMonth;
  let birthDay;

  // 예: 20200101
  if (/^\d{8}$/.test(value)) {
    birthYear = Number(value.slice(0, 4));
    birthMonth = Number(value.slice(4, 6));
    birthDay = Number(value.slice(6, 8));
  }

  // 예: 2020-01-01
  else if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const dateParts = value.split("-");

    birthYear = Number(dateParts[0]);
    birthMonth = Number(dateParts[1]);
    birthDay = Number(dateParts[2]);
  } else {
    return null;
  }

  const birthDate = new Date(birthYear, birthMonth - 1, birthDay);

  // 잘못된 날짜 방어
  // 예: 20201345
  if (
    birthDate.getFullYear() !== birthYear ||
    birthDate.getMonth() !== birthMonth - 1 ||
    birthDate.getDate() !== birthDay
  ) {
    return null;
  }

  const today = new Date();

  let age = today.getFullYear() - birthYear;

  const birthdayPassed =
    today.getMonth() > birthMonth - 1 ||
    (today.getMonth() === birthMonth - 1 && today.getDate() >= birthDay);

  if (!birthdayPassed) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

/* =====================================
   프로필 이미지 필드 확인
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

function PreviewSection({ selectedPet, onChangeSelectedPet }) {
  const navigate = useNavigate();

  const [petList, setPetList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isPetMenuOpen, setIsPetMenuOpen] = useState(false);

  const [hasProfileImageError, setHasProfileImageError] = useState(false);

  // 부모 컴포넌트에서 관리하는 선택 펫
  const petInfo = selectedPet;

  // =====================================
  // 로그인한 회원의 반려동물 목록 조회
  // =====================================
  useEffect(() => {
    async function loadPetInfo() {
      try {
        const response = await fetchMyPetList();

        const fetchedPetList = Array.isArray(response.data)
          ? response.data
          : [];

        setPetList(fetchedPetList);

        // 대표 펫이 있으면 대표 펫 선택
        // 없으면 목록의 첫 번째 펫 선택
        const representPet =
          fetchedPetList.find((pet) => pet.representYn === "Y") ??
          fetchedPetList[0];

        onChangeSelectedPet(representPet ?? null);
      } catch (error) {
        console.error("반려동물 정보 조회 실패:", error);

        onChangeSelectedPet(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadPetInfo();
  }, [onChangeSelectedPet]);

  // 현재 선택된 펫 이미지 URL
  const profileImageUrl = getProfileImageUrl(petInfo);

  // =====================================
  // 펫 또는 이미지 주소 변경 시
  // 기존 이미지 오류 상태 초기화
  // =====================================
  useEffect(() => {
    setHasProfileImageError(false);
  }, [petInfo?.petId, profileImageUrl]);

  if (isLoading) {
    return (
      <PreviewWrapper>
        <LoadingText>반려동물 정보를 불러오는 중입니다.</LoadingText>
      </PreviewWrapper>
    );
  }

  const age = calculateAge(petInfo?.birthDate);

  // 현재 선택된 펫의 건강진단 진행 여부
  const isApplying = petInfo?.diagnosisInProgress === true;

  // =====================================
  // 선택한 펫 변경
  // =====================================
  function handleSelectPet(pet) {
    onChangeSelectedPet(pet);
    setIsPetMenuOpen(false);
  }

  return (
    <PreviewWrapper>
      {/* 로그인한 회원의 반려동물 정보 */}
      <PetProfileArea>
        {petInfo ? (
          <>
            <ProfileImageBox>
              {profileImageUrl && !hasProfileImageError ? (
                <ProfileImage
                  src={profileImageUrl}
                  alt={`${petInfo.name ?? "반려동물"} 프로필`}
                  onError={() => setHasProfileImageError(true)}
                />
              ) : (
                <DefaultProfileEmoji
                  aria-label="기본 반려동물 프로필"
                  role="img"
                >
                  🐾
                </DefaultProfileEmoji>
              )}
            </ProfileImageBox>

            <ProfileContent>
              <ProfileHeader>
                <PetName>{petInfo.name ?? "이름 정보 없음"}</PetName>

                <PetChangeArea>
                  <ChangePetButton
                    type="button"
                    onClick={() => setIsPetMenuOpen((previous) => !previous)}
                  >
                    펫 바꾸기
                  </ChangePetButton>

                  {isPetMenuOpen && (
                    <PetSelectMenu>
                      {petList.map((pet) => (
                        <PetSelectItem
                          key={pet.petId}
                          type="button"
                          $selected={pet.petId === petInfo.petId}
                          onClick={() => handleSelectPet(pet)}
                        >
                          <PetSelectName>
                            {pet.name ?? "이름 없음"}
                          </PetSelectName>

                          <PetSelectBreed>
                            {pet.breedName ?? "품종 정보 없음"}
                          </PetSelectBreed>
                        </PetSelectItem>
                      ))}
                    </PetSelectMenu>
                  )}
                </PetChangeArea>
              </ProfileHeader>

              <PetBreed>{petInfo.breedName ?? "품종 정보 없음"}</PetBreed>

              <PetInfoList>
                <PetInfoBadge>
                  💚 {age !== null ? `만 ${age}세` : "나이 정보 없음"}
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

              <PointNotice>
                <PointIcon>P</PointIcon>

                <PointText>
                  건강 진단 신청 시 <strong>2,000P</strong>가 차감됩니다.
                </PointText>
              </PointNotice>

              <ProfileButtonGroup>
                <SubButton
                  type="button"
                  onClick={() => navigate("/healthcare/result")}
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

      {/* 진단이 필요한 경우 안내 */}
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
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: 20px;

  box-sizing: border-box;
`;

/* =====================================
   반려동물 정보
===================================== */

const PetProfileArea = styled.section`
  min-height: 300px;
  margin-top: 57px;

  display: flex;
  align-items: center;
  gap: 20px;

  padding: 20px;

  box-sizing: border-box;

  border: 1px solid rgba(0, 169, 123, 0.2);
  border-radius: 14px;

  background: var(--color-white);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;

  &:hover {
    border-color: rgba(0, 169, 123, 0.38);

    box-shadow: 0 10px 24px rgba(0, 169, 123, 0.1);

    transform: translateY(-3px);
  }

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;

    min-height: auto;
    margin-top: 30px;
    padding: 18px;
  }
`;

const ProfileImageBox = styled.div`
  width: 140px;
  height: 140px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  border-radius: 50%;

  background: #dddddd;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  ${PetProfileArea}:hover & {
    box-shadow: 0 6px 16px rgba(0, 169, 123, 0.14);

    transform: scale(1.04);
  }

  @media (max-width: 720px) {
    width: 112px;
    height: 112px;

    align-self: center;
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

const DefaultProfileEmoji = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  background: #dddddd;

  font-size: 34px;
  line-height: 1;
`;

const ProfileContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  margin-bottom: 5px;

  @media (max-width: 420px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const PetName = styled.h2`
  min-width: 0;
  margin: 0;

  overflow: hidden;

  color: var(--text-main);

  font-size: 27px;
  font-weight: 800;

  text-overflow: ellipsis;
  white-space: nowrap;

  transition: color 0.2s ease;

  ${PetProfileArea}:hover & {
    color: var(--color-main);
  }

  @media (max-width: 720px) {
    font-size: 23px;
  }
`;

const PetChangeArea = styled.div`
  position: relative;

  flex-shrink: 0;
`;

const ChangePetButton = styled.button`
  flex-shrink: 0;

  padding: 7px 11px;

  border: 1px solid rgba(0, 169, 123, 0.34);
  border-radius: 8px;

  background: var(--color-white);

  color: var(--color-main);

  font-size: 12px;
  font-weight: 700;

  white-space: nowrap;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: var(--color-main);

    background: var(--color-bg-light);

    transform: translateY(-1px);
  }
`;

const PetSelectMenu = styled.div`
  position: absolute;
  top: calc(100% + 7px);
  right: 0;
  z-index: 20;

  width: 170px;
  padding: 6px;

  display: flex;
  flex-direction: column;
  gap: 4px;

  border: 1px solid rgba(0, 169, 123, 0.22);

  border-radius: 9px;

  background: var(--color-white);

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
`;

const PetSelectItem = styled.button`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;

  padding: 9px 10px;

  border: none;
  border-radius: 6px;

  background: ${({ $selected }) =>
    $selected ? "rgba(0, 169, 123, 0.1)" : "var(--color-white)"};

  cursor: pointer;

  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(0, 169, 123, 0.08);
  }
`;

const PetSelectName = styled.span`
  color: var(--text-main);

  font-size: 13px;
  font-weight: 800;
`;

const PetSelectBreed = styled.span`
  color: var(--text-sub);

  font-size: 11px;
  font-weight: 500;
`;

const PetBreed = styled.p`
  margin: 0 0 13px;

  color: var(--text-sub);

  font-size: 14px;
  font-weight: 500;
`;

const PetInfoList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;

  margin-bottom: 12px;
`;

const PetInfoBadge = styled.span`
  padding: 5px 9px;

  border: 1px solid rgba(0, 169, 123, 0.18);

  border-radius: 6px;

  background: var(--color-white);

  color: var(--text-sub);

  font-size: 12px;
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

/* =====================================
   포인트 안내
===================================== */

const PointNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  margin-bottom: 12px;
  padding: 8px 10px;

  border-radius: 7px;

  background: rgba(255, 184, 0, 0.1);
`;

const PointIcon = styled.span`
  width: 19px;
  height: 19px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #ffb800;
  color: #ffffff;

  font-size: 11px;
  font-weight: 800;
`;

const PointText = styled.p`
  margin: 0;

  color: #8a6400;

  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;

  strong {
    color: #c77f00;

    font-size: 13px;
    font-weight: 800;
  }
`;

const ProfileButtonGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.15fr;

  margin-top: 4px;

  overflow: hidden;

  border: 1px solid #d9e3df;
  border-radius: 10px;

  background: var(--color-white);

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const SubButton = styled.button`
  height: 44px;

  border: none;
  border-right: 1px solid #d9e3df;

  background: var(--color-white);

  color: var(--text-sub);

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: var(--color-bg-light);

    color: var(--color-main);
  }

  @media (max-width: 420px) {
    border-right: none;
    border-bottom: 1px solid #d9e3df;
  }
`;

const ApplyButton = styled.button`
  height: 44px;

  border: none;

  background: var(--color-main);

  color: var(--color-white);

  font-size: 13px;
  font-weight: 800;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--color-main-dark);

    box-shadow: inset 0 0 0 999px rgba(0, 0, 0, 0.04);
  }

  &:disabled {
    background: #d5e0dc;

    color: var(--color-white);

    cursor: not-allowed;
  }
`;
/* =====================================
   등록된 반려동물이 없는 경우
===================================== */

const EmptyPetArea = styled.div`
  width: 100%;
  min-height: 148px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

const EmptyPetText = styled.p`
  margin: 0;

  color: var(--text-sub);

  font-size: 15px;
  font-weight: 600;
`;

const RegisterButton = styled.button`
  padding: 11px 17px;

  border: 1px solid var(--color-main);

  border-radius: 8px;

  background: var(--color-white);

  color: var(--color-main);

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;
`;

/* =====================================
   진단 안내
===================================== */

const NeedDiagnosisArea = styled.section`
  position: relative;
  z-index: 1;

  width: 100%;
  min-width: 0;

  min-height: 243px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  padding: 20px 24px;

  box-sizing: border-box;

  border-radius: 11px;

  background: color-mix(in srgb, var(--color-bg-soft) 55%, var(--color-white));

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    z-index: 5;

    transform: scale(1.015);

    box-shadow: 0 14px 32px rgba(0, 169, 123, 0.12);
  }

  @media (max-width: 720px) {
    align-items: flex-start;
    flex-direction: column;

    min-height: auto;
    padding: 18px;
  }
`;
const NeedTextArea = styled.div`
  min-width: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;

  margin-bottom: 13px;
`;

const BellIcon = styled.img`
  width: 30px;
  height: 30px;

  flex-shrink: 0;

  object-fit: contain;
`;

const NeedTitle = styled.h2`
  margin: 0;

  color: var(--text-main);

  font-size: 18px;
  font-weight: 800;
`;

const NeedList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;

  margin: 0;
  padding: 0;

  list-style: none;
`;

const NeedItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;

  color: var(--text-sub);

  font-size: 14px;
  font-weight: 500;
  line-height: 1.35;
`;

const CheckIcon = styled.span`
  width: 25px;
  height: 25px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: var(--color-main);

  color: var(--color-white);

  font-size: 15px;
  font-weight: 800;
`;

const NeedImage = styled.img`
  width: min(235px, 38%);
  height: auto;

  flex-shrink: 0;

  object-fit: contain;

  @media (max-width: 720px) {
    width: min(210px, 70%);

    align-self: flex-end;
  }
`;

const LoadingText = styled.p`
  margin: 0;
  padding: 26px;

  color: var(--text-sub);

  font-size: 14px;
  font-weight: 600;
`;
