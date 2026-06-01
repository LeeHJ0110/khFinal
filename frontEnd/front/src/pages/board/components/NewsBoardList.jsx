import React from "react";
import styled from "styled-components";
import BoardSubNavbar from "./BoardSubNavbar";

export default function NewsBoardList({ activeTab, onTabChange }) {
  return (
    <>
      {activeTab && onTabChange && (
        <BoardSubNavbar activeTab={activeTab} onTabChange={onTabChange} />
      )}
      <Wrapper>NewsBoardList</Wrapper>
    </>
  );
}

const Wrapper = styled.div``;
