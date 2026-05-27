export default function PetStoreProductImageSection({
  setMainImage,
  setSubImages,
}) {
  return (
    <section>
      <h3>2. 이미지</h3>

      <label>
        대표 이미지
        <input
          type="file"
          onChange={(evt) => setMainImage(evt.target.files[0])}
        />
      </label>

      <label>
        추가 이미지
        <input
          type="file"
          multiple
          onChange={(evt) => setSubImages(Array.from(evt.target.files))}
        />
      </label>
    </section>
  );
}
