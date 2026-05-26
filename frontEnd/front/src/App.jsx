import { Route, Routes } from "react-router-dom";
import "./App.css";
import DefaultLayout from "./app/layouts/DefaultLayout";
import MemberJoinPage from "./pages/member/MemberJoinPage";
import MemberLoginPage from "./pages/member/MemberLoginPage";
import ScheduleMainPage from "./pages/schedule/ScheduleMainPage";
import PetStoreAdminProductListPage from "./pages/petStore/PetStoreAdminProductListPage";
import DiagnosisRequestHomePage from "./pages/petcare/DiagnosisRequestHomePage";
import DiagnosisRequestPage from "./pages/petcare/DiagnosisRequestPage";
import DiagnosisManagePage from "./pages/petcare/DiagnosisManagePage";
import DiagnosisDetailPage from "./pages/petcare/DiagnosisDetailPage";
import MemberJoinTermsPage from "./pages/member/MemberJoinTermsPage";
import MemberJoinCompletePage from "./pages/member/MemberJoinCompletePage";
import MemberKakaoJoinPage from "./pages/member/MemberKakaoJoinPage";
import MemberKakaoCallbackPage from "./pages/member/MemberKakaoCallbackPage";
import BoardWritePage from "./pages/board/BoardWritePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/member">
          <Route path="login" element={<MemberLoginPage />} />
          <Route path="join" element={<MemberJoinTermsPage />} />
          <Route path="join/info" element={<MemberJoinPage />} />
          <Route path="join/complete" element={<MemberJoinCompletePage />} />
          <Route path="kakao/join" element={<MemberKakaoJoinPage />} />
          <Route path="kakao/callback" element={<MemberKakaoCallbackPage />} />
        </Route>
        <Route path="/*" element={<DefaultLayout />}>
          <Route path="healthcare">
            <Route path="schedule" element={<ScheduleMainPage />} />
            {/* user */}
            <Route path="requesthome" element={<DiagnosisRequestHomePage />} />
            <Route path="request" element={<DiagnosisRequestPage />} />
            {/* vet/admin */}
            <Route path="manage" element={<DiagnosisManagePage />} />
            <Route path="manage/:id" element={<DiagnosisDetailPage />} />
          </Route>
          <Route path="store">
            <Route
              path="product/admin"
              element={<PetStoreAdminProductListPage />}
            />
          </Route>
          <Route path="community">
            <Route path="write" element={<BoardWritePage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
