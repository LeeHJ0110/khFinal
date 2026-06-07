import { useEffect, useMemo } from "react";

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  if (typeof image === "string") {
    return image;
  }

  return (
    image.imageUrl ||
    image.thumbnailUrl ||
    image.mainImageUrl ||
    image.subImageUrl ||
    image.productImageUrl ||
    image.productThumbnailUrl ||
    image.imageChangedName ||
    image.changedName ||
    image.savedName ||
    image.fileUrl ||
    image.url ||
    ""
  );
}

function isMainImage(image) {
  if (!image || typeof image === "string") {
    return false;
  }

  return (
    image.imageRepresentYn === "Y" ||
    image.representYn === "Y" ||
    image.mainYn === "Y" ||
    image.imageMainYn === "Y" ||
    image.productImageRepresentYn === "Y" ||
    image.isMain === true ||
    image.isRepresentative === true
  );
}

function getCurrentImageList(detailData) {
  if (!detailData) {
    return [];
  }

  const imageList =
    detailData.imageList ||
    detailData.images ||
    detailData.productImageList ||
    detailData.storeProductImageList ||
    detailData.productImages ||
    [];

  if (Array.isArray(imageList) && imageList.length > 0) {
    return imageList;
  }

  const fallbackList = [];

  if (detailData.mainImageUrl) {
    fallbackList.push({
      imageUrl: detailData.mainImageUrl,
      imageRepresentYn: "Y",
    });
  }

  if (detailData.thumbnailUrl) {
    fallbackList.push({
      imageUrl: detailData.thumbnailUrl,
      imageRepresentYn: "Y",
    });
  }

  if (Array.isArray(detailData.subImageUrls)) {
    detailData.subImageUrls.forEach((url) => {
      fallbackList.push({
        imageUrl: url,
        imageRepresentYn: "N",
      });
    });
  }

  if (Array.isArray(detailData.subImages)) {
    detailData.subImages.forEach((url) => {
      fallbackList.push({
        imageUrl: url,
        imageRepresentYn: "N",
      });
    });
  }

  return fallbackList;
}

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
    return getCurrentImageList(detailData);
  }, [detailData]);

  const currentMainImage = useMemo(() => {
    const foundMain = currentImageList.find((image) => isMainImage(image));

    if (foundMain) {
      return foundMain;
    }

    return currentImageList[0] ?? null;
  }, [currentImageList]);

  const currentSubImageUrls = useMemo(() => {
    return currentImageList
      .filter((image) => {
        if (image === currentMainImage) {
          return false;
        }

        if (isMainImage(image)) {
          return false;
        }

        return true;
      })
      .map((image) => getImageUrl(image))
      .filter(Boolean)
      .slice(0, 3);
  }, [currentImageList, currentMainImage]);

  const currentMainImageUrl = getImageUrl(currentMainImage);

  useEffect(() => {
    return () => {
      if (mainImagePreview) {
        URL.revokeObjectURL(mainImagePreview);
      }

      subImagePreviews.forEach((previewUrl) => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
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

    if (mainImagePreview) {
      URL.revokeObjectURL(mainImagePreview);
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

  function getMainDisplayUrl() {
    return mainImagePreview || currentMainImageUrl;
  }

  function getSubDisplayUrl(index) {
    return subImagePreviews[index] || currentSubImageUrls[index] || "";
  }

  return (
    <section className="product-form-section">
      <h3>2. 이미지</h3>

      {mode === "update" && currentImageList.length > 0 && (
        <div className="current-image-area">
          <p>현재 등록된 이미지</p>

          <div className="current-image-list">
            {currentMainImageUrl && (
              <div className="current-image-card">
                <img src={currentMainImageUrl} alt="현재 대표 이미지" />
                <span>대표</span>
              </div>
            )}

            {currentSubImageUrls.map((url, index) => (
              <div className="current-image-card" key={`${url}-${index}`}>
                <img src={url} alt={`현재 추가 이미지 ${index + 1}`} />
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
            {getMainDisplayUrl() ? (
              <img src={getMainDisplayUrl()} alt="대표 이미지 미리보기" />
            ) : (
              <>
                <strong>↥</strong>
                <p>이미지 파일을 업로드하세요.</p>
              </>
            )}
          </div>

          {mainImage ? (
            <em>{mainImage.name}</em>
          ) : mode === "update" && currentMainImageUrl ? (
            <em>기존 대표 이미지를 사용 중입니다.</em>
          ) : null}
        </label>

        <div className="image-upload-sub-area">
          <span>
            추가 이미지 <small>최대 3개</small>
          </span>

          <div className="image-upload-sub-list">
            {[0, 1, 2].map((index) => {
              const displayUrl = getSubDisplayUrl(index);
              const hasNewImage = !!subImagePreviews[index];
              const hasCurrentImage = !!currentSubImageUrls[index];

              return (
                <div className="image-upload-sub-slot" key={index}>
                  <label className="image-upload-sub">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(evt) => handleSubImageChange(evt, index)}
                    />

                    <div className="upload-box">
                      {displayUrl ? (
                        <img
                          src={displayUrl}
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

                  {hasNewImage && (
                    <button
                      type="button"
                      className="sub-image-remove-button"
                      onClick={() => handleRemoveSubImage(index)}
                    >
                      삭제
                    </button>
                  )}

                  {!hasNewImage && hasCurrentImage && (
                    <span className="existing-image-label">기존 이미지</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
