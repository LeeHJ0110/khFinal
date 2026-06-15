import { useEffect, useMemo } from "react";
import styled from "styled-components";
import useScheduleWrite from "../hooks/useScheduleWrite";
import useScheduleEdit from "../hooks/useScheduleEdit";
import useScheduleDelete from "../hooks/useScheduleDelete";
import useFormData from "../../../shared/hooks/useFormData";

export default function ScheduleModal({ open, onClose, data }) {
  if (!open) return null;

  // 💡 작성, 수정, 삭제 훅에서 에러 상태(error)까지 함께 구조분해 할당
  const {
    handleWrite,
    isSuccess: writeSucc,
    error: writeErr,
  } = useScheduleWrite();
  const { handleEdit, isSuccess: editSucc, error: editErr } = useScheduleEdit();
  const {
    handleDelete,
    isSuccess: delSucc,
    error: delErr,
  } = useScheduleDelete();
  const { formData, handleChange } = useFormData(data);

  // 성공 시 모달 닫기
  useEffect(() => {
    if (editSucc || writeSucc || delSucc) {
      onClose();
    }
  }, [writeSucc, editSucc, delSucc, onClose]);

  // 💡 주석 처리되었던 에러 핸들링을 위한 useEffect 구현
  useEffect(() => {
    const currentError = writeErr || editErr || delErr;
    if (currentError) {
      alert(
        currentError.message ||
          "일정 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
      );
    }
  }, [writeErr, editErr, delErr]);

  // 종료 날짜 가독성 변환 함수
  function displayEndDate(startDate, endDate) {
    if (!endDate) return "";

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end.getTime() - start.getTime() >= 24 * 60 * 60 * 1000) {
      end.setDate(end.getDate() - 1);
    }

    return end.toISOString().split("T")[0];
  }

  // 💡 매 렌더링마다 함수가 직접 실행되는 것을 방지하기 위해 useMemo로 래핑 최적화
  const formattedEndDate = useMemo(() => {
    return displayEndDate(formData.startDate, formData.endDate);
  }, [formData.startDate, formData.endDate]);

  return (
    <Overlay onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Header>
          {/* 💡 작성 / 수정 모드에 따라 상단 헤더 타이틀이 직관적으로 변경되도록 분기 */}
          <Title>{data?.isEdit ? "일정 상세조회" : "새 일정 등록"}</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <Body
          onSubmit={(e) => {
            e.preventDefault();

            const payload = {
              ...formData,
              backgroundColor: formData.backgroundColor?.replace("#", ""),
            };

            if (!formData.title || formData.title.trim() === "") {
              alert("제목을 입력해주세요");
              return;
            }

            if (formData.endDate < formData.startDate) {
              alert("종료일이 시작일보다 빠를 수 없습니다.");
              return;
            }

            if (data?.isEdit) {
              handleEdit(payload);
            } else {
              handleWrite(payload);
            }
          }}
        >
          {/* 제목 입력 */}
          <Field>
            <Label>제목</Label>
            <Input
              type="text"
              name="title"
              placeholder="일정 제목을 입력하세요"
              value={formData.title || ""}
              onChange={handleChange}
            />
          </Field>

          {/* 날짜 입력 (시작일 / 종료일) */}
          <Row>
            <Field>
              <Label>시작 날짜</Label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate || ""}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label>종료 날짜</Label>
              <Input
                type="date"
                name="endDate"
                value={formattedEndDate}
                onChange={handleChange}
              />
            </Field>
          </Row>

          {/* 💡 일정 시간 선택 섹션을 다른 인풋들과 정렬이 맞도록 Field 레이아웃으로 감쌈 */}
          <Field>
            <Label>일정 시간</Label>
            <Row>
              <Select
                value={formData.at?.split(":")[0] || "00"}
                onChange={(e) => {
                  const minute = formData.at?.split(":")[1] || "00";
                  handleChange({
                    target: {
                      name: "at",
                      value: `${e.target.value}:${minute}`,
                    },
                  });
                }}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {i}시
                  </option>
                ))}
              </Select>

              <Select
                value={formData.at?.split(":")[1] || "00"}
                onChange={(e) => {
                  const hour = formData.at?.split(":")[0] || "00";
                  handleChange({
                    target: {
                      name: "at",
                      value: `${hour}:${e.target.value}`,
                    },
                  });
                }}
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {i}분
                  </option>
                ))}
              </Select>
            </Row>
          </Field>

          {/* 내용 입력 */}
          <Field>
            <Label>내용</Label>
            <TextArea
              placeholder="상세 내용을 적어주세요"
              value={formData.content || ""}
              name="content"
              onChange={handleChange}
            />
          </Field>

          {/* 색상 픽커 */}
          <Field>
            <Label>테마 색상</Label>
            <ColorPickerRow>
              <ColorInput
                type="color"
                name="backgroundColor"
                value={formData.backgroundColor || "#5ec8a7"}
                onChange={handleChange}
              />
              <ColorText>{formData.backgroundColor || "#5ec8a7"}</ColorText>
            </ColorPickerRow>
          </Field>

          {/* 하단 제어 버튼 컴포넌트 */}
          <Footer>
            <CancelButton type="button" onClick={onClose}>
              취소
            </CancelButton>
            {data?.isEdit ? (
              <>
                <DeleteButton
                  type="button"
                  onClick={() => {
                    if (window.confirm("정말로 이 일정을 삭제하시겠습니까?")) {
                      handleDelete(data.id);
                    }
                  }}
                >
                  삭제
                </DeleteButton>
                <SaveButton type="submit">수정 완료</SaveButton>
              </>
            ) : (
              <SaveButton type="submit">일정 저장</SaveButton>
            )}
          </Footer>
        </Body>
      </Container>
    </Overlay>
  );
}

