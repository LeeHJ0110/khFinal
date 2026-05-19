import { Route, Routes } from "react-router-dom";
import "./App.css";
import DefaultLayout from "./app/layouts/DefaultLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<DefaultLayout />}>
          <Route></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
