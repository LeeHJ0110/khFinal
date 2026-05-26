import styled from "styled-components";

/**
 * AngledButton
 *
 * 공용 각진 버튼 컴포넌트입니다.
 *
 * width, height, fontSize를 props로 넘기면 필요한 화면에 맞게 크기를 조절할 수 있습니다.
 *
 * 사용 예시:
 * <AngledButton>
 *   등록하기
 * </AngledButton>
 *
 *  또는
 *
 * <AngledButton width="220px" height="56px" fontSize="18px">
 *   홈으로 가기
 * </AngledButton>
 *
 *  또는
 *
 * <AngledButton onClick={handleClick}>
 *   클릭
 * </AngledButton>
 */
export default function AngledButton({
  children,

  // 아무것도 안넣었을 때 지정되는 기본 크기입니다.
  // 필요할 경우 사용하는 쪽에서 props로 변경할 수 있습니다.
  width = "160px",
  height = "48px",
  fontSize = "16px",

  // 클릭 이벤트가 필요할 때 넘겨서 사용합니다.
  onClick,
}) {
  return (
    <Button
      type="button"
      $width={width}
      $height={height}
      $fontSize={fontSize}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

const Button = styled.button`
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};

  border: none;
  border-radius: 6px;

  background-color: #00a97b;
  color: #ffffff;

  font-size: ${({ $fontSize }) => $fontSize};
  font-weight: 600;

  cursor: pointer;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  transition: 0.2s ease;

  &:hover {
    background-color: #00a976;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 169, 135, 0.25);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(0, 169, 135, 0.2);
  }
`;
