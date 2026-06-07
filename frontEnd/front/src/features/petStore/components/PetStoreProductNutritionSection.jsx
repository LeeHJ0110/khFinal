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
  handleNutritionChange,
}) {
  return (
    <section className="product-form-section">
      <div className="section-title-row">
        <h3>3. 영양성분</h3>
      </div>

      <div className="nutrition-row-list">
        {NUTRITION_OPTIONS.map((option) => (
          <div className="nutrition-row" key={option.name}>
            <span>{option.label}</span>

            <div className="input-with-unit">
              <input
                name={option.name}
                value={nutrition[option.name] ?? ""}
                onChange={handleNutritionChange}
                placeholder="입력하지 않으면 0으로 저장"
              />
              <b>{option.unit}</b>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
