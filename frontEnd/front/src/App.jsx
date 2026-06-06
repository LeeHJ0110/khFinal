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
import HealthCareHome from "./pages/petcare/HealthCareHome";
import ScheduleMainPage from "./pages/schedule/ScheduleMainPage";
import KarteListPage from "./pages/karte/KarteListPage";
import KarteDetailPage from "./pages/karte/KarteDetailPage";
import DiagnosisRequestHomePage from "./pages/petcare/DiagnosisRequestHomePage";
import DiagnosisRequestPage from "./pages/petcare/DiagnosisRequestPage";
import DiagnosisManagePage from "./pages/petcare/DiagnosisManagePage";
import DiagnosisDetailPage from "./pages/petcare/DiagnosisDetailPage";
import PetInsuranceMain from "./pages/petinsurance/PetInsuranceMain";
import InsuranceAdminApplicationPage from "./pages/petinsurance/InsuranceAdminApplicationPage";

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
import PetStoreProductDetailPage from "./pages/petStore/PetStoreProductDetailPage";
import PetStoreCartListPage from "./pages/petStore/PetStoreCartListPage";
import PetStoreOrderPage from "./pages/petStore/PetStoreOrderPage";

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
import MessageBoxPage from "./pages/mypage/MessageBoxPage";
import CommunityHistoryPage from "./pages/mypage/CommunityHistoryPage";
import BoardHome from "./pages/board/BoardHome";
import BoardDetailPage from "./pages/board/BoardDetailPage";
import DeliveryManagePage from "./pages/mypage/DeliveryManagePage";
import PetStoreOrderCompletePage from "./pages/petStore/PetStoreOrderCompletePage";
import AdminMemberPage from "./pages/admin/member/AdminMemberPage";
import AdminMessageSendPage from "./pages/admin/message/AdminMessageSendPage";
import AdminSentMessagePage from "./pages/admin/message/AdminSentMessagePage";


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
            <Route index element={<HealthCareHome />} />
            {/* 스케줄 */}
            <Route path="schedule" element={<ScheduleMainPage />} />

            {/* 진단결과 */}
            <Route path="result" element={<KarteListPage />} />
            <Route path="result/:id" element={<KarteDetailPage />} />

            {/* user */}
            <Route path="requesthome" element={<DiagnosisRequestHomePage />} />
            <Route path="request" element={<DiagnosisRequestPage />} />

            {/* vet/admin */}
            <Route path="manage" element={<DiagnosisManagePage />} />
            <Route path="manage/:id" element={<DiagnosisDetailPage />} />

            {/* 펫보험 */}
            <Route path="petinsurance" element={<PetInsuranceMain />} />
            <Route path="petinsurance/admin" element={<InsuranceAdminApplicationPage/>} />
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

            {/* 장바구니 */}
            <Route path="cart/list" element={<PetStoreCartListPage />} />

            {/* 주문페이지 */}
            <Route path="order" element={<PetStoreOrderPage />} />
            <Route
              path="order/complete"
              element={<PetStoreOrderCompletePage />}
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
            {/* 상품 상세보기 */}
            <Route
              path="product/:productId"
              element={<PetStoreProductDetailPage />}
            />
          </Route>

          {/* 마이페이지 */}
          <Route path="mypage">
            <Route index element={<MyPageHomePage />} />

            <Route path="member-edit" element={<MemberEditPage />} />

            <Route path="pet-manage" element={<PetManagePage />} />
            <Route path="message" element={<MessageBoxPage />} />
            <Route path="community" element={<CommunityHistoryPage />} />
            <Route path="delivery" element={<DeliveryManagePage />} />
          </Route>
          <Route path="admin">
            <Route path="member" element={<AdminMemberPage />} />
            <Route path="message/send" element={<AdminMessageSendPage />} />
            <Route path="message/sent" element={<AdminSentMessagePage />} />
          </Route>

          {/* 공용페이지 (route path 수정해야함)*/}
          <Route path="common">
            <Route path="home" element={<HomePage />} />
            <Route path="error" element={<ErrorPage />} />
          </Route>

          <Route path="community">
            <Route index element={<BoardHome />} />
            <Route path="write" element={<BoardWritePage />} />
            <Route path="list" element={<BoardListPage />} />
            <Route path="detail/:id" element={<BoardDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
