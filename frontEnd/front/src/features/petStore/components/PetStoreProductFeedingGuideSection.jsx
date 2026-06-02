export default function PetStoreProductFeedingGuideSection({
  feedingGuideList,
  feedingUnit,
  handleFeedingUnitChange,
  handleFeedingGuideChange,
}) {
  return (
    <section className="product-form-section">
      <div className="section-title-row">
        <h3>4. 급여기준</h3>

        <label className="unit-select-box">
          <span>공통 단위</span>
          <select value={feedingUnit} onChange={handleFeedingUnitChange}>
            <option value="g">g</option>
            <option value="회">회</option>
            <option value="개">개</option>
            <option value="ml">ml</option>
          </select>
        </label>
      </div>

      <div className="feeding-guide-help">
        첫 번째 기준 체중과 두 번째 기준 체중만 입력하면 구간이 자동으로
        연결됩니다.
      </div>

      <div className="feeding-guide-list">
        <div className="feeding-guide-row">
          <div className="feeding-range-label">
            <strong>1</strong>
            <span>최소값 방어</span>
            <em>~{feedingGuideList[0]?.feedingMaxWeight || "n1"}kg 미만</em>
          </div>

          <label>
            기준 체중
            <input
              name="feedingMaxWeight"
              value={feedingGuideList[0]?.feedingMaxWeight}
              onChange={(evt) => handleFeedingGuideChange(0, evt)}
              placeholder="n1"
            />
          </label>

          <label>
            1일 급여량
            <input
              name="feedingDailyAmount"
              value={feedingGuideList[0]?.feedingDailyAmount}
              onChange={(evt) => handleFeedingGuideChange(0, evt)}
              placeholder="예: 20"
            />
          </label>
        </div>

        <div className="feeding-guide-row">
          <div className="feeding-range-label">
            <strong>2</strong>
            <span>중간 구간</span>
            <em>
              {feedingGuideList[0]?.feedingMaxWeight || "n1"}kg 이상 ~{" "}
              {feedingGuideList[1]?.feedingMaxWeight || "n2"}kg 미만
            </em>
          </div>

          <label>
            기준 체중
            <input
              name="feedingMaxWeight"
              value={feedingGuideList[1]?.feedingMaxWeight}
              onChange={(evt) => handleFeedingGuideChange(1, evt)}
              placeholder="n2"
            />
          </label>

          <label>
            1일 급여량
            <input
              name="feedingDailyAmount"
              value={feedingGuideList[1]?.feedingDailyAmount}
              onChange={(evt) => handleFeedingGuideChange(1, evt)}
              placeholder="예: 30"
            />
          </label>
        </div>

        <div className="feeding-guide-row">
          <div className="feeding-range-label">
            <strong>3</strong>
            <span>최대값 방어</span>
            <em>{feedingGuideList[1]?.feedingMaxWeight || "n2"}kg 이상</em>
          </div>

          <label>
            기준 체중
            <input value="자동" disabled />
          </label>

          <label>
            1일 급여량
            <input
              name="feedingDailyAmount"
              value={feedingGuideList[2]?.feedingDailyAmount}
              onChange={(evt) => handleFeedingGuideChange(2, evt)}
              placeholder="예: 40"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
