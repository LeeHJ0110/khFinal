import { useMemo, useState } from "react";
import PetStoreProductBasicSection from "./PetStoreProductBasicSection";
import PetStoreProductImageSection from "./PetStoreProductImageSection";
import PetStoreProductNutritionSection from "./PetStoreProductNutritionSection";
import PetStoreProductFeedingGuideSection from "./PetStoreProductFeedingGuideSection";
import useFormData from "../../../shared/hooks/useFormData";

const FEEDING_GUIDE_CATEGORIES = ["FOOD", "SUPPLEMENT", "SNACK"];
const NUTRITION_CATEGORIES = ["FOOD", "SUPPLEMENT", "SNACK"];

const NUTRITION_FIELD_NAMES = [
  "nutritionCalorie",
  "nutritionProtein",
  "nutritionFat",
  "nutritionFiber",
  "nutritionMoisture",
  "nutritionCalcium",
  "nutritionPhosphorus",
];

function isFeedingGuideCategory(category) {
  return FEEDING_GUIDE_CATEGORIES.includes(category);
}

function isNutritionCategory(category) {
  return NUTRITION_CATEGORIES.includes(category);
}

function toNumberOrNull(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return Number(value);
}

function toNumberOrZero(value) {
  if (value === "" || value === null || value === undefined) {
    return 0;
  }

  return Number(value);
}

function getCategoryLabel(category) {
  const map = {
    FOOD: "사료",
    SNACK: "간식",
    SUPPLEMENT: "영양제",
    TOILET: "배변용품",
  };

  return map[category] ?? category;
}

function getPetTypeLabel(type) {
  const map = {
    D: "강아지",
    C: "고양이",
  };

  return map[type] ?? type;
}

