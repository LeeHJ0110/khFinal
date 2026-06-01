import { Route, Routes, Navigate } from "react-router-dom";
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
import PetStoreDogHomePage from "./pages/petStore/PetStoreDogHomePage";
import PetStoreCatHomePage from "./pages/petStore/PetStoreCatHomePage";
import PetStoreDogFoodProductListPage from "./pages/petStore/PetStoreDogFoodProductListPage";
import PetStoreDogSnackProductListPage from "./pages/petStore/PetStoreDogSnackProductListPage";
import PetStoreDogSupplementProductListPage from "./pages/petStore/PetStoreDogSupplementProductListPage";
import PetStoreDogToiletProductListPage from "./pages/petStore/PetStoreDogToiletProductListPage";
import PetStoreCatFoodProductListPage from "./pages/petStore/PetStoreCatFoodProductListPage";
import PetStoreCatSnackProductListPage from "./pages/petStore/PetStoreCatSnackProductListPage";
import PetStoreCatSupplementProductListPage from "./pages/petStore/PetStoreCatSupplementProductListPage";
import PetStoreCatToiletProductListPage from "./pages/petStore/PetStoreCatToiletProductListPage";

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
import BoardHome from "./pages/board/BoardHome";
import BoardDetailPage from "./pages/board/BoardDetailPage";

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
          {/* 홈페이지 */}
          <Route path="home" element={<HomePage />} />
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
            {/* 공통 스토어 홈 */}
            <Route index element={<PetStoreHomePage />} />

            {/* 관리자 상품관리 */}
            <Route
              path="product/admin"
              element={<PetStoreAdminProductListPage />}
            />

            {/* 강아지 스토어 계열 - 임시로 홈 연결 */}
            <Route path="dog" element={<PetStoreDogHomePage />} />
            <Route
              path="dog/food"
              element={<PetStoreDogFoodProductListPage />}
            />
            <Route
              path="dog/snack"
              element={<PetStoreDogSnackProductListPage />}
            />
            <Route
              path="dog/supplement"
              element={<PetStoreDogSupplementProductListPage />}
            />
            <Route
              path="dog/toilet"
              element={<PetStoreDogToiletProductListPage />}
            />

            {/* 고양이 스토어 계열 -  임시로 홈 연결 */}
            <Route path="cat" element={<PetStoreCatHomePage />} />
            <Route
              path="cat/food"
              element={<PetStoreCatFoodProductListPage />}
            />
            <Route
              path="cat/snack"
              element={<PetStoreCatSnackProductListPage />}
            />
            <Route
              path="cat/supplement"
              element={<PetStoreCatSupplementProductListPage />}
            />
            <Route
              path="cat/toilet"
              element={<PetStoreCatToiletProductListPage />}
            />

            {/* 사용자 보조 메뉴 */}
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
            <Route element={<BoardHome />} />
            <Route path="write" element={<BoardWritePage />} />
            <Route path="list" element={<BoardListPage />} />
            <Route path="detail" element={<BoardDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
