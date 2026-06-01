import React, { useState } from "react"; // 💡 useState 임포트 추가!
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import BoardSubNavbar from "./components/BoardSubNavbar";

export default function BoardHome() {
  // 💡 useNavigate() 인자에 들어있던 오타 "" 제거
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("HOME");

  return (
    <div>
      <BoardSubNavbar
        activeTab="HOME"
        onTabChange={(tab) => {
          if (tab === "HOME") {
            navigate(`/community`);
          } else {
            // 다른 탭을 누르면 쿼리 스트링을 달고 목록(/community/list) 페이지로 이동
            navigate(`/community/list?category=${tab}`);
          }
        }}
      />

      <HomeContentWrapper>
        <h1>커뮤니티 홈 화면 🐾</h1>
        {/* 홈 관련 컨텐츠들 */}
      </HomeContentWrapper>
    </div>
  );
}

// 💡 하단에 정의해 두셨던 빈 Wrapper 스타일을 활용하여 본문 영역에 최소한의 여백을 지정했습니다.
const HomeContentWrapper = styled.div`
  width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
`;
