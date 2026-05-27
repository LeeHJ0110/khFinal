import styled from "styled-components";

/**
 * RoundedButton
 *
 * 공용 둥근 버튼 컴포넌트입니다.
 *
 * 사용 예시:
 *
 * <RoundedButton>
 *   등록하기
 * </RoundedButton>
 *
 * 또는
 *
 * <RoundedButton
 *   width="194px"
 *   height="43px"
 *   fontSize="15px"
 *   rightIcon=">"
 *   onClick={handleClick}
 * >
 *   건강관리 시작하기
 * </RoundedButton>
 */
export default function RoundedButton({
  children,

  width = "160px",
  height = "48px",
  fontSize = "16px",
  fontWeight = "600",
  gap = "8px",

  leftIcon,
  rightIcon,

  type = "button",
  onClick,
  disabled = false,
}) {
  return (
    <Button
      type={type}
      $width={width}
      $height={height}
      $fontSize={fontSize}
      $fontWeight={fontWeight}
      $gap={gap}
      onClick={onClick}
      disabled={disabled}
    >
      {leftIcon && <IconBox>{leftIcon}</IconBox>}
      <span>{children}</span>
      {rightIcon && <IconBox>{rightIcon}</IconBox>}
    </Button>
  );
}

const Button = styled.button`
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};

  padding: 0 16px;

  border: none;
  border-radius: 999px;

  background-color: var(--color-main);
  color: var(--color-white);

  font-size: ${({ $fontSize }) => $fontSize};
  font-weight: ${({ $fontWeight }) => $fontWeight};
  white-space: nowrap;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $gap }) => $gap};

  cursor: pointer;

  transition:
    background-color 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease;

  &:hover {
    background-color: var(--color-main-dark);
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 169, 123, 0.25);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 5px rgba(0, 169, 123, 0.2);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    transform: none;
    box-shadow: none;
  }
`;

const IconBox = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  line-height: 1;

  img {
    width: 14px;
    height: 14px;
    display: block;
    object-fit: contain;
  }
`;