export default function PetStoreProductForm({
  mode,
  detailData,
  initialBasicData,
  initialNutrition,
  initialFeedingGuideList,
  isSubmitting,
  onClose,
  onSubmit,
}) {
  const { formData, handleChange } = useFormData(initialBasicData);

  const [mainImage, setMainImage] = useState(null);
  const [subImages, setSubImages] = useState([]);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [subImagePreviews, setSubImagePreviews] = useState([]);

  const [nutrition, setNutrition] = useState(initialNutrition);

  const [feedingGuideList, setFeedingGuideList] = useState(
    initialFeedingGuideList,
  );

  const [feedingUnit, setFeedingUnit] = useState(
    initialFeedingGuideList?.[0]?.feedingUnit || "g",
  );

  const isNutritionVisible = isNutritionCategory(formData.productCategory);
  const isFeedingGuideVisible = isFeedingGuideCategory(
    formData.productCategory,
  );

  const nutritionRows = isNutritionVisible ? NUTRITION_FIELD_NAMES : [];

  const previewImageUrl = useMemo(() => {
    if (mainImagePreview) {
      return mainImagePreview;
    }

    const currentImageList =
      detailData?.imageList ||
      detailData?.images ||
      detailData?.productImageList ||
      [];

    const currentMainImage = currentImageList.find(
      (image) => image.imageRepresentYn === "Y",
    );

    return (
      currentMainImage?.imageUrl ||
      currentMainImage?.thumbnailUrl ||
      currentMainImage?.imageChangedName ||
      ""
    );
  }, [mainImagePreview, detailData]);

  const previewSubImageUrls = useMemo(() => {
    const currentImageList =
      detailData?.imageList ||
      detailData?.images ||
      detailData?.productImageList ||
      [];

    const currentSubImageUrls = currentImageList
      .filter((image) => image.imageRepresentYn === "N")
      .map(
        (image) =>
          image.imageUrl || image.thumbnailUrl || image.imageChangedName,
      )
      .filter(Boolean);

    const maxLength = Math.max(
      subImagePreviews.length,
      currentSubImageUrls.length,
    );

    return Array.from({ length: maxLength }, (_, index) => {
      return subImagePreviews[index] || currentSubImageUrls[index] || "";
    }).filter(Boolean);
  }, [subImagePreviews, detailData]);

  function handleNutritionChange(evt) {
    const { name, value } = evt.target;

    setNutrition((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFeedingUnitChange(evt) {
    const nextUnit = evt.target.value;

    setFeedingUnit(nextUnit);

    setFeedingGuideList((prev) =>
      prev.map((guide) => ({
        ...guide,
        feedingUnit: nextUnit,
      })),
    );
  }

  function handleFeedingGuideChange(index, evt) {
    const { name, value } = evt.target;

    setFeedingGuideList((prev) => {
      const next = prev.map((guide) => ({ ...guide }));

      next[index][name] = value;
      next[index].feedingUnit = feedingUnit;

      if (index === 0 && name === "feedingMaxWeight") {
        next[1].feedingMinWeight = value;
      }

      if (index === 1 && name === "feedingMaxWeight") {
        next[2].feedingMinWeight = value;
      }

      return next;
    });
  }

  function makeSubmitFeedingGuideList() {
    if (!isFeedingGuideVisible) {
      return [];
    }

    return [
      {
        feedingMinWeight: null,
        feedingMaxWeight: toNumberOrNull(feedingGuideList[0]?.feedingMaxWeight),
        feedingDailyAmount: toNumberOrNull(
          feedingGuideList[0]?.feedingDailyAmount,
        ),
        feedingUnit,
        feedingNote: feedingGuideList[0]?.feedingNote || "",
      },
      {
        feedingMinWeight: toNumberOrNull(feedingGuideList[0]?.feedingMaxWeight),
        feedingMaxWeight: toNumberOrNull(feedingGuideList[1]?.feedingMaxWeight),
        feedingDailyAmount: toNumberOrNull(
          feedingGuideList[1]?.feedingDailyAmount,
        ),
        feedingUnit,
        feedingNote: feedingGuideList[1]?.feedingNote || "",
      },
      {
        feedingMinWeight: toNumberOrNull(feedingGuideList[1]?.feedingMaxWeight),
        feedingMaxWeight: null,
        feedingDailyAmount: toNumberOrNull(
          feedingGuideList[2]?.feedingDailyAmount,
        ),
        feedingUnit,
        feedingNote: feedingGuideList[2]?.feedingNote || "",
      },
    ];
  }

  function makeSubmitNutrition() {
    if (!isNutritionVisible) {
      return null;
    }

    return {
      nutritionCalorie: toNumberOrZero(nutrition.nutritionCalorie),
      nutritionProtein: toNumberOrZero(nutrition.nutritionProtein),
      nutritionFat: toNumberOrZero(nutrition.nutritionFat),
      nutritionFiber: toNumberOrZero(nutrition.nutritionFiber),
      nutritionMoisture: toNumberOrZero(nutrition.nutritionMoisture),
      nutritionCalcium: toNumberOrZero(nutrition.nutritionCalcium),
      nutritionPhosphorus: toNumberOrZero(nutrition.nutritionPhosphorus),
    };
  }

  function validateBeforeSubmit() {
    if (!formData.productName.trim()) {
      alert("상품명을 입력해주세요.");
      return false;
    }

    if (!formData.productTargetPetType) {
      alert("대상동물을 선택해주세요.");
      return false;
    }

    if (!formData.productCategory) {
      alert("카테고리를 선택해주세요.");
      return false;
    }

    if (!formData.tagId) {
      alert("기능성 태그를 선택해주세요.");
      return false;
    }

    if (!formData.productPrice) {
      alert("상품 가격을 입력해주세요.");
      return false;
    }

    if (!isFeedingGuideVisible) {
      return true;
    }

    const firstMaxWeight = toNumberOrNull(
      feedingGuideList[0]?.feedingMaxWeight,
    );
    const secondMaxWeight = toNumberOrNull(
      feedingGuideList[1]?.feedingMaxWeight,
    );

    const firstAmount = toNumberOrNull(feedingGuideList[0]?.feedingDailyAmount);
    const secondAmount = toNumberOrNull(
      feedingGuideList[1]?.feedingDailyAmount,
    );
    const thirdAmount = toNumberOrNull(feedingGuideList[2]?.feedingDailyAmount);

    if (firstMaxWeight === null || secondMaxWeight === null) {
      alert("급여기준의 기준 체중 n1, n2를 입력해주세요.");
      return false;
    }

    if (firstMaxWeight <= 0 || secondMaxWeight <= 0) {
      alert("급여기준 체중은 0보다 커야 합니다.");
      return false;
    }

    if (firstMaxWeight >= secondMaxWeight) {
      alert("두 번째 기준 체중은 첫 번째 기준 체중보다 커야 합니다.");
      return false;
    }

    if (firstAmount === null || secondAmount === null || thirdAmount === null) {
      alert("급여기준 3개의 1일 급여량을 모두 입력해주세요.");
      return false;
    }

    if (firstAmount <= 0 || secondAmount <= 0 || thirdAmount <= 0) {
      alert("1일 급여량은 0보다 커야 합니다.");
      return false;
    }

    return true;
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    if (!validateBeforeSubmit()) {
      return;
    }

    const data = {
      ...formData,
      tagId: Number(formData.tagId),
      productPrice: Number(formData.productPrice),
      feedingGuideList: makeSubmitFeedingGuideList(),
      nutrition: makeSubmitNutrition(),
    };

    const multipartFormData = new FormData();

    multipartFormData.append(
      "data",
      new Blob([JSON.stringify(data)], {
        type: "application/json",
      }),
    );

    if (mainImage) {
      multipartFormData.append("mainImage", mainImage);
    }

    subImages.filter(Boolean).forEach((file) => {
      multipartFormData.append("subImages", file);
    });

    await onSubmit(multipartFormData);
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="product-form-layout">
        <div className="product-form-left">
          <PetStoreProductBasicSection
            formData={formData}
            handleChange={handleChange}
          />

          <PetStoreProductImageSection
            mode={mode}
            detailData={detailData}
            mainImage={mainImage}
            setMainImage={setMainImage}
            subImages={subImages}
            setSubImages={setSubImages}
            mainImagePreview={mainImagePreview}
            setMainImagePreview={setMainImagePreview}
            subImagePreviews={subImagePreviews}
            setSubImagePreviews={setSubImagePreviews}
          />

          {isNutritionVisible && (
            <PetStoreProductNutritionSection
              nutrition={nutrition}
              nutritionRows={nutritionRows}
              handleNutritionChange={handleNutritionChange}
            />
          )}

          {isFeedingGuideVisible && (
            <PetStoreProductFeedingGuideSection
              feedingGuideList={feedingGuideList}
              feedingUnit={feedingUnit}
              handleFeedingUnitChange={handleFeedingUnitChange}
              handleFeedingGuideChange={handleFeedingGuideChange}
            />
          )}
        </div>

        <aside className="product-form-preview">
          <h3>미리보기</h3>

          <div className="preview-main">
            <div className="preview-image-box">
              {previewImageUrl ? (
                <img src={previewImageUrl} alt="상품 미리보기" />
              ) : (
                <span>이미지</span>
              )}
            </div>

            <div className="preview-info">
              <p className="preview-name">
                {formData.productName || "상품명을 입력해주세요."}
              </p>
              <strong>
                {formData.productPrice
                  ? `${Number(formData.productPrice).toLocaleString()}원`
                  : "0원"}
              </strong>
              <p className="preview-desc">
                {getCategoryLabel(formData.productCategory)} 상품 정보를
                확인해주세요.
              </p>
            </div>
          </div>

          <div className="preview-chip-row">
            <span>{getPetTypeLabel(formData.productTargetPetType)}</span>
            <span>{getCategoryLabel(formData.productCategory)}</span>
          </div>

          <div className="preview-thumb-row">
            {[previewImageUrl, ...previewSubImageUrls]
              .filter(Boolean)
              .map((url, index) => (
                <div className="preview-thumb" key={`${url}-${index}`}>
                  <img src={url} alt={`미리보기 ${index + 1}`} />
                </div>
              ))}
          </div>

          {isNutritionVisible && (
            <div className="preview-panel">
              <h4>영양성분</h4>

              <ul>
                {nutritionRows.map((rowName) => (
                  <li key={rowName}>
                    <span>{getNutritionLabel(rowName)}</span>
                    <strong>{nutrition[rowName] || "-"}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isFeedingGuideVisible && (
            <div className="preview-panel">
              <h4>급여 가이드</h4>

              <ul>
                <li>
                  <span>
                    ~{feedingGuideList[0]?.feedingMaxWeight || "n1"}kg 미만
                  </span>
                  <strong>
                    1일 {feedingGuideList[0]?.feedingDailyAmount || "-"}
                    {feedingUnit}
                  </strong>
                </li>
                <li>
                  <span>
                    {feedingGuideList[0]?.feedingMaxWeight || "n1"}~
                    {feedingGuideList[1]?.feedingMaxWeight || "n2"}kg
                  </span>
                  <strong>
                    1일 {feedingGuideList[1]?.feedingDailyAmount || "-"}
                    {feedingUnit}
                  </strong>
                </li>
                <li>
                  <span>
                    {feedingGuideList[1]?.feedingMaxWeight || "n2"}kg 이상
                  </span>
                  <strong>
                    1일 {feedingGuideList[2]?.feedingDailyAmount || "-"}
                    {feedingUnit}
                  </strong>
                </li>
              </ul>
            </div>
          )}

          {!isNutritionVisible && !isFeedingGuideVisible && (
            <div className="preview-panel preview-panel-soft">
              <h4>배변용품 안내</h4>
              <p className="preview-empty">
                배변용품은 영양성분과 급여기준 입력 없이 등록됩니다.
              </p>
            </div>
          )}
        </aside>
      </div>

      <div className="product-modal-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "처리 중..."
            : mode === "insert"
              ? "상품등록"
              : "상품수정"}
        </button>

        <button type="button" onClick={onClose}>
          취소
        </button>
      </div>
    </form>
  );
}

function getNutritionLabel(name) {
  const map = {
    nutritionCalorie: "칼로리",
    nutritionProtein: "단백질",
    nutritionFat: "지방",
    nutritionFiber: "식이섬유",
    nutritionMoisture: "수분",
    nutritionCalcium: "칼슘",
    nutritionPhosphorus: "인",
  };

  return map[name] ?? name;
}
