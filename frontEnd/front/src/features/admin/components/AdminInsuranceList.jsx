import styled from "styled-components";
import { Fragment } from "react";
export default function AdminInsuranceList({
  status,
  applications,
  selectedIds,
  openId,
  details,

  onToggleSelect,
  onToggleOpen,
}) {
  if (!applications || applications.length === 0) {
    return <EmptyBox>조회된 보험 신청이 없습니다.</EmptyBox>;
  }

  return (
    <Table>
      <thead>
        <tr>
          {status === "WAITING" && <th></th>}

          <th>신청번호</th>
          <th>신청자</th>
          <th>반려동물</th>
          <th>보험상품</th>
          <th>월보험료</th>
          <th>상태</th>
          <th>신청일</th>
        </tr>
      </thead>

      <tbody>
        {applications.map((application) => (
          <Fragment key={application.applicationId}>
            <tr>
              {status === "WAITING" && (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(application.applicationId)}
                    onChange={() => onToggleSelect(application.applicationId)}
                    onClick={(evt) => evt.stopPropagation()}
                  />
                </td>
              )}

              <td onClick={() => onToggleOpen(application.applicationId)}>
                {application.applicationId}
              </td>

              <td onClick={() => onToggleOpen(application.applicationId)}>
                {application.memberNickname}
              </td>

              <td onClick={() => onToggleOpen(application.applicationId)}>
                {application.petName}
              </td>

              <td onClick={() => onToggleOpen(application.applicationId)}>
                {application.productName}
              </td>

              <td onClick={() => onToggleOpen(application.applicationId)}>
                {formatPrice(application.monthlyPrice)}원
              </td>

              <td onClick={() => onToggleOpen(application.applicationId)}>
                {getStatusText(application.approveStatus)}
              </td>

              <td onClick={() => onToggleOpen(application.applicationId)}>
                {formatDate(application.createdAt)}
              </td>
            </tr>

            {openId === application.applicationId && (
              <tr>
                <DetailTd colSpan={8}>
                  <InsuranceDetail
                    detail={details[application.applicationId]}
                  />
                </DetailTd>
              </tr>
            )}
          </Fragment>
        ))}
      </tbody>
    </Table>
  );
}

function InsuranceDetail({ detail }) {
  if (!detail) {
    return <DetailBox>상세 정보를 불러오는 중입니다...</DetailBox>;
  }

  return (
    <DetailBox>
      <SectionTitle>신청자 정보</SectionTitle>

      <InfoRow>닉네임 : {detail.memberNickname}</InfoRow>

      <InfoRow>이메일 : {detail.memberEmail}</InfoRow>

      <InfoRow>연락처 : {detail.memberPhone}</InfoRow>

      <SectionTitle>반려동물 정보</SectionTitle>

      <InfoRow>이름 : {detail.petName}</InfoRow>

      <InfoRow>품종 : {detail.breedName}</InfoRow>

      <InfoRow>성별 : {detail.petGender}</InfoRow>

      <InfoRow>생년월일 : {detail.petBirthDate}</InfoRow>

      <InfoRow>몸무게 : {detail.petWeight}kg</InfoRow>

      <SectionTitle>보험상품 정보</SectionTitle>

      <InfoRow>상품명 : {detail.productName}</InfoRow>

      <InfoRow>설명 : {detail.productContent}</InfoRow>

      <PriceBox>
        월 보험료 :<Price>{formatPrice(detail.monthlyPrice)}원</Price>
      </PriceBox>

      <SectionTitle>건강진단서</SectionTitle>

      {detail.imageUrl ? (
        <CertificateImage src={detail.imageUrl} alt="건강진단서" />
      ) : (
        <EmptyImage>등록된 건강진단서가 없습니다.</EmptyImage>
      )}
    </DetailBox>
  );
}

function getStatusText(status) {
  switch (status) {
    case "WAITING":
      return "승인대기";

    case "APPROVED":
      return "승인완료";

    case "REJECTED":
      return "반려";

    default:
      return status;
  }
}

function formatPrice(value) {
  if (!value) return "0";
  return value.toLocaleString();
}

function formatDate(value) {
  if (!value) return "-";

  return value.replace("T", " ").substring(0, 16);
}

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;

  th,
  td {
    padding: 14px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    text-align: left;
  }

  th {
    background-color: #f8f8f8;
  }

  tbody tr:hover {
    background-color: #fafafa;
  }
`;

const DetailTd = styled.td`
  background-color: #fafafa;
`;

const DetailBox = styled.div`
  padding: 24px;
  border-radius: 16px;
  background-color: white;
  border: 1px solid #eee;
`;

const SectionTitle = styled.h3`
  margin-top: 24px;
  margin-bottom: 12px;

  &:first-child {
    margin-top: 0;
  }
`;

const InfoRow = styled.div`
  margin-bottom: 8px;
`;

const PriceBox = styled.div`
  margin-top: 24px;
`;

const Price = styled.span`
  margin-left: 8px;
  font-size: 18px;
  font-weight: 700;
`;

const CertificateImage = styled.img`
  width: 100%;
  max-width: 700px;

  border-radius: 12px;
  border: 1px solid #ddd;

  object-fit: contain;
`;

const EmptyImage = styled.div`
  padding: 60px;
  border: 1px dashed #ccc;
  border-radius: 12px;
  text-align: center;
  color: #777;
`;

const EmptyBox = styled.div`
  padding: 80px;
  text-align: center;
  background-color: white;
  border: 1px solid #eee;
`;
