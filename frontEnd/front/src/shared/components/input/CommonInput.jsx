import styled from "styled-components";

/**
 * CommonInput
 *
 * 공용 input
 *
 * width, height, fontSize를 props로 넘기면 화면에 맞게 크기 조절 가능.
 *
 * input 오른쪽에 버튼, 아이콘, 단위 텍스트 등을 넣어야 할 경우
 * rightElement props를 사용하면 됩니다.
 *
 * 사용 예시:
 *
 * 기본 input
 * <CommonInput placeholder="내용을 입력하세요." />
 *
 * 크기 조절
 * <CommonInput width="300px" height="42px" fontSize="14px" />
 *
 * 오른쪽 버튼 추가
 * <CommonInput
 *   placeholder="아이디를 입력하세요."
 *   rightElement={<button>중복체크</button>}
 * />
 *
 * 오른쪽 단위 추가
 * <CommonInput
 *   value={price}
 *   rightElement={<span>원</span>}
 * />
 *
 * 비밀번호 눈 아이콘 추가
 * <CommonInput
 *   type="password"
 *   placeholder="비밀번호를 입력하세요."
 *   rightElement={<span>👁</span>}
 * />
 */
export default function CommonInput({
  type = "text",
  value,
  name,
  placeholder = "",
  onChange,
  onClick,
  onKeyDown,
  disabled = false,
  readOnly = false,

  // 아무것도 안 넣었을 때 지정되는 기본 크기입니다.
  // 필요할 경우 사용하는 쪽에서 props로 변경할 수 있습니다.
  width = "300px",
  height = "40px",

  // input 안의 글자 크기입니다.
  fontSize = "14px",

  rightElement,

  // 안내/검증 상태에 따라 border 색을 바꾸고 싶을 때 사용합니다.
  status = "default",
}) {
  return (
    <Wrapper $width={width} $height={height} $status={status}>
      <Input
        type={type}
        value={value}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        onClick={onClick}
        onKeyDown={onKeyDown}
        disabled={disabled}
        readOnly={readOnly}
        $fontSize={fontSize}
        $hasRightElement={!!rightElement}
      />

      {rightElement && <RightElement>{rightElement}</RightElement>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;

  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};

  display: inline-flex;
  align-items: center;

  border: 1px solid
    ${({ $status }) => {
      if ($status === "success") return "#00a97b";
      if ($status === "error") return "#ff4d4f";
      return "#d9d9d9";
    }};

  border-radius: 6px;
  background-color: #ffffff;

  transition: 0.2s ease;

  &:focus-within {
    border-color: #00a97b;
    box-shadow: 0 0 0 3px rgba(0, 169, 123, 0.12);
  }
`;

const Input = styled.input`
  width: 100%;
  height: 100%;

  padding: ${({ $hasRightElement }) =>
    $hasRightElement ? "0 44px 0 12px" : "0 12px"};

  border: none;
  outline: none;
  background: transparent;

  color: #222222;
  font-size: ${({ $fontSize }) => $fontSize};
  font-weight: 400;

  &::placeholder {
    color: #b8b8b8;
  }

  &:disabled {
    color: #999999;
    cursor: not-allowed;
  }

  &:read-only {
    cursor: default;
  }
`;

const RightElement = styled.div`
  position: absolute;
  right: 10px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: #555555;
  font-size: 13px;
`;
