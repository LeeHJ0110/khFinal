import React, { useEffect, useState } from "react";
import styled from "styled-components";

import petModel from "../../features/petInsurance/img/펫모델.png";

import {
  fetchInsuranceProductList,
  calculateInsurancePrice,
} from "../../features/petInsurance/api/petInsuranceApi";

function InsuranceEstimateSection() {
  const [productList, setProductList] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [estimateResult, setEstimateResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // =========================================================
  // 보험 상품 목록 조회
  // =========================================================
  useEffect(() => {
    fetchProductList();
  }, []);

  async function fetchProductList() {
    try {
      setErrorMessage("");

      const response = await fetchInsuranceProductList();

      console.log("보험 상품 목록 응답:", response.data);

      const data = response.data;

      if (!Array.isArray(data)) {
        throw new Error("보험 상품 목록 응답 형식이 올바르지 않습니다.");
      }

      setProductList(data);

      // 상품이 있으면 첫 번째 상품을 기본 선택
      if (data.length > 0) {
        setSelectedProductId(String(data[0].productId));
      }
    } catch (error) {
      console.error("보험 상품 목록 조회 실패:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "보험 상품 목록을 불러오지 못했습니다.",
      );
    }
  }

  // =========================================================
  // 예상 보험료 계산
  // =========================================================
  async function handleCalculate() {
    setErrorMessage("");
    setEstimateResult(null);

    if (!selectedProductId) {
      setErrorMessage("보험 상품을 선택해 주세요.");

      return;
    }

    if (!birthDate) {
      setErrorMessage("반려동물의 생년월일을 입력해 주세요.");

      return;
    }

    try {
      setIsLoading(true);

      const response = await calculateInsurancePrice({
        productId: Number(selectedProductId),
        birthDate,
      });

      setEstimateResult(response.data);
    } catch (error) {
      console.error("예상 보험료 계산 실패:", error);

      setErrorMessage(
        getErrorMessage(error, "예상 보험료 계산에 실패했습니다."),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <EstimateSection>
      <Title>보험료 확인하기</Title>

      <Description>
        우리 아이의 생년월일과 보험 상품을 선택하면 예상 월 보험료를 확인할 수
        있습니다.
      </Description>

      <Divider />

      <InputGroup>
        <Label htmlFor="insurance-product">보험 상품</Label>

        <Select
          id="insurance-product"
          value={selectedProductId}
          onChange={(event) => {
            console.log("선택한 상품 번호:", event.target.value);

            setSelectedProductId(event.target.value);

            setEstimateResult(null);
          }}
          disabled={productList.length === 0}
        >
          <option value="">
            {productList.length === 0
              ? "조회된 보험 상품이 없습니다"
              : "보험 상품을 선택해 주세요"}
          </option>

          {productList.map((product) => (
            <option key={product.productId} value={String(product.productId)}>
              {product.productName}
            </option>
          ))}
        </Select>
      </InputGroup>

      <InputGroup>
        <Label htmlFor="pet-birth-date">반려동물 생년월일</Label>

        <Input
          id="pet-birth-date"
          type="date"
          value={birthDate}
          max={getToday()}
          onChange={(event) => {
            setBirthDate(event.target.value);

            setEstimateResult(null);
          }}
        />
      </InputGroup>

      <CalculateButton
        type="button"
        onClick={handleCalculate}
        disabled={isLoading}
      >
        {isLoading ? "계산 중..." : "예상 보험료 확인하기"}
      </CalculateButton>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

      {estimateResult && (
        <ResultBox>
          <ResultLabel>예상 월 보험료</ResultLabel>

          <ResultPrice>
            {formatPrice(estimateResult.monthlyPrice)}

            <ResultUnit>원</ResultUnit>
          </ResultPrice>

          <ResultDetail>
            {estimateResult.productName}
            {" · "}만 {estimateResult.age}세 기준
          </ResultDetail>
        </ResultBox>
      )}

      <GuideBox>
        <GuideTitle>보험 가입 전 확인 안내</GuideTitle>

        <GuideList>
          <li>입력한 생년월일을 기준으로 만 나이를 계산합니다.</li>

          <li>만 3세부터 한 살마다 월 보험료가 10,000원씩 증가합니다.</li>

          <li>실제 가입 시 심사 결과에 따라 가입이 제한될 수 있습니다.</li>
        </GuideList>
      </GuideBox>

      <PetModelImage src={petModel} alt="펫 보험 안내 캐릭터" />
    </EstimateSection>
  );
}

export default InsuranceEstimateSection;

// =========================================================
// 유틸 함수
// =========================================================

function getErrorMessage(error, defaultMessage) {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    defaultMessage
  );
}

function formatPrice(price) {
  return Number(price).toLocaleString("ko-KR");
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

// =========================================================
// styled-components
// =========================================================

const EstimateSection = styled.section`
  position: relative;

  display: flex;
  flex-direction: column;

  width: 100%;
  min-height: 700px;
  padding: 30px 26px;

  overflow: hidden;

  border: 1px solid #dddddd;
  border-radius: 16px;

  background: #ffffff;

  box-sizing: border-box;
`;

const Title = styled.h2`
  margin: 0;

  font-size: 24px;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: #222222;
`;

const Description = styled.p`
  margin: 14px 0 0;

  font-size: 14px;
  line-height: 1.75;
  color: #777777;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin: 22px 0;

  background: #eeeeee;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;

  margin-bottom: 18px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #444444;
`;

const Select = styled.select`
  width: 100%;
  height: 50px;
  padding: 0 14px;

  border: 1px solid #dddddd;
  border-radius: 9px;

  background: #ffffff;

  font-size: 14px;
  color: #444444;

  outline: none;

  &:focus {
    border-color: #00ad83;
  }

  &:disabled {
    background: #f7f7f7;
    color: #999999;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 50px;
  padding: 0 14px;

  border: 1px solid #dddddd;
  border-radius: 9px;

  font-size: 14px;
  color: #444444;

  outline: none;

  &:focus {
    border-color: #00ad83;
  }
`;

const CalculateButton = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 5px;

  border: none;
  border-radius: 9px;

  background: #00ad83;

  font-size: 15px;
  font-weight: 700;
  color: #ffffff;

  cursor: pointer;

  &:hover {
    background: #009b75;
  }

  &:disabled {
    background: #a7d9cd;
    cursor: default;
  }
`;

const ErrorMessage = styled.p`
  margin: 14px 0 0;

  font-size: 13px;
  line-height: 1.55;
  color: #e74c3c;
`;

const ResultBox = styled.div`
  margin-top: 20px;
  padding: 20px 18px;

  border-radius: 11px;

  background: #effbf8;
`;

const ResultLabel = styled.p`
  margin: 0;

  font-size: 14px;
  font-weight: 700;
  color: #555555;
`;

const ResultPrice = styled.p`
  margin: 8px 0 0;

  font-size: 31px;
  font-weight: 800;
  color: #00ad83;
`;

const ResultUnit = styled.span`
  margin-left: 3px;

  font-size: 18px;
  font-weight: 700;
`;

const ResultDetail = styled.p`
  margin: 8px 0 0;

  font-size: 13px;
  color: #777777;
`;

const GuideBox = styled.div`
  margin-top: auto;

  padding-top: 30px;
  padding-right: 95px;

  position: relative;
  z-index: 2;
`;

const GuideTitle = styled.h3`
  margin: 0;

  font-size: 16px;
  font-weight: 800;
  color: #333333;
`;

const GuideList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 10px;

  margin: 14px 0 0;
  padding-left: 20px;

  font-size: 13px;
  line-height: 1.65;
  color: #666666;
`;

const PetModelImage = styled.img`
  position: absolute;
  right: 18px;
  bottom: 18px;

  z-index: 1;

  width: 92px;
  height: auto;

  object-fit: contain;
`;
