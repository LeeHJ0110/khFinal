package com.kh.app.store.service;

import com.kh.app.common.entity.DelYn;
import com.kh.app.delivery.entity.DeliveryAddressEntity;
import com.kh.app.delivery.repository.DeliveryAddressRepository;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.message.entity.MessageReasonType;
import com.kh.app.message.service.SystemMessageService;
import com.kh.app.point.service.PointService;
import com.kh.app.store.dto.request.StoreCartInsertReqDto;
import com.kh.app.store.dto.request.StoreCartQtyUpdateReqDto;
import com.kh.app.store.dto.request.StoreDirectPayReadyReqDto;
import com.kh.app.store.dto.request.StorePayReadyReqDto;
import com.kh.app.store.dto.response.*;
import com.kh.app.store.entity.*;
import com.kh.app.store.exception.StoreErrorCode;
import com.kh.app.store.exception.StoreException;
import com.kh.app.store.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StoreOrderService {


    private static final Long FREE_DELIVERY_MIN_AMOUNT = 30000L;
    private static final Long BASIC_DELIVERY_FEE = 3000L;
    private static final String STORE_SYSTEM_ADMIN_USERNAME = "store01";

    private final StoreCartItemRepository storeCartItemRepository;
    private final StoreProductRepository storeProductRepository;
    private final StoreProductImageRepository storeProductImageRepository;
    private final StoreOrderRepository storeOrderRepository;
    private final StoreOrderItemRepository storeOrderItemRepository;
    private final StorePaymentRepository storePaymentRepository;
    private final StoreOrderDeliveryRepository storeOrderDeliveryRepository;

    private final MemberRepository memberRepository;
    private final DeliveryAddressRepository deliveryAddressRepository;
    private final StoreKakaoPayService storeKakaoPayService;
    private final PointService pointService;
    private final SystemMessageService systemMessageService;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

// =====================================================
// 장바구니
// =====================================================

    @Transactional
    public void cartInsert(StoreCartInsertReqDto reqDto, String username) {
        if (isNotLogin(username)) {
            throw new StoreException(StoreErrorCode.CART_LOGIN_REQUIRED);
        }

        MemberEntity member = getLoginMember(username);

        if (reqDto == null || reqDto.getProductId() == null) {
            throw new StoreException(StoreErrorCode.PRODUCT_ID_REQUIRED);
        }

        StoreProductEntity product = getProductEntity(reqDto.getProductId());

        if (!product.isOnSale()) {
            throw new StoreException(StoreErrorCode.PRODUCT_NOT_ON_SALE);
        }

        // 장바구니 등록 시 수량이 없거나 1보다 작으면 기본값 1로 보정
        Integer qty = reqDto.getQty();

        if (qty == null || qty < 1) {
            qty = 1;
        }

        StoreCartItemEntity cartItem = storeCartItemRepository
                .findByMemberAndProduct(member, product)
                .orElse(null);

        // 이미 담긴 상품이면 새 행을 만들지 않고 기존 수량만 증가
        if (cartItem != null) {
            cartItem.increaseQty(qty);

            log.info(
                    "[장바구니 수량 증가] memberId={}, username={}, productId={}, qty={}",
                    member.getId(),
                    member.getUsername(),
                    product.getProductId(),
                    qty
            );

            return;
        }

        StoreCartItemEntity newCartItem = StoreCartItemEntity.builder()
                .member(member)
                .product(product)
                .cartItemQty(qty)
                .build();

        storeCartItemRepository.save(newCartItem);

        log.info(
                "[장바구니 신규 등록] memberId={}, username={}, productId={}, qty={}",
                member.getId(),
                member.getUsername(),
                product.getProductId(),
                qty
        );
    }

    public StoreCartListResDto getCartList(String username) {
        if (isNotLogin(username)) {
            throw new StoreException(StoreErrorCode.CART_LOGIN_REQUIRED);
        }

        MemberEntity member = getLoginMember(username);

        List<StoreCartItemEntity> cartItemEntityList =
                storeCartItemRepository.findByMemberOrderByCartItemIdDesc(member);

        List<StoreCartItemResDto> cartItemList = cartItemEntityList.stream()
                .map(cartItem -> {
                    String mainImageUrl = getMainImageUrlByProductId(
                            cartItem.getProduct().getProductId()
                    );

                    return StoreCartItemResDto.from(cartItem, mainImageUrl);
                })
                .toList();

        Long totalProductAmount = cartItemList.stream()
                .mapToLong(StoreCartItemResDto::getCartItemTotalPrice)
                .sum();

        Long orderDeliveryFee = calculateDeliveryFee(totalProductAmount);
        Long finalOrderAmount = totalProductAmount + orderDeliveryFee;

        return StoreCartListResDto.builder()
                .cartItemList(cartItemList)
                .totalProductAmount(totalProductAmount)
                .orderDeliveryFee(orderDeliveryFee)
                .finalOrderAmount(finalOrderAmount)
                .cartItemCount(cartItemList.size())
                .build();
    }

    @Transactional
    public void cartDelete(Long cartItemId, String username) {
        if (isNotLogin(username)) {
            throw new StoreException(StoreErrorCode.CART_LOGIN_REQUIRED);
        }

        MemberEntity member = getLoginMember(username);
        StoreCartItemEntity cartItem = getCartItemEntity(cartItemId);

        validateCartItemOwner(cartItem, member);

        storeCartItemRepository.delete(cartItem);

        log.info(
                "[장바구니 상품 삭제] memberId={}, username={}, cartItemId={}, productId={}",
                member.getId(),
                member.getUsername(),
                cartItem.getCartItemId(),
                cartItem.getProduct().getProductId()
        );
    }

    @Transactional
    public void cartQtyUpdate(
            Long cartItemId,
            StoreCartQtyUpdateReqDto reqDto,
            String username
    ) {
        if (isNotLogin(username)) {
            throw new StoreException(StoreErrorCode.CART_LOGIN_REQUIRED);
        }

        MemberEntity member = getLoginMember(username);

        if (reqDto == null || reqDto.getQty() == null || reqDto.getQty() < 1) {
            throw new StoreException(StoreErrorCode.INVALID_CART_QTY);
        }

        StoreCartItemEntity cartItem = getCartItemEntity(cartItemId);

        validateCartItemOwner(cartItem, member);

        cartItem.updateQty(reqDto.getQty());

        log.info(
                "[장바구니 수량 변경] memberId={}, username={}, cartItemId={}, productId={}, qty={}",
                member.getId(),
                member.getUsername(),
                cartItem.getCartItemId(),
                cartItem.getProduct().getProductId(),
                reqDto.getQty()
        );
    }

// =====================================================
// 카카오페이 결제 준비
// =====================================================

    @Transactional
    public StorePayReadyResDto payReady(StorePayReadyReqDto reqDto, String username) {
        if (isNotLogin(username)) {
            throw new StoreException(StoreErrorCode.ORDER_LOGIN_REQUIRED);
        }

        MemberEntity member = getLoginMember(username);
        DeliveryAddressEntity deliveryAddress = getDeliveryAddress(reqDto, member);

        List<StoreCartItemEntity> cartItems =
                storeCartItemRepository.findByMemberOrderByCartItemIdDesc(member);

        if (cartItems.isEmpty()) {
            throw new StoreException(StoreErrorCode.CART_EMPTY);
        }

        Long totalProductAmount = cartItems.stream()
                .mapToLong(cartItem ->
                        cartItem.getProduct().getProductPrice() * cartItem.getCartItemQty()
                )
                .sum();

        Long deliveryFee = calculateDeliveryFee(totalProductAmount);
        Long paymentTargetAmount = totalProductAmount + deliveryFee;

        Long usedPoint = validateUsedPoint(
                reqDto.getUsedPoint(),
                member,
                paymentTargetAmount
        );

        Long finalAmount = paymentTargetAmount - usedPoint;

        StoreOrderEntity order = createOrder(
                member,
                StoreOrderType.CART,
                deliveryAddress,
                reqDto.getDeliveryRequest(),
                deliveryFee,
                usedPoint,
                finalAmount
        );

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

        StorePaymentEntity payment = createPayment(
                order,
                member,
                finalAmount,
                partnerOrderId,
                partnerUserId
        );

        StoreKakaoPayReadyResDto kakaoReadyRes = storeKakaoPayService.ready(
                partnerOrderId,
                partnerUserId,
                itemName,
                quantity,
                finalAmount,
                order.getOrderId()
        );

        if (kakaoReadyRes == null || kakaoReadyRes.getTid() == null) {
            throw new StoreException(StoreErrorCode.KAKAO_PAY_READY_FAIL);
        }

        payment.ready(kakaoReadyRes.getTid());

        return StorePayReadyResDto.builder()
                .orderId(order.getOrderId())
                .partnerOrderId(partnerOrderId)
                .nextRedirectPcUrl(kakaoReadyRes.getNextRedirectPcUrl())
                .build();
    }

    @Transactional
    public StorePayReadyResDto payReadyDirect(
            StoreDirectPayReadyReqDto reqDto,
            String username
    ) {
        if (isNotLogin(username)) {
            throw new StoreException(StoreErrorCode.ORDER_LOGIN_REQUIRED);
        }

        MemberEntity member = getLoginMember(username);

        if (reqDto == null || reqDto.getProductId() == null) {
            throw new StoreException(StoreErrorCode.PRODUCT_ID_REQUIRED);
        }

        Integer qty = reqDto.getQty();

        // 바로구매도 수량이 없거나 1보다 작으면 기본값 1로 보정
        if (qty == null || qty < 1) {
            qty = 1;
        }

        DeliveryAddressEntity deliveryAddress = getDeliveryAddress(reqDto, member);
        StoreProductEntity product = getProductEntity(reqDto.getProductId());

        if (!product.isOnSale()) {
            throw new StoreException(StoreErrorCode.PRODUCT_NOT_ON_SALE);
        }

        Long totalProductAmount = product.getProductPrice() * qty;
        Long deliveryFee = calculateDeliveryFee(totalProductAmount);
        Long paymentTargetAmount = totalProductAmount + deliveryFee;

        Long usedPoint = validateUsedPoint(
                reqDto.getUsedPoint(),
                member,
                paymentTargetAmount
        );

        Long finalAmount = paymentTargetAmount - usedPoint;

        StoreOrderEntity order = createOrder(
                member,
                StoreOrderType.DIRECT,
                deliveryAddress,
                reqDto.getDeliveryRequest(),
                deliveryFee,
                usedPoint,
                finalAmount
        );

        StoreOrderItemEntity orderItem = StoreOrderItemEntity.from(
                order,
                product,
                qty
        );

        storeOrderItemRepository.save(orderItem);

        String partnerOrderId = "STORE_ORDER_" + order.getOrderId();
        String partnerUserId = "MEMBER_" + member.getId();

        StorePaymentEntity payment = createPayment(
                order,
                member,
                finalAmount,
                partnerOrderId,
                partnerUserId
        );

        StoreKakaoPayReadyResDto kakaoReadyRes = storeKakaoPayService.ready(
                partnerOrderId,
                partnerUserId,
                product.getProductName(),
                qty,
                finalAmount,
                order.getOrderId()
        );

        if (kakaoReadyRes == null || kakaoReadyRes.getTid() == null) {
            throw new StoreException(StoreErrorCode.KAKAO_PAY_READY_FAIL);
        }

        payment.ready(kakaoReadyRes.getTid());

        return StorePayReadyResDto.builder()
                .orderId(order.getOrderId())
                .partnerOrderId(partnerOrderId)
                .nextRedirectPcUrl(kakaoReadyRes.getNextRedirectPcUrl())
                .build();
    }

// =====================================================
// 카카오페이 결제 승인
// =====================================================

    @Transactional
    public void payApprove(Long orderId, String pgToken) {
        StoreOrderEntity order = getOrderEntity(orderId);
        StorePaymentEntity payment = getPaymentEntity(order);

        if (payment.isPaid()) {
            throw new StoreException(StoreErrorCode.ORDER_ALREADY_PAID);
        }

        if (order.isCanceled()) {
            throw new StoreException(StoreErrorCode.ORDER_CANCELED);
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
            throw new StoreException(StoreErrorCode.KAKAO_PAY_APPROVE_FAIL);
        }

        order.paid();

        createOrderDeliveryIfNotExists(order);

        // 주문 결제 승인 이후 실제 포인트 차감 처리
        pointService.useOrderPoint(
                order.getMember(),
                order.getOrderUsedPoint(),
                order.getOrderId()
        );

        payment.approve(
                approveRes.getTid(),
                java.time.LocalDateTime.now()
        );

        sendOrderCompleteMessage(order);

        if (order.isCartOrder()) {
            storeCartItemRepository.deleteByMember(order.getMember());
        }

        log.info(
                "[스토어 결제 완료] orderId={}, paymentId={}, amount={}",
                order.getOrderId(),
                payment.getPaymentId(),
                payment.getPaymentAmount()
        );
    }

// =====================================================
// 주문 취소
// =====================================================

    @Transactional
    public void cancelOrder(Long orderId, String username) {
        if (isNotLogin(username)) {
            throw new StoreException(StoreErrorCode.ORDER_CANCEL_LOGIN_REQUIRED);
        }

        MemberEntity member = getLoginMember(username);
        StoreOrderEntity order = getOrderEntity(orderId);

        validateOrderOwner(order, member);

        if (!order.isPaid()) {
            throw new StoreException(StoreErrorCode.ORDER_NOT_PAID);
        }

        if (order.isCanceled()) {
            throw new StoreException(StoreErrorCode.ORDER_ALREADY_CANCELED);
        }

        if (!order.isDeliveryReady()) {
            throw new StoreException(StoreErrorCode.ORDER_CANCEL_NOT_ALLOWED);
        }

        order.cancel();

        pointService.refundOrderUsedPoint(
                order.getMember(),
                order.getOrderUsedPoint(),
                order.getOrderId()
        );

        log.info(
                "[스토어 주문 취소] orderId={}, memberId={}, refundPoint={}",
                order.getOrderId(),
                member.getId(),
                order.getOrderUsedPoint()
        );
    }

// =====================================================
// 주문 / 결제 생성 유틸
// =====================================================

    private StoreOrderEntity createOrder(
            MemberEntity member,
            StoreOrderType orderType,
            DeliveryAddressEntity deliveryAddress,
            String deliveryRequest,
            Long deliveryFee,
            Long usedPoint,
            Long finalAmount
    ) {
        StoreOrderEntity order = StoreOrderEntity.builder()
                .member(member)
                .orderType(orderType)
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

        return storeOrderRepository.save(order);
    }

    private StorePaymentEntity createPayment(
            StoreOrderEntity order,
            MemberEntity member,
            Long finalAmount,
            String partnerOrderId,
            String partnerUserId
    ) {
        StorePaymentEntity payment = StorePaymentEntity.builder()
                .order(order)
                .member(member)
                .paymentMethod(StorePaymentMethod.KAKAO_PAY)
                .paymentAmount(finalAmount)
                .partnerOrderId(partnerOrderId)
                .partnerUserId(partnerUserId)
                .build();

        return storePaymentRepository.save(payment);
    }

    private void createOrderDeliveryIfNotExists(StoreOrderEntity order) {
        boolean alreadyExists = storeOrderDeliveryRepository.findByOrder(order).isPresent();

        if (alreadyExists) {
            return;
        }

        StoreOrderDeliveryEntity delivery = StoreOrderDeliveryEntity.builder()
                .order(order)
                .deliveryAddressId(order.getDeliveryAddressId())
                .deliveryReceiverName(order.getOrderReceiverName())
                .deliveryReceiverPhone(order.getOrderReceiverPhone())
                .deliveryZipCode(order.getOrderZipCode())
                .deliveryAddress(order.getOrderAddress())
                .deliveryAddressDetail(order.getOrderAddressDetail())
                .deliveryRequestMemo(order.getOrderDeliveryRequest())
                .deliveryStatus(StoreDeliveryStatus.READY)
                .build();

        storeOrderDeliveryRepository.save(delivery);

        log.info(
                "[스토어 배송 정보 생성] orderId={}, deliveryId={}",
                order.getOrderId(),
                delivery.getDeliveryId()
        );
    }

// =====================================================
// 금액 / 포인트 / 카카오페이 유틸
// =====================================================

    private Long calculateDeliveryFee(Long totalProductAmount) {
        if (totalProductAmount == null || totalProductAmount <= 0) {
            return 0L;
        }

        if (totalProductAmount >= FREE_DELIVERY_MIN_AMOUNT) {
            return 0L;
        }

        return BASIC_DELIVERY_FEE;
    }

    private Long validateUsedPoint(
            Long requestedPoint,
            MemberEntity member,
            Long paymentTargetAmount
    ) {
        Long usedPoint = requestedPoint == null ? 0L : requestedPoint;

        if (usedPoint < 0) {
            throw new StoreException(StoreErrorCode.INVALID_USED_POINT);
        }

        if (usedPoint == 0) {
            return 0L;
        }

        if (usedPoint % 100 != 0) {
            throw new StoreException(StoreErrorCode.INVALID_POINT_UNIT);
        }

        if (usedPoint > member.getPoint()) {
            throw new StoreException(StoreErrorCode.POINT_OVER_BALANCE);
        }

        if (usedPoint > paymentTargetAmount) {
            throw new StoreException(StoreErrorCode.POINT_OVER_PAYMENT_AMOUNT);
        }

        return usedPoint;
    }

    private String makeKakaoItemName(List<StoreCartItemEntity> cartItems) {
        String firstProductName = cartItems.get(0).getProduct().getProductName();

        if (cartItems.size() == 1) {
            return firstProductName;
        }

        return firstProductName + " 외 " + (cartItems.size() - 1) + "건";
    }

// =====================================================
// 이미지 / S3
// =====================================================

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

// =====================================================
// 조회 / 권한 검증 유틸
// =====================================================

    private MemberEntity getLoginMember(String username) {
        return memberRepository
                .findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new StoreException(StoreErrorCode.LOGIN_MEMBER_NOT_FOUND));
    }

    private StoreProductEntity getProductEntity(Long productId) {
        return storeProductRepository.findById(productId)
                .orElseThrow(() -> new StoreException(StoreErrorCode.PRODUCT_NOT_FOUND));
    }

    private StoreCartItemEntity getCartItemEntity(Long cartItemId) {
        return storeCartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new StoreException(StoreErrorCode.CART_ITEM_NOT_FOUND));
    }

    private StoreOrderEntity getOrderEntity(Long orderId) {
        return storeOrderRepository.findById(orderId)
                .orElseThrow(() -> new StoreException(StoreErrorCode.ORDER_NOT_FOUND));
    }

    private StorePaymentEntity getPaymentEntity(StoreOrderEntity order) {
        return storePaymentRepository.findByOrder(order)
                .orElseThrow(() -> new StoreException(StoreErrorCode.PAYMENT_NOT_FOUND));
    }

    private DeliveryAddressEntity getDeliveryAddress(
            StorePayReadyReqDto reqDto,
            MemberEntity member
    ) {
        if (reqDto == null || reqDto.getDeliveryAddressId() == null) {
            throw new StoreException(StoreErrorCode.DELIVERY_ADDRESS_REQUIRED);
        }

        return deliveryAddressRepository.findByIdAndMember(
                reqDto.getDeliveryAddressId(),
                member
        ).orElseThrow(() -> new StoreException(StoreErrorCode.DELIVERY_ADDRESS_NOT_FOUND));
    }

    private DeliveryAddressEntity getDeliveryAddress(
            StoreDirectPayReadyReqDto reqDto,
            MemberEntity member
    ) {
        if (reqDto == null || reqDto.getDeliveryAddressId() == null) {
            throw new StoreException(StoreErrorCode.DELIVERY_ADDRESS_REQUIRED);
        }

        return deliveryAddressRepository.findByIdAndMember(
                reqDto.getDeliveryAddressId(),
                member
        ).orElseThrow(() -> new StoreException(StoreErrorCode.DELIVERY_ADDRESS_NOT_FOUND));
    }

    private void validateCartItemOwner(
            StoreCartItemEntity cartItem,
            MemberEntity member
    ) {
        if (!cartItem.getMember().getId().equals(member.getId())) {
            throw new StoreException(StoreErrorCode.CART_ITEM_ACCESS_DENIED);
        }
    }

    private void validateOrderOwner(
            StoreOrderEntity order,
            MemberEntity member
    ) {
        if (!order.getMember().getId().equals(member.getId())) {
            throw new StoreException(StoreErrorCode.ORDER_ACCESS_DENIED);
        }
    }

    private boolean isNotLogin(String username) {
        return username == null || username.isBlank() || "anonymousUser".equals(username);
    }

// =====================================================
// 시스템 메시지
// =====================================================

    private void sendOrderCompleteMessage(StoreOrderEntity order) {
        try {
            String title = "[주문완료] 주문해주셔서 감사합니다.";

            String content = String.format(
                    "결제가 정상적으로 완료되었습니다.\n" +
                            "최종 결제금액은 %,d원입니다.\n" +
                            "주문하신 상품은 곧 배송 준비가 시작될 예정입니다.\n" +
                            "PET&I FOR를 이용해주셔서 감사합니다.",
                    order.getOrderFinalAmount()
            );

            systemMessageService.sendByAdmin(
                    STORE_SYSTEM_ADMIN_USERNAME,
                    order.getMember(),
                    MessageReasonType.NOTICE,
                    title,
                    content
            );
        } catch (Exception e) {
            // 주문 자체는 성공했으므로 쪽지 실패는 주문 트랜잭션을 막지 않음
            log.warn(
                    "[스토어 결제 완료 쪽지 발송 실패] orderId={}, memberId={}, message={}",
                    order.getOrderId(),
                    order.getMember().getId(),
                    e.getMessage()
            );
        }
    }

}
