package com.kh.app.store.service;

import com.kh.app.common.entity.DelYn;
import com.kh.app.delivery.entity.DeliveryAddressEntity;
import com.kh.app.delivery.repository.DeliveryAddressRepository;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.point.service.PointService;
import com.kh.app.store.dto.request.StoreCartInsertReqDto;
import com.kh.app.store.dto.request.StoreCartQtyUpdateReqDto;
import com.kh.app.store.dto.request.StorePayReadyReqDto;
import com.kh.app.store.dto.response.*;
import com.kh.app.store.entity.*;
import com.kh.app.store.repository.*;
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
    private final DeliveryAddressRepository deliveryAddressRepository;

    private final StoreOrderRepository storeOrderRepository;
    private final StoreOrderItemRepository storeOrderItemRepository;
    private final StorePaymentRepository storePaymentRepository;
    private final StoreKakaoPayService storeKakaoPayService;

    //포인트 관련
    private final PointService pointService;

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


    //카카오 결제
    @Transactional
    public StorePayReadyResDto payReady(StorePayReadyReqDto reqDto, String username) {

        if (isNotLogin(username)) {
            throw new IllegalStateException("로그인 후 결제를 진행할 수 있습니다.");
        }

        MemberEntity member = getLoginMember(username);

        //배송지 검증
        if (reqDto.getDeliveryAddressId() == null) {
            throw new IllegalArgumentException("배송지를 선택해주세요.");
        }

        DeliveryAddressEntity deliveryAddress =
                deliveryAddressRepository.findByIdAndMember(
                        reqDto.getDeliveryAddressId(),
                        member
                ).orElseThrow(() ->
                        new IllegalStateException("배송지 정보가 존재하지 않습니다.")
                );

        List<StoreCartItemEntity> cartItems =
                storeCartItemRepository.findByMemberOrderByCartItemIdDesc(member);

        if (cartItems.isEmpty()) {
            throw new IllegalStateException("장바구니가 비어 있습니다.");
        }

        Long totalProductAmount = cartItems.stream()
                .mapToLong(cartItem ->
                        cartItem.getProduct().getProductPrice() * cartItem.getCartItemQty()
                )
                .sum();

        Long deliveryFee = calculateDeliveryFee(totalProductAmount);

        //포인트 차감 전 결제 대상 금액
        Long paymentTargetAmount = totalProductAmount + deliveryFee;

        //사용 포인트 검증
        Long usedPoint = validateUsedPoint(
                reqDto.getUsedPoint(),
                member,
                paymentTargetAmount
        );

        //최종 결제금액
        Long finalAmount = paymentTargetAmount - usedPoint;

        String deliveryRequest = reqDto.getDeliveryRequest();

        StoreOrderEntity order = StoreOrderEntity.builder()
                .member(member)
                .orderDeliveryFee(deliveryFee)
                .orderUsedPoint(usedPoint)
                .orderFinalAmount(finalAmount)
                .deliveryAddressId(deliveryAddress.getId())
                .orderReceiverName(deliveryAddress.getReceiverName())
                .orderReceiverPhone(deliveryAddress.getPhone())
                .orderZipCode(deliveryAddress.getZipCode())
                .orderAddress(deliveryAddress.getAddress())
                .orderAddressDetail(deliveryAddress.getAddressDetail())
                .orderDeliveryRequest(
                        deliveryRequest == null || deliveryRequest.isBlank()
                                ? null
                                : deliveryRequest
                )
                .build();

        storeOrderRepository.save(order);

        for (StoreCartItemEntity cartItem : cartItems) {
            StoreOrderItemEntity orderItem = StoreOrderItemEntity.from(
                    order,
                    cartItem.getProduct(),
                    cartItem.getCartItemQty()
            );

            storeOrderItemRepository.save(orderItem);
        }

        String partnerOrderId = "STORE_ORDER_" + order.getOrderId();
        String partnerUserId = "MEMBER_" + member.getId();

        String itemName = makeKakaoItemName(cartItems);
        Integer quantity = cartItems.stream()
                .mapToInt(StoreCartItemEntity::getCartItemQty)
                .sum();

        StorePaymentEntity payment = StorePaymentEntity.builder()
                .order(order)
                .member(member)
                .paymentMethod(StorePaymentMethod.KAKAO_PAY)
                .paymentAmount(finalAmount)
                .partnerOrderId(partnerOrderId)
                .partnerUserId(partnerUserId)
                .build();

        storePaymentRepository.save(payment);

        StoreKakaoPayReadyResDto kakaoReadyRes = storeKakaoPayService.ready(
                partnerOrderId,
                partnerUserId,
                itemName,
                quantity,
                finalAmount,
                order.getOrderId()
        );

        if (kakaoReadyRes == null || kakaoReadyRes.getTid() == null) {
            throw new IllegalStateException("카카오페이 결제 준비에 실패했습니다.");
        }

        payment.ready(kakaoReadyRes.getTid());

        return StorePayReadyResDto.builder()
                .orderId(order.getOrderId())
                .partnerOrderId(partnerOrderId)
                .nextRedirectPcUrl(kakaoReadyRes.getNextRedirectPcUrl())
                .build();
    }

    private String makeKakaoItemName(List<StoreCartItemEntity> cartItems) {
        String firstProductName = cartItems.get(0).getProduct().getProductName();

        if (cartItems.size() == 1) {
            return firstProductName;
        }

        return firstProductName + " 외 " + (cartItems.size() - 1) + "건";
    }

    @Transactional
    public void payApprove(Long orderId, String pgToken) {

        StoreOrderEntity order = storeOrderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("주문을 찾을 수 없습니다."));

        StorePaymentEntity payment = storePaymentRepository.findByOrder(order)
                .orElseThrow(() -> new EntityNotFoundException("결제 정보를 찾을 수 없습니다."));

        if (payment.isPaid()) {
            throw new IllegalStateException("이미 결제 완료된 주문입니다.");
        }

        if (order.isCanceled()) {
            throw new IllegalStateException("취소된 주문은 결제할 수 없습니다.");
        }

        StoreKakaoPayApproveResDto approveRes = storeKakaoPayService.approve(
                payment.getPaymentKakaoTid(),
                payment.getPartnerOrderId(),
                payment.getPartnerUserId(),
                pgToken,
                payment.getPaymentAmount()
        );

        if (approveRes == null || approveRes.getTid() == null) {
            payment.fail();
            throw new IllegalStateException("카카오페이 결제 승인에 실패했습니다.");
        }
        order.paid();

        //주문 포인트 사용 처리
        pointService.useOrderPoint(
                order.getMember(),
                order.getOrderUsedPoint(),
                order.getOrderId()
        );



        payment.approve(
                approveRes.getTid(),
                java.time.LocalDateTime.now()
        );

        storeCartItemRepository.deleteByMember(order.getMember());

        log.info("[스토어 결제 완료] orderId={}, paymentId={}, amount={}",
                order.getOrderId(),
                payment.getPaymentId(),
                payment.getPaymentAmount()
        );
    }

    //사용 포인트 검증
    private Long validateUsedPoint(Long requestedPoint, MemberEntity member, Long paymentTargetAmount) {
        Long usedPoint = requestedPoint == null ? 0L : requestedPoint;

        if (usedPoint < 0) {
            throw new IllegalArgumentException("사용 포인트는 0 이상이어야 합니다.");
        }

        if (usedPoint == 0) {
            return 0L;
        }

        if (usedPoint % 100 != 0) {
            throw new IllegalArgumentException("포인트는 100P 단위로만 사용할 수 있습니다.");
        }

        if (usedPoint > member.getPoint()) {
            throw new IllegalStateException("보유 포인트보다 많이 사용할 수 없습니다.");
        }

        if (usedPoint > paymentTargetAmount) {
            throw new IllegalArgumentException("결제금액보다 많은 포인트는 사용할 수 없습니다.");
        }

        return usedPoint;
    }

    @Transactional
    public void cancelOrder(Long orderId, String username) {
        if (isNotLogin(username)) {
            throw new IllegalStateException("로그인 후 주문을 취소할 수 있습니다.");
        }

        MemberEntity member = getLoginMember(username);

        StoreOrderEntity order = storeOrderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("주문을 찾을 수 없습니다."));

        if (!order.getMember().getId().equals(member.getId())) {
            throw new IllegalStateException("본인의 주문만 취소할 수 있습니다.");
        }

        if (!order.isPaid()) {
            throw new IllegalStateException("결제 완료된 주문만 취소할 수 있습니다.");
        }

        if (order.isCanceled()) {
            throw new IllegalStateException("이미 취소된 주문입니다.");
        }

        //배송 상태 기능 붙이기 전까지는 PAID 상태 주문만 취소 가능하게 처리
        order.cancel();

        //사용 포인트 환불
        pointService.refundOrderUsedPoint(
                order.getMember(),
                order.getOrderUsedPoint(),
                order.getOrderId()
        );

        log.info("[스토어 주문 취소] orderId={}, memberId={}, refundPoint={}",
                order.getOrderId(),
                member.getId(),
                order.getOrderUsedPoint()
        );
    }
}