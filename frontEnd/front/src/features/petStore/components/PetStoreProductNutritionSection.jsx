const NUTRITION_OPTIONS = [
  { name: "nutritionCalorie", label: "칼로리", unit: "kcal" },
  { name: "nutritionProtein", label: "단백질", unit: "%" },
  { name: "nutritionFat", label: "지방", unit: "%" },
  { name: "nutritionFiber", label: "식이섬유", unit: "%" },
  { name: "nutritionMoisture", label: "수분", unit: "%" },
  { name: "nutritionCalcium", label: "칼슘", unit: "%" },
  { name: "nutritionPhosphorus", label: "인", unit: "%" },
];

export default function PetStoreProductNutritionSection({
  nutrition,
  nutritionRows,
  handleNutritionChange,
  handleAddNutritionRow,
  handleRemoveNutritionRow,
}) {
  const addableOptions = NUTRITION_OPTIONS.filter(
    (option) => !nutritionRows.includes(option.name),
  );

  return (
    <section className="product-form-section">
      <div className="section-title-row">
        <h3>3. 영양성분</h3>

        <select
          className="small-select"
          value=""
          onChange={(evt) => handleAddNutritionRow(evt.target.value)}
        >
          <option value="">성분 추가</option>
          {addableOptions.map((option) => (
            <option key={option.name} value={option.name}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {nutritionRows.length === 0 ? (
        <div className="empty-mini-box">필요한 성분만 선택해서 추가하세요.</div>
      ) : (
        <div className="nutrition-row-list">
          {nutritionRows.map((rowName) => {
            const option = NUTRITION_OPTIONS.find(
              (item) => item.name === rowName,
            );

            return (
              <div className="nutrition-row" key={rowName}>
                <span>{option?.label}</span>

                <div className="input-with-unit">
                  <input
                    name={rowName}
                    value={nutrition[rowName]}
                    onChange={handleNutritionChange}
                    placeholder="입력"
                  />
                  <b>{option?.unit}</b>
                </div>

                <button
                  type="button"
                  className="icon-remove-button"
                  onClick={() => handleRemoveNutritionRow(rowName)}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
