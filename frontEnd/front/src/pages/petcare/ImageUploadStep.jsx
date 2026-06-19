import { useEffect, useState } from "react";
import styled from "styled-components";

import imageAnalysisImage from "../../features/petcare/img/이미지 분석.png";

const MAX_IMAGE_COUNT = 6;

// =========================================================
// 선택 이미지 미리보기
// =========================================================
function ImagePreview({ file, index, label, onRemove }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return (
    <PreviewItem>
      {previewUrl && (
        <PreviewImage
          src={previewUrl}
          alt={`${label} 이미지 ${index + 1}`}
        />
      )}

      <RemoveButton
        type="button"
        aria-label={`${label} 이미지 삭제`}
        onClick={() => onRemove(index)}
      >
        ×
      </RemoveButton>

      <PreviewName title={file.name}>{file.name}</PreviewName>
    </PreviewItem>
  );
}

// =========================================================
// 항목별 이미지 업로드 박스
// =========================================================
function ImageUploadBox({ id, title, description, files, onChangeFiles }) {
  const isUploadLimitReached = files.length >= MAX_IMAGE_COUNT;

  function handleFileChange(event) {
    const selectedFiles = Array.from(event.target.files);

    if (selectedFiles.length === 0) {
      return;
    }

    const remainingCount = MAX_IMAGE_COUNT - files.length;

    if (remainingCount <= 0) {
      window.alert(`${title}는 최대 ${MAX_IMAGE_COUNT}장까지 등록할 수 있습니다.`);

      event.target.value = "";

      return;
    }

    const filesToAdd = selectedFiles.slice(0, remainingCount);

    onChangeFiles((previousFiles) => [...previousFiles, ...filesToAdd]);

    if (selectedFiles.length > remainingCount) {
      window.alert(
        `${title}는 최대 ${MAX_IMAGE_COUNT}장까지 등록할 수 있습니다.\n초과한 이미지는 추가되지 않았습니다.`,
      );
    }

    event.target.value = "";
  }

  function handleRemoveFile(removeIndex) {
    onChangeFiles((previousFiles) =>
      previousFiles.filter((_, index) => index !== removeIndex),
    );
  }

  return (
    <UploadBox>
      <UploadTop>
        <UploadTitle>{title}</UploadTitle>
        <UploadCount>{files.length}/{MAX_IMAGE_COUNT}</UploadCount>
      </UploadTop>

      <UploadGuide>{description}</UploadGuide>

      <UploadDropLabel
        htmlFor={id}
        $disabled={isUploadLimitReached}
        $hasFiles={files.length > 0}
      >
        <UploadIcon>＋</UploadIcon>

        <UploadMainText>
          {isUploadLimitReached ? "최대 개수까지 선택했어요" : "이미지 선택"}
        </UploadMainText>

        <UploadSubText>
          jpg, png 등 이미지 파일을 등록할 수 있습니다.
        </UploadSubText>
      </UploadDropLabel>

      <FileInput
        id={id}
        type="file"
        multiple
        accept="image/*"
        disabled={isUploadLimitReached}
        onChange={handleFileChange}
      />

      <FileCount
        $hasFiles={files.length > 0}
        $isLimitReached={isUploadLimitReached}
      >
        {files.length === 0
          ? "선택된 이미지가 없습니다."
          : `${files.length}장의 이미지가 선택되었습니다.`}
      </FileCount>

      {files.length > 0 && (
        <PreviewList>
          {files.map((file, index) => (
            <ImagePreview
              key={`${file.name}-${file.lastModified}-${index}`}
              file={file}
              index={index}
              label={title}
              onRemove={handleRemoveFile}
            />
          ))}
        </PreviewList>
      )}
    </UploadBox>
  );
}

// =========================================================
// 이미지 분석 단계
// =========================================================
function ImageUploadStep({
  eyeFiles,
  skinFiles,
  teethFiles,
  onChangeEyeFiles,
  onChangeSkinFiles,
  onChangeTeethFiles,
}) {
  return (
    <Section>
      <CategoryImage
        src={imageAnalysisImage}
        alt="이미지 분석"
      />

      <SectionTitle>이미지 분석</SectionTitle>

      <Description>
        사진을 등록하면 수의사가 눈, 피부, 치아 상태를 더 자세히 확인할 수 있습니다.
      </Description>

      <OptionalNotice>
        사진 첨부는 선택 사항이며, 없어도 건강진단 신청이 가능합니다.
      </OptionalNotice>

      <UploadGrid>
        <ImageUploadBox
          id="eyeFiles"
          title="눈"
          description="눈이 정면에서 선명하게 보이는 사진을 올려 주세요."
          files={eyeFiles}
          onChangeFiles={onChangeEyeFiles}
        />

        <ImageUploadBox
          id="skinFiles"
          title="피부"
          description="붉어짐, 상처, 털 빠짐 등 확인이 필요한 부위를 올려 주세요."
          files={skinFiles}
          onChangeFiles={onChangeSkinFiles}
        />

        <ImageUploadBox
          id="teethFiles"
          title="치아"
          description="치아와 잇몸 상태가 잘 보이도록 촬영해 주세요."
          files={teethFiles}
          onChangeFiles={onChangeTeethFiles}
        />
      </UploadGrid>
    </Section>
  );
}

