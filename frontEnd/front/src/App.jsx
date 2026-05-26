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

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<DefaultLayout />}>
          <Route path="member">
            <Route path="join" element={<MemberJoinPage />} />
            <Route path="login" element={<MemberLoginPage />} />
          </Route>
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
        </Route>
      </Routes>
    </>
  );
}

export default App;
