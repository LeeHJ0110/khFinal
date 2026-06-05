import styled from "styled-components";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <Layout>
      <AdminSidebar />

      <Main>{children}</Main>
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f7f8fa;
`;

const Main = styled.main`
  flex: 1;
  min-width: 0;
`;
