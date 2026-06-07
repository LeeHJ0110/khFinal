import { useEffect, useState } from "react";
import styled from "styled-components";

const MIN_IMAGE_COUNT = 1;
const MAX_IMAGE_COUNT = 6;

// =========================================================
// 선택 이미지 미리보기
// =========================================================
function ImagePreview({
  file,
  index,
  label,
  onRemove,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const objectUrl =
      URL.createObjectURL(file);

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

      <PreviewName title={file.name}>
        {file.name}
      </PreviewName>
    </PreviewItem>
  );
}

// =========================================================
// 항목별 이미지 업로드 박스
// =========================================================
function ImageUploadBox({
  id,
  title,
  description,
  files,
  onChangeFiles,
}) {
  const isUploadLimitReached =
    files.length >= MAX_IMAGE_COUNT;

  // =========================================================
  // 이미지 선택
  // =========================================================
  function handleFileChange(event) {
    const selectedFiles =
      Array.from(event.target.files);

    if (selectedFiles.length === 0) {
      return;
    }

    const remainingCount =
      MAX_IMAGE_COUNT - files.length;

    // 이미 최대 개수까지 등록한 경우
    if (remainingCount <= 0) {
      window.alert(
        `${title}는 최대 ${MAX_IMAGE_COUNT}장까지 등록할 수 있습니다.`,
      );

      event.target.value = "";

      return;
    }

    // 남은 자리만큼만 추가
    const filesToAdd =
      selectedFiles.slice(
        0,
        remainingCount,
      );

    onChangeFiles((previousFiles) => [
      ...previousFiles,
      ...filesToAdd,
    ]);

    // 초과 이미지를 선택한 경우 안내
    if (
      selectedFiles.length >
      remainingCount
    ) {
      window.alert(
        `${title}는 최대 ${MAX_IMAGE_COUNT}장까지 등록할 수 있습니다.\n초과한 이미지는 추가되지 않았습니다.`,
      );
    }

    // 같은 파일도 다시 선택할 수 있도록 초기화
    event.target.value = "";
  }

  // =========================================================
  // 선택 이미지 삭제
  // =========================================================
  function handleRemoveFile(removeIndex) {
    onChangeFiles((previousFiles) =>
      previousFiles.filter(
        (_, index) =>
          index !== removeIndex,
      ),
    );
  }

  return (
    <UploadBox>
      <UploadTitle>
        {title}
      </UploadTitle>

      <UploadGuide>
        {description}
      </UploadGuide>

      <UploadLimitGuide>
        {MIN_IMAGE_COUNT}장 이상, 최대{" "}
        {MAX_IMAGE_COUNT}장까지 등록할 수 있습니다.
      </UploadLimitGuide>

      <FileInputLabel
        htmlFor={id}
        $disabled={
          isUploadLimitReached
        }
      >
        {isUploadLimitReached
          ? "최대 개수 도달"
          : "이미지 선택"}
      </FileInputLabel>

      <FileInput
        id={id}
        type="file"
        multiple
        accept="image/*"
        disabled={
          isUploadLimitReached
        }
        onChange={
          handleFileChange
        }
      />

      <FileCount
        $isLimitReached={
          isUploadLimitReached
        }
      >
        선택된 이미지: {files.length}/
        {MAX_IMAGE_COUNT}개
      </FileCount>

      {files.length > 0 && (
        <PreviewList>
          {files.map(
            (file, index) => (
              <ImagePreview
                key={`${file.name}-${file.lastModified}-${index}`}
                file={file}
                index={index}
                label={title}
                onRemove={
                  handleRemoveFile
                }
              />
            ),
          )}
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
      <SectionTitle>
        이미지 분석
      </SectionTitle>

      <Description>
        정확한 분석을 위해 눈, 피부, 치아 이미지를 각각 등록해 주세요.
        <br />
        각 항목별로 1장 이상, 최대 6장까지 첨부할 수 있습니다.
      </Description>

      <UploadGrid>
        <ImageUploadBox
          id="eyeFiles"
          title="눈 이미지"
          description="반려동물의 눈이 선명하게 보이는 이미지를 등록해 주세요."
          files={eyeFiles}
          onChangeFiles={
            onChangeEyeFiles
          }
        />

        <ImageUploadBox
          id="skinFiles"
          title="피부 이미지"
          description="이상이 의심되는 피부 부위가 보이도록 등록해 주세요."
          files={skinFiles}
          onChangeFiles={
            onChangeSkinFiles
          }
        />

        <ImageUploadBox
          id="teethFiles"
          title="치아 이미지"
          description="입 안쪽과 치아 상태가 잘 보이는 이미지를 등록해 주세요."
          files={teethFiles}
          onChangeFiles={
            onChangeTeethFiles
          }
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
`;

const SectionTitle = styled.h2`
  margin: 0 0 10px;

  color: #333333;

  font-size: 24px;
  font-weight: 800;
`;

const Description = styled.p`
  margin: 0 0 24px;

  color: #777777;

  font-size: 14px;
  line-height: 1.7;
`;

const UploadGrid = styled.div`
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const UploadBox = styled.div`
  min-height: 280px;

  padding: 22px;

  border: 1px solid #e0ebe7;
  border-radius: 14px;

  background: #ffffff;

  box-sizing: border-box;
`;

const UploadTitle = styled.h3`
  margin: 0 0 10px;

  color: #00a97b;

  font-size: 18px;
  font-weight: 800;
`;

const UploadGuide = styled.p`
  min-height: 42px;

  margin: 0 0 8px;

  color: #777777;

  font-size: 13px;
  line-height: 1.6;
`;

const UploadLimitGuide = styled.p`
  margin: 0 0 16px;

  color: #00a97b;

  font-size: 12px;
  font-weight: 700;
`;

const FileInputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 38px;

  padding: 0 18px;

  border-radius: 7px;

  background: ${({ $disabled }) =>
    $disabled
      ? "#c5d4cf"
      : "#00a97b"};

  color: #ffffff;

  font-size: 14px;
  font-weight: 800;

  cursor: ${({ $disabled }) =>
    $disabled
      ? "not-allowed"
      : "pointer"};

  transition:
    background 0.18s ease;

  &:hover {
    background: ${({ $disabled }) =>
      $disabled
        ? "#c5d4cf"
        : "#008f69"};
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileCount = styled.p`
  margin: 14px 0 0;

  color: ${({ $isLimitReached }) =>
    $isLimitReached
      ? "#00a97b"
      : "#666666"};

  font-size: 13px;
  font-weight: ${({ $isLimitReached }) =>
    $isLimitReached
      ? 700
      : 500};
`;

const PreviewList = styled.div`
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

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

  border-radius: 8px;

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