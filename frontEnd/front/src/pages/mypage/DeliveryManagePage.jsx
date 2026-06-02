import { useState } from "react";
import styled from "styled-components";
import MyPageLayout from "./components/MyPageLayout";
import useDeliveryAddress from "../../features/mypage/delivery/hooks/useDeliveryAddress";
import AddressSearchModal from "../../shared/components/AddressSearchModal";

const emptyForm = {
  name: "",
  receiverName: "",
  phone: "",
  zipCode: "",
  address: "",
  addressDetail: "",
};

function formatPhoneNumber(value) {
  const numbers = value.replace(/[^0-9]/g, "");

  if (numbers.length <= 3) {
    return numbers;
  }

  if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  }

  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
    7,
    11,
  )}`;
}

function getOnlyPhoneNumber(value) {
  return value.replace(/[^0-9]/g, "");
}

export default function DeliveryManagePage() {
  const {
    deliveryList,
    loading,
    handleCreateDelivery,
    handleUpdateDelivery,
    handleDeleteDelivery,
    handleChangeDefault,
  } = useDeliveryAddress();

  const [openedId, setOpenedId] = useState(null);
  const [isCreateMode, setCreateMode] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);

  function handleChange(evt) {
    const { name, value } = evt.target;

    let nextValue = value;

    if (name === "phone") {
      const numbers = getOnlyPhoneNumber(value);

      if (numbers.length > 11) {
        return;
      }

      nextValue = formatPhoneNumber(numbers);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  }

  function handleOpenDelivery(delivery) {
    setCreateMode(false);
    setOpenedId(delivery.deliveryAddressId);

    setFormData({
      name: delivery.name || "",
      receiverName: delivery.receiverName || "",
      phone: formatPhoneNumber(delivery.phone || ""),
      zipCode: delivery.zipCode || "",
      address: delivery.address || "",
      addressDetail: delivery.addressDetail || "",
    });
  }

  function handleOpenCreate() {
    setCreateMode(true);
    setOpenedId(null);
    setFormData(emptyForm);
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    if (!formData.name.trim()) {
      alert("배송지명을 입력하세요.");
      return;
    }

    if (!formData.receiverName.trim()) {
      alert("수령인을 입력하세요.");
      return;
    }

    if (!formData.phone.trim()) {
      alert("전화번호를 입력하세요.");
      return;
    }

    const phoneOnlyNumber = getOnlyPhoneNumber(formData.phone);

    if (!/^010\d{8}$/.test(phoneOnlyNumber)) {
      alert("전화번호는 010으로 시작하는 11자리 숫자여야 합니다.");
      return;
    }

    if (!formData.address.trim()) {
      alert("주소를 입력하세요.");
      return;
    }

    const requestData = {
      ...formData,
      phone: phoneOnlyNumber,
    };

    if (isCreateMode) {
      const result = await handleCreateDelivery(requestData);

      if (result) {
        alert("배송지가 추가되었습니다.");
        setCreateMode(false);
        setFormData(emptyForm);
      }

      return;
    }

    const result = await handleUpdateDelivery(openedId, requestData);

    if (result) {
      alert("배송지가 수정되었습니다.");
    }
  }

  async function handleDelete(deliveryAddressId) {
    const result = confirm("배송지를 삭제하시겠습니까?");

    if (!result) {
      return;
    }

    const success = await handleDeleteDelivery(deliveryAddressId);

    if (success) {
      alert("배송지가 삭제되었습니다.");
      setOpenedId(null);
      setFormData(emptyForm);
    }
  }

  async function handleDefault(deliveryAddressId) {
    const success = await handleChangeDefault(deliveryAddressId);

    if (success) {
      alert("대표 배송지로 변경되었습니다.");
    }
  }
  return (
    <MyPageLayout>
      <Header>
        <Title>배송지 관리</Title>

        <AddButton type="button" onClick={handleOpenCreate}>
          + 배송지 추가
        </AddButton>
      </Header>

      <DeliveryBox>
        {loading ? (
          <EmptyBox>배송지를 불러오는 중입니다...</EmptyBox>
        ) : deliveryList.length === 0 && !isCreateMode ? (
          <EmptyBox>
            등록된 배송지가 없습니다.
            <br />
            배송지를 추가해주세요.
          </EmptyBox>
        ) : (
          <>
            {deliveryList.map((delivery) => (
              <DeliveryItem key={delivery.deliveryAddressId}>
                <DeliveryHeader
                  type="button"
                  onClick={() => handleOpenDelivery(delivery)}
                >
                  <Arrow>
                    {openedId === delivery.deliveryAddressId ? "▼" : "▶"}
                  </Arrow>

                  <DeliveryName>{delivery.name}</DeliveryName>

                  {delivery.defaultYn === "Y" && (
                    <DefaultBadge>대표</DefaultBadge>
                  )}

                  <AddressPreview>
                    {delivery.address} {delivery.addressDetail}
                  </AddressPreview>
                </DeliveryHeader>

                {openedId === delivery.deliveryAddressId && !isCreateMode && (
                  <FormCard onSubmit={handleSubmit}>
                    <FormRow>
                      <Label>배송지명</Label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </FormRow>

                    <FormRow>
                      <Label>수령인</Label>
                      <Input
                        name="receiverName"
                        value={formData.receiverName}
                        onChange={handleChange}
                      />
                    </FormRow>

                    <FormRow>
                      <Label>전화번호</Label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </FormRow>

                    <FormRow>
                      <Label>우편번호</Label>
                      <InputGroup>
                        <Input
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          readOnly
                        />
                        <SmallButton
                          type="button"
                          onClick={() => setAddressModalOpen(true)}
                        >
                          주소검색
                        </SmallButton>
                      </InputGroup>
                    </FormRow>

                    <FormRow>
                      <Label>주소</Label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        readOnly
                      />
                    </FormRow>

                    <FormRow>
                      <Label>상세주소</Label>
                      <Input
                        name="addressDetail"
                        value={formData.addressDetail}
                        onChange={handleChange}
                      />
                    </FormRow>

                    <ButtonRow>
                      {delivery.defaultYn !== "Y" && (
                        <SubButton
                          type="button"
                          onClick={() =>
                            handleDefault(delivery.deliveryAddressId)
                          }
                        >
                          대표지정
                        </SubButton>
                      )}

                      <SubButton
                        type="button"
                        onClick={() => handleDelete(delivery.deliveryAddressId)}
                      >
                        삭제
                      </SubButton>

                      <SubmitButton type="submit">수정</SubmitButton>
                    </ButtonRow>
                  </FormCard>
                )}
              </DeliveryItem>
            ))}

            {isCreateMode && (
              <CreateCard onSubmit={handleSubmit}>
                <SectionTitle>배송지 추가</SectionTitle>

                <FormRow>
                  <Label>배송지명</Label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="예: 집, 회사"
                  />
                </FormRow>

                <FormRow>
                  <Label>수령인</Label>
                  <Input
                    name="receiverName"
                    value={formData.receiverName}
                    onChange={handleChange}
                  />
                </FormRow>

                <FormRow>
                  <Label>전화번호</Label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </FormRow>

                <FormRow>
                  <Label>우편번호</Label>
                  <InputGroup>
                    <Input
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      readOnly
                    />
                    <SmallButton
                      type="button"
                      onClick={() => setAddressModalOpen(true)}
                    >
                      주소검색
                    </SmallButton>
                  </InputGroup>
                </FormRow>

                <FormRow>
                  <Label>주소</Label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    readOnly
                  />
                </FormRow>

                <FormRow>
                  <Label>상세주소</Label>
                  <Input
                    name="addressDetail"
                    value={formData.addressDetail}
                    onChange={handleChange}
                  />
                </FormRow>

                <ButtonRow>
                  <SubButton
                    type="button"
                    onClick={() => {
                      setCreateMode(false);
                      setFormData(emptyForm);
                    }}
                  >
                    취소
                  </SubButton>

                  <SubmitButton type="submit">추가</SubmitButton>
                </ButtonRow>
              </CreateCard>
            )}
          </>
        )}
      </DeliveryBox>
      {isAddressModalOpen && (
        <AddressSearchModal
          onClose={() => setAddressModalOpen(false)}
          onComplete={({ address, zipCode }) => {
            setFormData((prev) => ({
              ...prev,
              address,
              zipCode,
            }));
          }}
        />
      )}
    </MyPageLayout>
  );
}

const Header = styled.div`
  width: 100%;
  max-width: 900px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #00a982;
