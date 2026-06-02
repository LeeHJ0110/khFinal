import { useEffect, useMemo } from "react";

export default function PetStoreProductImageSection({
  mode,
  detailData,
  mainImage,
  setMainImage,
  subImages,
  setSubImages,
  mainImagePreview,
  setMainImagePreview,
  subImagePreviews,
  setSubImagePreviews,
}) {
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

  function handleSubImageChange(evt, index) {
    const file = evt.target.files?.[0];

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setSubImages((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });

    setSubImagePreviews((prev) => {
      const next = [...prev];

      if (next[index]) {
        URL.revokeObjectURL(next[index]);
      }

      next[index] = previewUrl;
      return next;
    });
  }

  function handleRemoveSubImage(index) {
    setSubImages((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });

    setSubImagePreviews((prev) => {
      const next = [...prev];

      if (next[index]) {
        URL.revokeObjectURL(next[index]);
      }

      next[index] = "";
      return next;
    });
  }

  return (
    <section className="product-form-section">
      <h3>2. 이미지</h3>

      {mode === "update" && currentImageList.length > 0 && (
        <div className="current-image-area">
          <p>현재 등록된 이미지</p>

          <div className="current-image-list">
            {currentMainImage && (
              <div className="current-image-card">
                <img
                  src={
                    currentMainImage.imageUrl ||
                    currentMainImage.thumbnailUrl ||
                    currentMainImage.imageChangedName
                  }
                  alt="현재 대표 이미지"
                />
                <span>대표</span>
              </div>
            )}

            {currentSubImages.map((image) => (
              <div
                className="current-image-card"
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
                  alt="현재 추가 이미지"
                />
                <span>추가</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="image-upload-layout">
        <label className="image-upload-main">
          <span>대표이미지 *</span>

          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
          />

          <div className="upload-box upload-box-main">
            {mainImagePreview ? (
              <img src={mainImagePreview} alt="대표 이미지 미리보기" />
            ) : (
              <>
                <strong>↥</strong>
                <p>이미지 파일을 업로드하세요.</p>
              </>
            )}
          </div>

          {mainImage && <em>{mainImage.name}</em>}
        </label>

        <div className="image-upload-sub-area">
          <span>
            추가 이미지 <small>최대 3개</small>
          </span>

          <div className="image-upload-sub-list">
            {[0, 1, 2].map((index) => (
              <div className="image-upload-sub-slot" key={index}>
                <label className="image-upload-sub">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(evt) => handleSubImageChange(evt, index)}
                  />

                  <div className="upload-box">
                    {subImagePreviews[index] ? (
                      <img
                        src={subImagePreviews[index]}
                        alt={`추가 이미지 ${index + 1}`}
                      />
                    ) : (
                      <>
                        <strong>+</strong>
                        <p>추가 이미지</p>
                      </>
                    )}
                  </div>
                </label>

                {subImagePreviews[index] && (
                  <button
                    type="button"
                    className="sub-image-remove-button"
                    onClick={() => handleRemoveSubImage(index)}
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
