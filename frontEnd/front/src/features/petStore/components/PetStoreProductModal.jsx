import "./PetStoreProductModal.css";
import PetStoreProductForm from "./PetStoreProductForm";

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

function normalizeText(value) {
  return String(value ?? "").trim();
}

function findTagIdByName(category, tagName) {
  const normalizedCategory = normalizeText(category);
  const normalizedTagName = normalizeText(tagName);

  if (!normalizedCategory || !normalizedTagName) {
    return "";
  }

  const optionList = PRODUCT_TAG_OPTIONS[normalizedCategory] ?? [];

  const found = optionList.find((tag) => {
    return normalizeText(tag.tagName) === normalizedTagName;
  });

  return found?.tagId ?? "";
}

function isValidTagIdInCategory(category, tagId) {
  const optionList = PRODUCT_TAG_OPTIONS[category] ?? [];

  return optionList.some((tag) => {
    return String(tag.tagId) === String(tagId);
  });
}

function getInitialTagId(detailData) {
  if (!detailData) {
    return "";
  }

  const category = detailData.productCategory;

  const tagName =
    detailData.tagName ??
    detailData.productTagName ??
    detailData.storeProductTagName ??
    detailData.tag?.tagName ??
    detailData.tag?.name ??
    detailData.productTag?.tagName ??
    detailData.productTag?.name ??
    detailData.storeProductTag?.tagName ??
    detailData.storeProductTag?.name ??
    "";

  /*
    백엔드 tagId와 프론트 option tagId가 안 맞는 경우가 있음.
    예: 백엔드 응답 TOILET + tagId 12 + tagName 탈취
    프론트 옵션 TOILET + 탈취 = 13

    그래서 수정 모달 표시용 초기값은 tagName 매칭을 우선한다.
  */
  const tagIdByName = findTagIdByName(category, tagName);

  if (tagIdByName) {
    return String(tagIdByName);
  }

  const directTagId =
    detailData.tagId ??
    detailData.productTagId ??
    detailData.storeProductTagId ??
    detailData.tag?.tagId ??
    detailData.tag?.id ??
    detailData.productTag?.tagId ??
    detailData.productTag?.id ??
    detailData.storeProductTag?.tagId ??
    detailData.storeProductTag?.id ??
    "";

  if (
    directTagId !== "" &&
    directTagId !== null &&
    directTagId !== undefined &&
    isValidTagIdInCategory(category, directTagId)
  ) {
    return String(directTagId);
  }

  return "";
}

function makeInitialBasicData(mode, detailData) {
  if (mode !== "update" || !detailData) {
    return emptyBasicData;
  }

  return {
    productName: detailData.productName ?? "",
    productCategory: detailData.productCategory ?? "FOOD",
    tagId: String(getInitialTagId(detailData) ?? ""),
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