// ==========================================
// 스태틱 및 스타일드 컴포넌트 정의
// ==========================================
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(
    15,
    23,
    42,
    0.45
  ); /* 어두운 슬레이트 톤을 믹스해 한층 더 고급스러운 오버레이 처리 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px); /* 부드러운 스크린 블러 효과 추가 */
`;

const Container = styled.div`
  width: 500px;
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modal-show 0.24s cubic-bezier(0.34, 1.56, 0.64, 1); /* 쫀득한 팝업 바운스 인터랙션 */

  @keyframes modal-show {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  font-size: 26px;
  font-weight: 300;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.2s;
  line-height: 1;

  &:hover {
    color: #475569;
    transform: rotate(90deg); /* 닫기 버튼 위버 시 위트 있는 회전 애니메이션 */
  }
`;

const Body = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  gap: 14px;
  > div {
    flex: 1;
  }
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  margin-left: 2px;
`;

const Input = styled.input`
  height: 46px;
  border: 1.5px solid #e2e8f0; /* 기본 상태는 차분하게 그레이 톤 처리 */
  border-radius: 12px;
  padding: 0 14px;
  font-size: 14px;
  color: #334155;
  outline: none;
  transition: all 0.2s ease-in-out;

  &::placeholder {
    color: #cbd5e1;
  }

  &:focus {
    border-color: #5ec8a7;
    box-shadow: 0 0 0 4px rgba(94, 200, 167, 0.12); /* 포커스 시 은은한 민트 링 링 빔 효과 */
  }
`;

const TextArea = styled.textarea`
  min-height: 140px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  resize: none;
  font-size: 14px;
  color: #334155;
  line-height: 1.6;
  outline: none;
  transition: all 0.2s ease-in-out;

  &::placeholder {
    color: #cbd5e1;
  }

  &:focus {
    border-color: #5ec8a7;
    box-shadow: 0 0 0 4px rgba(94, 200, 167, 0.12);
  }
`;

const ColorPickerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ColorInput = styled.input`
  width: 38px;
  height: 38px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  padding: 0;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }
`;

const ColorText = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
`;

const Select = styled.select`
  flex: 1;
  height: 46px; /* 인풋 창과 정교한 높이 매칭 */
  padding: 0 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  color: #334155;
  outline: none;
  background-color: #ffffff;
  transition: all 0.2s;

  &:focus {
    border-color: #5ec8a7;
    box-shadow: 0 0 0 4px rgba(94, 200, 167, 0.12);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
`;

const BaseButton = styled.button`
  border: none;
  padding: 12px 22px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.2s ease-in-out;
  user-select: none;

  &:active {
    transform: scale(0.97);
  }
`;

const CancelButton = styled(BaseButton)`
  background: #f1f5f9;
  color: #64748b;

  &:hover {
    background: #e2e8f0;
    color: #475569;
  }
`;

const SaveButton = styled(BaseButton)`
  background: #5ec8a7;
  color: white;
  box-shadow: 0 4px 12px rgba(94, 200, 167, 0.15);

  &:hover {
    background: #4eb394;
    box-shadow: 0 6px 16px rgba(94, 200, 167, 0.25);
  }
`;

const DeleteButton = styled(BaseButton)`
  background: #fee2e2;
  color: #ef4444;
  margin-right: auto; /* 삭제 버튼을 왼쪽 구석으로 밀어서 파괴적 행위의 오클릭 방지 */

  &:hover {
    background: #fca5a5;
    color: #b91c1c;
  }
`;
