export default function PetStoreProductFeedingGuideSection({
  feedingGuideList,
  handleFeedingGuideChange,
  addFeedingGuide,
  removeFeedingGuide,
}) {
  return (
    <section>
      <h3>4. 급여기준</h3>

      {feedingGuideList.map((guide, index) => (
        <div key={index}>
          <input
            name="feedingMinWeight"
            value={guide.feedingMinWeight}
            onChange={(evt) => handleFeedingGuideChange(index, evt)}
            placeholder="최소 무게"
          />

          <input
            name="feedingMaxWeight"
            value={guide.feedingMaxWeight}
            onChange={(evt) => handleFeedingGuideChange(index, evt)}
            placeholder="최대 무게"
          />

          <input
            name="feedingDailyAmount"
            value={guide.feedingDailyAmount}
            onChange={(evt) => handleFeedingGuideChange(index, evt)}
            placeholder="급여량"
          />

          <select
            name="feedingUnit"
            value={guide.feedingUnit}
            onChange={(evt) => handleFeedingGuideChange(index, evt)}
          >
            <option value="g">g</option>
            <option value="회/일">회/일</option>
            <option value="개">개</option>
          </select>

          <input
            name="feedingNote"
            value={guide.feedingNote}
            onChange={(evt) => handleFeedingGuideChange(index, evt)}
            placeholder="비고"
          />

          <button type="button" onClick={() => removeFeedingGuide(index)}>
            삭제
          </button>
        </div>
      ))}

      <button type="button" onClick={addFeedingGuide}>
        + 구간 추가
      </button>
    </section>
  );
}
