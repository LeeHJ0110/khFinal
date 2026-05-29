import { useEffect, useMemo, useState } from "react";

export default function PetStoreProductImageSection({
  mode,
  detailData,
  mainImage,
  setMainImage,
  subImages,
  setSubImages,
}) {
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [subImagePreviews, setSubImagePreviews] = useState([]);

  const currentImageList = useMemo(() => {
    return (
      detailData?.imageList ||
      detailData?.images ||
      detailData?.productImageList ||
      []
    );
  }, [detailData]);

  const currentMainImage = currentImageList.find(
    (image) => image.imageRepresentYn === "Y",
  );

  const currentSubImages = currentImageList.filter(
    (image) => image.imageRepresentYn === "N",
  );

  useEffect(() => {
    return () => {
      if (mainImagePreview) {
        URL.revokeObjectURL(mainImagePreview);
      }

      subImagePreviews.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
    };
  }, [mainImagePreview, subImagePreviews]);

  function handleMainImageChange(evt) {
    const file = evt.target.files?.[0];

    if (!file) {
      setMainImage(null);
      setMainImagePreview("");
      return;
    }

    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));
  }

  function handleSubImagesChange(evt) {
    const files = Array.from(evt.target.files ?? []);

    setSubImages(files);
    setSubImagePreviews(files.map((file) => URL.createObjectURL(file)));
  }

  return (
    <section className="product-form-section">
      <h3>상품 이미지</h3>

      {mode === "update" && currentImageList.length > 0 && (
        <div className="product-form-image-current-area">
          <p className="product-form-image-title">현재 등록된 이미지</p>

          <div className="product-form-image-preview-list">
            {currentMainImage && (
              <div className="product-form-image-preview-card">
                <img
                  src={
                    currentMainImage.imageUrl ||
                    currentMainImage.thumbnailUrl ||
                    currentMainImage.imageChangedName
                  }
                  alt="현재 대표 이미지"
                />
                <span>현재 대표</span>
              </div>
            )}

            {currentSubImages.map((image) => (
              <div
                className="product-form-image-preview-card"
                key={
                  image.imageId ||
                  image.productImageId ||
                  image.imageChangedName
                }
              >
                <img
                  src={
                    image.imageUrl ||
                    image.thumbnailUrl ||
                    image.imageChangedName
                  }
                  alt="현재 상세 이미지"
                />
                <span>현재 상세</span>
              </div>
            ))}
          </div>

          <p className="product-form-image-help">
            새 이미지를 선택하지 않으면 기존 이미지가 유지됩니다.
          </p>
        </div>
      )}

      <div className="product-form-row">
        <label>대표 이미지</label>

        <input type="file" accept="image/*" onChange={handleMainImageChange} />

        {mainImage && (
          <p className="product-form-file-name">{mainImage.name}</p>
        )}

        {mainImagePreview && (
          <div className="product-form-image-preview-card">
            <img src={mainImagePreview} alt="새 대표 이미지 미리보기" />
            <span>새 대표</span>
          </div>
        )}
      </div>

      <div className="product-form-row">
        <label>상세 이미지</label>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleSubImagesChange}
        />

        {subImages.length > 0 && (
          <p className="product-form-file-name">
            {subImages.length}개 파일 선택됨
          </p>
        )}

        {subImagePreviews.length > 0 && (
          <div className="product-form-image-preview-list">
            {subImagePreviews.map((previewUrl, index) => (
              <div className="product-form-image-preview-card" key={previewUrl}>
                <img src={previewUrl} alt={`새 상세 이미지 ${index + 1}`} />
                <span>새 상세 {index + 1}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
