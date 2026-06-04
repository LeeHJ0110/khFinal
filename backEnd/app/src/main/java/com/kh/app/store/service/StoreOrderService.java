package com.kh.app.store.service;

import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.store.dto.request.StoreCartInsertReqDto;
import com.kh.app.store.dto.request.StoreCartQtyUpdateReqDto;
import com.kh.app.store.dto.response.StoreCartItemResDto;
import com.kh.app.store.dto.response.StoreCartListResDto;
import com.kh.app.store.entity.StoreCartItemEntity;
import com.kh.app.store.entity.StoreProductEntity;
import com.kh.app.store.entity.StoreProductImageEntity;
import com.kh.app.store.repository.StoreCartItemRepository;
import com.kh.app.store.repository.StoreProductImageRepository;
import com.kh.app.store.repository.StoreProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

//방어로직 필요
//if (cartItemQty > 99) {
//    throw new IllegalArgumentException("장바구니 수량은 최대 99개까지 가능합니다.");
//}

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StoreOrderService {

    private static final Long FREE_DELIVERY_MIN_AMOUNT = 30000L;
    private static final Long BASIC_DELIVERY_FEE = 3000L;

    private final StoreCartItemRepository storeCartItemRepository;
    private final StoreProductRepository storeProductRepository;
    private final MemberRepository memberRepository;
    private final StoreProductImageRepository storeProductImageRepository;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Transactional
    public void cartInsert(StoreCartInsertReqDto reqDto, String username) {

        // 1. 로그인 여부 확인
        if (isNotLogin(username)) {
            throw new IllegalStateException("로그인 후 장바구니를 이용할 수 있습니다.");
        }

        // 2. 로그인 회원 조회
        MemberEntity member = getLoginMember(username);

        // 3. 요청값 검증
        if (reqDto.getProductId() == null) {
            throw new IllegalArgumentException("상품 ID는 필수입니다.");
        }

        // 4. 상품 조회
        StoreProductEntity product = storeProductRepository.findById(reqDto.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 상품입니다."));

        // 5. 판매중 여부 확인
        if (!product.isOnSale()) {
            throw new IllegalStateException("판매중지된 상품은 장바구니에 담을 수 없습니다.");
        }

        // 6. 수량 기본값 처리
        Integer qty = reqDto.getQty();

        if (qty == null || qty < 1) {
            qty = 1;
        }

        // 7. 기존 장바구니 항목 조회
        StoreCartItemEntity cartItem = storeCartItemRepository
                .findByMemberAndProduct(member, product)
                .orElse(null);

        // 8. 이미 담긴 상품이면 수량 증가
        if (cartItem != null) {
            cartItem.increaseQty(qty);

            log.info("[장바구니 수량 증가] memberId={}, username={}, productId={}, qty={}",
                    member.getId(),
                    member.getUsername(),
                    product.getProductId(),
                    qty
            );

            return;
        }

        // 9. 없으면 새 장바구니 항목 저장
        StoreCartItemEntity newCartItem = StoreCartItemEntity.builder()
                .member(member)
                .product(product)
                .cartItemQty(qty)
                .build();

        storeCartItemRepository.save(newCartItem);

        log.info("[장바구니 신규 등록] memberId={}, username={}, productId={}, qty={}",
                member.getId(),
                member.getUsername(),
                product.getProductId(),
                qty
        );
    }

    public StoreCartListResDto getCartList(String username) {

        // 1. 로그인 여부 확인
        if (isNotLogin(username)) {
            throw new IllegalStateException("로그인 후 장바구니를 이용할 수 있습니다.");
        }

        // 2. 로그인 회원 조회
        MemberEntity member = getLoginMember(username);

        // 3. 회원의 장바구니 목록 조회
        List<StoreCartItemEntity> cartItemEntityList =
                storeCartItemRepository.findByMemberOrderByCartItemIdDesc(member);

        // 4. 장바구니 상품 한 줄 DTO 목록으로 변환
        List<StoreCartItemResDto> cartItemList = cartItemEntityList.stream()
                .map(cartItem -> {
                    String mainImageUrl = getMainImageUrlByProductId(
                            cartItem.getProduct().getProductId()
                    );

                    return StoreCartItemResDto.from(cartItem, mainImageUrl);
                })
                .toList();

        // 5. 총 상품금액 계산
        Long totalProductAmount = cartItemList.stream()
                .mapToLong(StoreCartItemResDto::getCartItemTotalPrice)
                .sum();

        // 6. 배송비 계산
        Long orderDeliveryFee = calculateDeliveryFee(totalProductAmount);

        // 7. 최종 주문금액 계산
        Long finalOrderAmount = totalProductAmount + orderDeliveryFee;

        // 8. 장바구니 전체 응답 DTO 생성
        return StoreCartListResDto.builder()
                .cartItemList(cartItemList)
                .totalProductAmount(totalProductAmount)
                .orderDeliveryFee(orderDeliveryFee)
                .finalOrderAmount(finalOrderAmount)
                .cartItemCount(cartItemList.size())
                .build();
    }

    private MemberEntity getLoginMember(String username) {
        return memberRepository
                .findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("로그인 회원을 찾을 수 없습니다."));
    }

    private boolean isNotLogin(String username) {
        return username == null || username.isBlank() || "anonymousUser".equals(username);
    }

    private String getMainImageUrlByProductId(Long productId) {
        StoreProductImageEntity mainImage =
                storeProductImageRepository
                        .findFirstByProduct_ProductIdAndImageRepresentYnOrderBySortOrderAsc(
                                productId,
                                "Y"
                        )
                        .orElse(null);

        if (mainImage == null) {
            return null;
        }

        return makeS3Url(mainImage.getImageChangedName());
    }

    private String makeS3Url(String changedName) {
        if (changedName == null || changedName.isBlank()) {
            return null;
        }

        if (changedName.startsWith("http://") || changedName.startsWith("https://")) {
            return changedName;
        }

        String keyPath = changedName.startsWith("store/product/")
                ? changedName
                : "store/product/" + changedName;

        return "https://" + bucketName + ".s3.ap-northeast-2.amazonaws.com/" + keyPath;
    }

    private Long calculateDeliveryFee(Long totalProductAmount) {
        if (totalProductAmount == null || totalProductAmount <= 0) {
            return 0L;
        }

        if (totalProductAmount >= FREE_DELIVERY_MIN_AMOUNT) {
            return 0L;
        }

        return BASIC_DELIVERY_FEE;
    }

    @Transactional
    public void cartDelete(Long cartItemId, String username) {

        // 1. 로그인 여부 확인
        if (isNotLogin(username)) {
            throw new IllegalStateException("로그인 후 장바구니를 이용할 수 있습니다.");
        }

        // 2. 로그인 회원 조회
        MemberEntity member = getLoginMember(username);

        // 3. 장바구니 항목 조회
        StoreCartItemEntity cartItem = storeCartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("장바구니 상품을 찾을 수 없습니다."));

        // 4. 현재 로그인한 회원의 장바구니 상품인지 확인
        if (!cartItem.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("본인의 장바구니 상품만 삭제할 수 있습니다.");
        }

        // 5. 삭제
        storeCartItemRepository.delete(cartItem);

        log.info("[장바구니 상품 삭제] memberId={}, username={}, cartItemId={}, productId={}",
                member.getId(),
                member.getUsername(),
                cartItem.getCartItemId(),
                cartItem.getProduct().getProductId()
        );
    }

    @Transactional
    public void cartQtyUpdate(Long cartItemId, StoreCartQtyUpdateReqDto reqDto, String username) {

        // 1. 로그인 여부 확인
        if (isNotLogin(username)) {
            throw new IllegalStateException("로그인 후 장바구니를 이용할 수 있습니다.");
        }

        // 2. 로그인 회원 조회
        MemberEntity member = getLoginMember(username);

        // 3. 요청값 검증
        if (reqDto.getQty() == null || reqDto.getQty() < 1) {
            throw new IllegalArgumentException("수량은 1개 이상이어야 합니다.");
        }

        // 4. 장바구니 항목 조회
        StoreCartItemEntity cartItem = storeCartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("장바구니 상품을 찾을 수 없습니다."));

        // 5. 본인 장바구니 상품인지 확인
        if (!cartItem.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("본인의 장바구니 상품만 수정할 수 있습니다.");
        }

        // 6. 수량 변경
        cartItem.updateQty(reqDto.getQty());

        log.info("[장바구니 수량 변경] memberId={}, username={}, cartItemId={}, productId={}, qty={}",
                member.getId(),
                member.getUsername(),
                cartItem.getCartItemId(),
                cartItem.getProduct().getProductId(),
                reqDto.getQty()
        );
    }
}