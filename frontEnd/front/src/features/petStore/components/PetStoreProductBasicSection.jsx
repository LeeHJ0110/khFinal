export default function PetStoreProductBasicSection({
  formData,
  handleChange,
}) {
  return (
    <section>
      <h3>1. 기본 정보</h3>

      <input
        name="productName"
        value={formData.productName}
        onChange={handleChange}
        placeholder="상품명"
      />

      <select
        name="productTargetPetType"
        value={formData.productTargetPetType}
        onChange={handleChange}
      >
        <option value="D">강아지</option>
        <option value="C">고양이</option>
      </select>

      <select
        name="productCategory"
        value={formData.productCategory}
        onChange={handleChange}
      >
        <option value="FOOD">사료</option>
        <option value="SNACK">간식</option>
        <option value="SUPPLEMENT">영양제</option>
        <option value="TOILET">배변용품</option>
      </select>

      <input
        name="tagId"
        value={formData.tagId}
        onChange={handleChange}
        placeholder="태그 ID"
      />

      <input
        name="productPrice"
        value={formData.productPrice}
        onChange={handleChange}
        placeholder="판매가"
      />
    </section>
  );
}
