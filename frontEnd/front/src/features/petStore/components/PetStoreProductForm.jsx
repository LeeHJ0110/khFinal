import { useState } from "react";
import PetStoreProductBasicSection from "./PetStoreProductBasicSection";
import PetStoreProductImageSection from "./PetStoreProductImageSection";
import PetStoreProductNutritionSection from "./PetStoreProductNutritionSection";
import PetStoreProductFeedingGuideSection from "./PetStoreProductFeedingGuideSection";
import useFormData from "../../../shared/hooks/useFormData";

export default function PetStoreProductForm({
  mode,
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
  const [nutrition, setNutrition] = useState(initialNutrition);
  const [feedingGuideList, setFeedingGuideList] = useState(
    initialFeedingGuideList,
  );

  function handleNutritionChange(evt) {
    const { name, value } = evt.target;

    setNutrition((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFeedingGuideChange(index, evt) {
    const { name, value } = evt.target;

    setFeedingGuideList((prev) =>
      prev.map((guide, guideIndex) =>
        guideIndex === index
          ? {
              ...guide,
              [name]: value,
            }
          : guide,
      ),
    );
  }

  function addFeedingGuide() {
    setFeedingGuideList((prev) => [
      ...prev,
      {
        feedingMinWeight: "",
        feedingMaxWeight: "",
        feedingDailyAmount: "",
        feedingUnit: "g",
        feedingNote: "",
      },
    ]);
  }

  function removeFeedingGuide(index) {
    setFeedingGuideList((prev) =>
      prev.filter((_, guideIndex) => guideIndex !== index),
    );
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    const data = {
      ...formData,
      tagId: Number(formData.tagId),
      productPrice: Number(formData.productPrice),
      feedingGuideList: feedingGuideList.map((guide) => ({
        feedingMinWeight: Number(guide.feedingMinWeight),
        feedingMaxWeight: Number(guide.feedingMaxWeight),
        feedingDailyAmount: Number(guide.feedingDailyAmount),
        feedingUnit: guide.feedingUnit,
        feedingNote: guide.feedingNote,
      })),
      nutrition: {
        nutritionCalorie: Number(nutrition.nutritionCalorie),
        nutritionProtein: Number(nutrition.nutritionProtein),
        nutritionFat: Number(nutrition.nutritionFat),
        nutritionFiber: Number(nutrition.nutritionFiber),
        nutritionMoisture: Number(nutrition.nutritionMoisture),
        nutritionCalcium: Number(nutrition.nutritionCalcium),
        nutritionPhosphorus: Number(nutrition.nutritionPhosphorus),
      },
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

    subImages.forEach((file) => {
      multipartFormData.append("subImages", file);
    });

    await onSubmit(multipartFormData);
  }

  return (
    <form onSubmit={handleSubmit}>
      <PetStoreProductBasicSection
        formData={formData}
        handleChange={handleChange}
      />

      <PetStoreProductImageSection
        setMainImage={setMainImage}
        setSubImages={setSubImages}
      />

      <PetStoreProductNutritionSection
        nutrition={nutrition}
        handleNutritionChange={handleNutritionChange}
      />

      <PetStoreProductFeedingGuideSection
        feedingGuideList={feedingGuideList}
        handleFeedingGuideChange={handleFeedingGuideChange}
        addFeedingGuide={addFeedingGuide}
        removeFeedingGuide={removeFeedingGuide}
      />

      <div className="product-modal-actions">
        <button type="button" onClick={onClose}>
          취소
        </button>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "처리 중..."
            : mode === "insert"
              ? "상품등록"
              : "상품수정"}
        </button>
      </div>
    </form>
  );
}
