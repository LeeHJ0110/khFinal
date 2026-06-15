import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../../assets/images/icon/녹색돋보기.png";

export default function HeaderSearch() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      return;
    }

    navigate(`/community/search?keyword=${encodeURIComponent(trimmedKeyword)}`);
    setKeyword("");
  };

  return (
    <form className="header-search" onSubmit={handleSearchSubmit}>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <button type="submit" aria-label="검색">
        <img src={searchIcon} alt="" />
      </button>
    </form>
  );
}
