export default function HeaderSearch() {
  return (
    <div className="header-search">
      <input type="text" placeholder="검색어를 입력하세요" />
      <button type="button" aria-label="검색">
        🔍
      </button>
    </div>
  );
}
