import { Route, Routes } from "react-router-dom";
import "./App.css";

import DefaultLayout from "./app/layouts/DefaultLayout";

// member
import MemberJoinPage from "./pages/member/MemberJoinPage";
import MemberLoginPage from "./pages/member/MemberLoginPage";
import MemberJoinTermsPage from "./pages/member/MemberJoinTermsPage";
import MemberJoinCompletePage from "./pages/member/MemberJoinCompletePage";
import MemberKakaoJoinPage from "./pages/member/MemberKakaoJoinPage";
import MemberKakaoCallbackPage from "./pages/member/MemberKakaoCallbackPage";

// healthcare
import ScheduleMainPage from "./pages/schedule/ScheduleMainPage";
import DiagnosisRequestHomePage from "./pages/petcare/DiagnosisRequestHomePage";
import DiagnosisRequestPage from "./pages/petcare/DiagnosisRequestPage";
import DiagnosisManagePage from "./pages/petcare/DiagnosisManagePage";
import DiagnosisDetailPage from "./pages/petcare/DiagnosisDetailPage";

// store
import PetStoreAdminProductListPage from "./pages/petStore/PetStoreAdminProductListPage";
import PetStoreHomePage from "./pages/petStore/PetStoreHomePage";

// mypage
import MyPageHomePage from "./pages/mypage/MyPageHomePage";
import MemberEditPage from "./pages/mypage/MemberEditPage";
import PetManagePage from "./pages/mypage/PetManagePage";

// board
import BoardWritePage from "./pages/board/BoardWritePage";
import BoardListPage from "./pages/board/BoardListPage";

// common
import HomePage from "./pages/home/HomePage";
import ErrorPage from "./pages/error/ErrorPage";

function App() {
  return (
    <>
      <Routes>
        {/* 회원 */}
        <Route path="/member">
          <Route path="login" element={<MemberLoginPage />} />
          <Route path="join" element={<MemberJoinTermsPage />} />
          <Route path="join/info" element={<MemberJoinPage />} />
          <Route path="join/complete" element={<MemberJoinCompletePage />} />
          <Route path="kakao/join" element={<MemberKakaoJoinPage />} />
          <Route path="kakao/callback" element={<MemberKakaoCallbackPage />} />
        </Route>

        {/* 기본 레이아웃 */}
        <Route path="/*" element={<DefaultLayout />}>
          {/* 헬스케어 */}
          <Route path="healthcare">
            <Route path="schedule" element={<ScheduleMainPage />} />

            {/* user */}
            <Route path="requesthome" element={<DiagnosisRequestHomePage />} />
            <Route path="request" element={<DiagnosisRequestPage />} />

            {/* vet/admin */}
            <Route path="manage" element={<DiagnosisManagePage />} />
            <Route path="manage/:id" element={<DiagnosisDetailPage />} />
          </Route>

          {/* 스토어 */}
          <Route path="store">
            <Route
              path="product/admin"
              element={<PetStoreAdminProductListPage />}
            />
            <Route path="product/home" element={<PetStoreHomePage />} />
          </Route>

          {/* 마이페이지 */}
          <Route path="mypage">
            <Route index element={<MyPageHomePage />} />

            <Route path="member-edit" element={<MemberEditPage />} />

            <Route path="pet-manage" element={<PetManagePage />} />
          </Route>

          {/* 공용페이지 (route path 수정해야함)*/}
          <Route path="common">
            <Route path="home" element={<HomePage />} />
            <Route path="error" element={<ErrorPage />} />
          </Route>

          <Route path="community">
            <Route path="write" element={<BoardWritePage />} />
            <Route path="list" element={<BoardListPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
