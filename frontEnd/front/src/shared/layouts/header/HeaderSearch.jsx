import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeaderSearch() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    navigate(`/community/search?keyword=${encodeURIComponent(keyword.trim())}`);
    setKeyword("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    }
  };

  return (
    <div className="header-search">
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button type="button" aria-label="검색" onClick={handleSearchSubmit}>
        🔍
      </button>
    </div>
  );
}
