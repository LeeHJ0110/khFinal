import styled from "styled-components";
import DaumPostcode from "react-daum-postcode";

export default function AddressSearchModal({ onComplete, onClose }) {
  function handleComplete(data) {
    const address =
      data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;

    onComplete({
      address,
      zipCode: data.zonecode,
    });

    onClose();
  }

  return (
    <Overlay>
      <ModalBox>
        <Header>
          <Title>주소 검색</Title>

          <CloseButton type="button" onClick={onClose}>
            ×
          </CloseButton>
        </Header>

        <PostcodeBox>
          <DaumPostcode onComplete={handleComplete} />
        </PostcodeBox>
      </ModalBox>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.45);

  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  width: 520px;
  background: white;
  border-radius: 14px;
  overflow: hidden;
`;

const Header = styled.div`
  height: 56px;
  padding: 0 20px;
  background: #00b894;
  color: white;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 800;
`;

const CloseButton = styled.button`
  border: none;
  background: none;
  color: white;
  font-size: 30px;
  cursor: pointer;
`;

const PostcodeBox = styled.div`
  height: 460px;
`;