`;

const AddButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 11px 24px;
  background: #00b894;
  color: white;
  font-weight: 800;
  cursor: pointer;
`;

const DeliveryBox = styled.section`
  width: 100%;
  max-width: 900px;
  background: #e9fbf4;
  border-radius: 14px;
  padding: 24px;
  min-height: 420px;
`;

const DeliveryItem = styled.div`
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
`;

const DeliveryHeader = styled.button`
  width: 100%;
  min-height: 62px;
  border: none;
  background: white;
  padding: 0 20px;

  display: flex;
  align-items: center;
  gap: 14px;

  cursor: pointer;
  text-align: left;
`;

const Arrow = styled.span`
  width: 18px;
  color: #555;
  font-size: 14px;
`;

const DeliveryName = styled.strong`
  font-size: 16px;
  color: #222;
`;

const DefaultBadge = styled.span`
  border-radius: 999px;
  padding: 4px 10px;
  background: #d9f6ec;
  color: #00a982;
  font-size: 12px;
  font-weight: 800;
`;

const AddressPreview = styled.span`
  flex: 1;
  color: #777;
  font-size: 14px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FormCard = styled.form`
  padding: 24px 34px 28px;
  border-top: 1px solid #eee;
  background: #fbfffd;
`;

const CreateCard = styled.form`
  margin-top: 12px;
  background: white;
  border-radius: 12px;
  padding: 28px 34px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  color: #00a982;
  margin-bottom: 20px;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const Label = styled.label`
  width: 100px;
  font-size: 14px;
  font-weight: 700;
  color: #333;
`;

const InputGroup = styled.div`
  flex: 1;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  height: 38px;
  border: none;
  border-radius: 999px;
  background: #d9f2e7;
  padding: 0 18px;
  font-size: 14px;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px #00b894;
  }
`;

const SmallButton = styled.button`
  min-width: 90px;
  height: 38px;
  border: none;
  border-radius: 999px;
  background: #00b894;
  color: white;
  font-weight: 700;
  cursor: pointer;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 26px;
`;

const SubButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 10px 24px;
  background: #f1f1f1;
  color: #555;
  font-weight: 700;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 10px 30px;
  background: #00b894;
  color: white;
  font-weight: 800;
  cursor: pointer;
`;

const EmptyBox = styled.div`
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #777;
  font-weight: 700;
  line-height: 1.8;
`;
