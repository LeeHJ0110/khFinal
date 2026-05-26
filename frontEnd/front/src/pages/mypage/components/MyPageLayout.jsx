import styled from "styled-components";
import MyPageSidebar from "./MyPageSidebar";

export default function MyPageLayout({ children }) {
  return (
    <Container>
      <MyPageSidebar />

      <Content>{children}</Content>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - 160px);
  display: flex;
  background: #f8faf9;
`;

const Content = styled.main`
  flex: 1;
  padding: 36px 48px;
`;
