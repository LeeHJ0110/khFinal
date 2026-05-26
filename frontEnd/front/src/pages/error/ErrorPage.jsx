import styled from "styled-components";

export default function ErrorPage() {
  return (
    <Wrapper>
      <img src="../../assets/images/errorpage.png" />
      <div>
        <div>
          <div>이미지</div>
          <div>안내멘트 큰제목</div>
          <div>안내멘트 작은설명</div>
          <div>
            <button>홈으로 가기</button>
            <button>다시 시도</button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div``;
