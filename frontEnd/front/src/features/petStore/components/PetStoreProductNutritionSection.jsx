export default function PetStoreProductNutritionSection({
  nutrition,
  handleNutritionChange,
}) {
  return (
    <section>
      <h3>3. 영양성분</h3>

      <input
        name="nutritionCalorie"
        value={nutrition.nutritionCalorie}
        onChange={handleNutritionChange}
        placeholder="칼로리"
      />

      <input
        name="nutritionProtein"
        value={nutrition.nutritionProtein}
        onChange={handleNutritionChange}
        placeholder="단백질"
      />

      <input
        name="nutritionFat"
        value={nutrition.nutritionFat}
        onChange={handleNutritionChange}
        placeholder="지방"
      />

      <input
        name="nutritionFiber"
        value={nutrition.nutritionFiber}
        onChange={handleNutritionChange}
        placeholder="식이섬유"
      />

      <input
        name="nutritionMoisture"
        value={nutrition.nutritionMoisture}
        onChange={handleNutritionChange}
        placeholder="수분"
      />

      <input
        name="nutritionCalcium"
        value={nutrition.nutritionCalcium}
        onChange={handleNutritionChange}
        placeholder="칼슘"
      />

      <input
        name="nutritionPhosphorus"
        value={nutrition.nutritionPhosphorus}
        onChange={handleNutritionChange}
        placeholder="인"
      />
    </section>
  );
}
