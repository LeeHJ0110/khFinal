import styled from "styled-components";

//상단 진행바
function DiagnosisProgress({ mainStep }) {
  return (
    <ProgressArea>
      <ProgressBar>
        <ProgressFill $mainStep={mainStep} />
      </ProgressBar>

      <ProgressTextList>
        <ProgressText $active={mainStep === "BASIC"}>
          기본정보
        </ProgressText>

        <span>›</span>

        <ProgressText $active={mainStep === "SELF"}>
          자가진단
        </ProgressText>

        <span>›</span>

        <ProgressText $active={mainStep === "IMAGE"}>
          이미지 분석
        </ProgressText>

        <span>›</span>

        <ProgressText $active={mainStep === "COMPLETE"}>
          신청 완료
        </ProgressText>
      </ProgressTextList>
    </ProgressArea>
  );
}

export default DiagnosisProgress;

const ProgressArea = styled.div`
  width: min(520px, 100%);
  margin: 0 auto 34px;
`;

const ProgressBar = styled.div`
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: #dbeee7;
`;

const ProgressFill = styled.div`
  width: ${({ $mainStep }) => {
    if ($mainStep === "BASIC") return "25%";
    if ($mainStep === "SELF") return "50%";
    if ($mainStep === "IMAGE") return "75%";
    return "100%";
  }};

  height: 100%;
  border-radius: 999px;
  background: #00a97b;
`;

const ProgressTextList = styled.div`
  display: flex;
  justify-content: center;
  gap: 11px;
  margin-top: 11px;
  color: #c1c9c6;
`;

const ProgressText = styled.span`
  color: ${({ $active }) => ($active ? "#222" : "#c1c9c6")};
  font-weight: ${({ $active }) => ($active ? "800" : "600")};
`;