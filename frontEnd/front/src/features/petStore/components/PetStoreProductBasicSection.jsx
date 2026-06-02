const PRODUCT_TAG_OPTIONS = {
  FOOD: [
    { tagId: 1, tagName: "성장" },
    { tagId: 2, tagName: "체중" },
    { tagId: 3, tagName: "피부" },
    { tagId: 4, tagName: "소화" },
  ],
  SNACK: [
    { tagId: 5, tagName: "치아" },
    { tagId: 6, tagName: "칼로리" },
    { tagId: 7, tagName: "보상" },
    { tagId: 8, tagName: "기호성" },
  ],
  SUPPLEMENT: [
    { tagId: 9, tagName: "관절" },
    { tagId: 10, tagName: "소화" },
    { tagId: 11, tagName: "면역" },
    { tagId: 12, tagName: "눈" },
  ],
  TOILET: [
    { tagId: 13, tagName: "탈취" },
    { tagId: 14, tagName: "흡수" },
    { tagId: 15, tagName: "위생" },
    { tagId: 16, tagName: "대용량" },
  ],
};

export default function PetStoreProductBasicSection({
  formData,
  handleChange,
}) {
  const tagOptions = PRODUCT_TAG_OPTIONS[formData.productCategory] ?? [];

  function handleCategoryChange(evt) {
    handleChange(evt);

    handleChange({
      target: {
        name: "tagId",
        value: "",
      },
    });
  }

  return (
    <section className="product-form-section">
      <h3>1. 기본 정보</h3>

      <div className="form-grid form-grid-3">
        <label className="form-field form-field-wide">
          <span>
            상품명 <em>*</em>
          </span>
          <input
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="상품명을 입력하세요."
          />
        </label>

        <label className="form-field">
          <span>
            대상동물 <em>*</em>
          </span>
          <select
            name="productTargetPetType"
            value={formData.productTargetPetType}
            onChange={handleChange}
          >
            <option value="">대상동물 선택</option>
            <option value="D">강아지</option>
            <option value="C">고양이</option>
          </select>
        </label>

        <label className="form-field">
          <span>
            카테고리 <em>*</em>
          </span>
          <select
            name="productCategory"
            value={formData.productCategory}
            onChange={handleCategoryChange}
          >
            <option value="">카테고리 선택</option>
            <option value="FOOD">사료</option>
            <option value="SNACK">간식</option>
            <option value="SUPPLEMENT">영양제</option>
            <option value="TOILET">배변용품</option>
          </select>
        </label>

        <label className="form-field">
          <span>
            판매가 <em>*</em>
          </span>
          <div className="input-with-unit">
            <input
              name="productPrice"
              value={formData.productPrice}
              onChange={handleChange}
              placeholder="판매가"
            />
            <b>원</b>
          </div>
        </label>

        <label className="form-field">
          <span>
            기능성 태그 <em>*</em>
          </span>
          <select name="tagId" value={formData.tagId} onChange={handleChange}>
            <option value="">태그 선택</option>
            {tagOptions.map((tag) => (
              <option key={tag.tagId} value={tag.tagId}>
                {tag.tagName}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
