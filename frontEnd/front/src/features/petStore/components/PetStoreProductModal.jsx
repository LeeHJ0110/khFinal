import "./PetStoreProductModal.css";
import PetStoreProductForm from "./PetStoreProductForm";

const emptyBasicData = {
  productName: "",
  productCategory: "FOOD",
  tagId: "",
  productTargetPetType: "D",
  productPrice: "",
  productSaleYn: "Y",
};

const emptyNutrition = {
  nutritionCalorie: "",
  nutritionProtein: "",
  nutritionFat: "",
  nutritionFiber: "",
  nutritionMoisture: "",
  nutritionCalcium: "",
  nutritionPhosphorus: "",
};

const emptyFeedingGuideList = [
  {
    feedingMinWeight: "",
    feedingMaxWeight: "",
    feedingDailyAmount: "",
    feedingUnit: "g",
    feedingNote: "",
  },
  {
    feedingMinWeight: "",
    feedingMaxWeight: "",
    feedingDailyAmount: "",
    feedingUnit: "g",
    feedingNote: "",
  },
  {
    feedingMinWeight: "",
    feedingMaxWeight: "",
    feedingDailyAmount: "",
    feedingUnit: "g",
    feedingNote: "",
  },
];

function makeInitialBasicData(mode, detailData) {
  if (mode !== "update" || !detailData) {
    return emptyBasicData;
  }

  return {
    productName: detailData.productName ?? "",
    productCategory: detailData.productCategory ?? "FOOD",
    tagId: detailData.tagId ?? "",
    productTargetPetType: detailData.productTargetPetType ?? "D",
    productPrice: detailData.productPrice ?? "",
    productSaleYn: detailData.productSaleYn ?? "Y",
  };
}

function makeInitialNutrition(mode, detailData) {
  if (mode !== "update" || !detailData?.nutrition) {
    return emptyNutrition;
  }

  return {
    nutritionCalorie: detailData.nutrition.nutritionCalorie ?? "",
    nutritionProtein: detailData.nutrition.nutritionProtein ?? "",
    nutritionFat: detailData.nutrition.nutritionFat ?? "",
    nutritionFiber: detailData.nutrition.nutritionFiber ?? "",
    nutritionMoisture: detailData.nutrition.nutritionMoisture ?? "",
    nutritionCalcium: detailData.nutrition.nutritionCalcium ?? "",
    nutritionPhosphorus: detailData.nutrition.nutritionPhosphorus ?? "",
  };
}

function makeInitialFeedingGuideList(mode, detailData) {
  if (
    mode !== "update" ||
    !detailData?.feedingGuideList ||
    detailData.feedingGuideList.length === 0
  ) {
    return emptyFeedingGuideList;
  }

  const mappedList = detailData.feedingGuideList.map((guide) => ({
    feedingMinWeight: guide.feedingMinWeight ?? "",
    feedingMaxWeight: guide.feedingMaxWeight ?? "",
    feedingDailyAmount: guide.feedingDailyAmount ?? "",
    feedingUnit: guide.feedingUnit ?? "g",
    feedingNote: guide.feedingNote ?? "",
  }));

  return [0, 1, 2].map((index) => {
    return mappedList[index] ?? emptyFeedingGuideList[index];
  });
}

export default function PetStoreProductModal({
  mode,
  detailData,
  isSubmitting,
  onClose,
  onSubmit,
}) {
  if (mode === "update" && !detailData) {
    return (
      <div className="modal-backdrop">
        <div className="product-modal">
          <p>상품 정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  const initialBasicData = makeInitialBasicData(mode, detailData);
  const initialNutrition = makeInitialNutrition(mode, detailData);
  const initialFeedingGuideList = makeInitialFeedingGuideList(mode, detailData);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="product-modal" onClick={(evt) => evt.stopPropagation()}>
        <div className="product-modal-header">
          <h2>{mode === "insert" ? "상품등록" : "상품수정"}</h2>
        </div>

        <PetStoreProductForm
          key={`${mode}-${detailData?.productId ?? "new"}`}
          mode={mode}
          detailData={detailData}
          initialBasicData={initialBasicData}
          initialNutrition={initialNutrition}
          initialFeedingGuideList={initialFeedingGuideList}
          isSubmitting={isSubmitting}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