export default ImageUploadStep;

// =========================================================
// styled-components
// =========================================================
const Section = styled.section`
  text-align: center;

  padding-top: 4px;
`;

const CategoryImage = styled.img`
  display: block;

  width: 64px;
  height: 64px;

  margin: 0 auto 10px;

  object-fit: contain;
`;

const SectionTitle = styled.h2`
  margin: 0 0 10px;

  color: #222222;

  font-size: 24px;
  font-weight: 800;
`;

const Description = styled.p`
  margin: 0 0 8px;

  color: #555555;

  font-size: 15px;
  font-weight: 500;
  line-height: 1.6;

  word-break: keep-all;
`;

const OptionalNotice = styled.div`
  width: fit-content;
  max-width: 720px;

  margin: 0 auto 24px;
  padding: 8px 14px;

  border-radius: 999px;

  background: #f3faf7;

  color: #5f7770;

  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;

  word-break: keep-all;
`;

const UploadGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 18px;

  max-width: 1160px;

  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const UploadBox = styled.div`
  min-height: 260px;

  padding: 22px;

  border: 1px solid #dfece7;
  border-radius: 18px;

  background: #ffffff;

  box-sizing: border-box;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);

    border-color: rgba(0, 169, 123, 0.34);

    box-shadow: 0 12px 26px rgba(0, 169, 123, 0.08);
  }
`;

const UploadTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 10px;
`;

const UploadTitle = styled.h3`
  margin: 0;

  color: #00976f;

  font-size: 20px;
  font-weight: 900;
`;

const UploadCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 42px;
  height: 24px;

  border-radius: 999px;

  background: #f0f7f5;

  color: #6f8d84;

  font-size: 12px;
  font-weight: 800;
`;

const UploadGuide = styled.p`
  min-height: 42px;

  margin: 0 0 16px;

  color: #606f6a;

  font-size: 13px;
  font-weight: 500;
  line-height: 1.6;
  text-align: left;

  word-break: keep-all;
`;

const UploadDropLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 92px;

  padding: 14px;

  border: 1.5px dashed
    ${({ $disabled, $hasFiles }) => {
      if ($disabled) {
        return "#c5d4cf";
      }

      if ($hasFiles) {
        return "rgba(0, 169, 123, 0.45)";
      }

      return "#cfe3dc";
    }};

  border-radius: 14px;

  background: ${({ $hasFiles }) => ($hasFiles ? "#f7fcfa" : "#fbfdfc")};

  box-sizing: border-box;

  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};

  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease;

  &:hover {
    border-color: ${({ $disabled }) =>
      $disabled ? "#c5d4cf" : "rgba(0, 169, 123, 0.65)"};

    background: ${({ $disabled }) => ($disabled ? "#fbfdfc" : "#f4fbf8")};

    transform: ${({ $disabled }) => ($disabled ? "none" : "translateY(-1px)")};
  }
`;

const UploadIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 28px;
  height: 28px;

  margin-bottom: 7px;

  border-radius: 50%;

  background: #00a97b;

  color: #ffffff;

  font-size: 19px;
  font-weight: 800;
  line-height: 1;
`;

const UploadMainText = styled.span`
  color: #222222;

  font-size: 14px;
  font-weight: 800;
`;

const UploadSubText = styled.span`
  margin-top: 4px;

  color: #8a9b95;

  font-size: 12px;
  font-weight: 500;
`;

const FileInput = styled.input`
  display: none;
`;

const FileCount = styled.p`
  margin: 12px 0 0;

  color: ${({ $isLimitReached, $hasFiles }) => {
    if ($isLimitReached) {
      return "#00976f";
    }

    if ($hasFiles) {
      return "#4f6f64";
    }

    return "#999999";
  }};

  font-size: 13px;
  font-weight: ${({ $isLimitReached, $hasFiles }) =>
    $isLimitReached || $hasFiles ? 700 : 500};
`;

const PreviewList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 10px;

  margin-top: 16px;
`;

const PreviewItem = styled.div`
  position: relative;

  min-width: 0;
`;

const PreviewImage = styled.img`
  width: 100%;

  aspect-ratio: 1 / 1;

  border-radius: 10px;

  object-fit: cover;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -7px;
  right: -7px;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 22px;
  height: 22px;

  border: none;
  border-radius: 50%;

  background: #333333;
  color: #ffffff;

  font-size: 17px;
  line-height: 1;

  cursor: pointer;
`;

const PreviewName = styled.p`
  overflow: hidden;

  margin: 5px 0 0;

  color: #777777;

  font-size: 11px;

  text-overflow: ellipsis;
  white-space: nowrap;
`;