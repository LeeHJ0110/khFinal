import { Route, Routes } from "react-router-dom";
import "./App.css";
import DefaultLayout from "./app/layouts/DefaultLayout";
import MemberJoinPage from "./pages/member/MemberJoinPage";
import MemberLoginPage from "./pages/member/MemberLoginPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<DefaultLayout />}>
          <Route path="member">
            <Route path="join" element={<MemberJoinPage />} />
            <Route path="login" element={<MemberLoginPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
