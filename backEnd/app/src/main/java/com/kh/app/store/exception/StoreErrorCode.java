package com.kh.app.store.exception;

import com.kh.app.common.exception.ErrorCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum StoreErrorCode implements ErrorCode {


// =====================================================
// 상품 SP
// =========================================================
    PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "SP001", "존재하지 않는 상품입니다."),
    PRODUCT_NOT_ON_SALE(HttpStatus.NOT_FOUND, "SP002", "판매중지된 상품입니다."),
    PRODUCT_TAG_NOT_FOUND(HttpStatus.NOT_FOUND, "SP003", "존재하지 않는 상품 태그입니다."),

    INVALID_TARGET_PET_TYPE(HttpStatus.BAD_REQUEST, "SP101", "대상동물 타입은 D 또는 C만 가능합니다."),
    INVALID_PRODUCT_SORT(HttpStatus.BAD_REQUEST, "SP102", "지원하지 않는 정렬 조건입니다."),
    INVALID_PRODUCT_SALE_YN(HttpStatus.BAD_REQUEST, "SP103", "판매상태는 Y 또는 N만 가능합니다."),
    INVALID_ADMIN_PRODUCT_SORT(HttpStatus.BAD_REQUEST, "SP104", "관리자 상품 목록 정렬 조건은 latest 또는 oldest만 가능합니다."),
    INVALID_FEEDING_GUIDE(HttpStatus.BAD_REQUEST, "SP105", "급여기준 정보가 올바르지 않습니다."),
    PRODUCT_TARGET_PET_TYPE_REQUIRED(HttpStatus.BAD_REQUEST, "SP106", "상품 대상동물 타입이 없습니다."),

// =====================================================
// 관심상품 SW
// =====================================================
    WISH_LOGIN_REQUIRED(HttpStatus.UNAUTHORIZED, "SW201", "로그인 후 관심상품을 이용할 수 있습니다."),
    LOGIN_MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "SW001", "로그인 회원을 찾을 수 없습니다."),
    WISH_NOT_FOUND(HttpStatus.NOT_FOUND, "SW002", "관심상품을 찾을 수 없습니다."),
    PRODUCT_ID_REQUIRED(HttpStatus.BAD_REQUEST, "SW101", "상품 ID는 필수입니다."),
    WISHLIST_ID_REQUIRED(HttpStatus.BAD_REQUEST, "SW102", "관심상품 ID는 필수입니다."),
    ALREADY_WISHED_PRODUCT(HttpStatus.CONFLICT, "SW301", "이미 관심상품에 등록된 상품입니다."),

// =====================================================
// 장바구니 SC
// =====================================================
    CART_ITEM_NOT_FOUND(HttpStatus.NOT_FOUND, "SC001", "장바구니 상품을 찾을 수 없습니다."),
    INVALID_CART_QTY(HttpStatus.BAD_REQUEST, "SC101", "수량은 1개 이상이어야 합니다."),
    CART_LOGIN_REQUIRED(HttpStatus.UNAUTHORIZED, "SC201", "로그인 후 장바구니를 이용할 수 있습니다."),
    CART_ITEM_ACCESS_DENIED(HttpStatus.FORBIDDEN, "SC202", "본인의 장바구니 상품만 수정하거나 삭제할 수 있습니다."),
    CART_EMPTY(HttpStatus.BAD_REQUEST, "SC301", "장바구니가 비어 있습니다."),

// =====================================================
// 주문 / 결제 SO
// =====================================================
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "SO001", "주문을 찾을 수 없습니다."),
    PAYMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "SO002", "결제 정보를 찾을 수 없습니다."),
    DELIVERY_ADDRESS_NOT_FOUND(HttpStatus.NOT_FOUND, "SO003", "배송지 정보가 존재하지 않습니다."),

    DELIVERY_ADDRESS_REQUIRED(HttpStatus.BAD_REQUEST, "SO101", "배송지를 선택해주세요."),
    ORDER_LOGIN_REQUIRED(HttpStatus.UNAUTHORIZED, "SO201", "로그인 후 결제를 진행할 수 있습니다."),
    ORDER_CANCEL_LOGIN_REQUIRED(HttpStatus.UNAUTHORIZED, "SO202", "로그인 후 주문을 취소할 수 있습니다."),
    ORDER_ACCESS_DENIED(HttpStatus.FORBIDDEN, "SO203", "본인의 주문만 처리할 수 있습니다."),

    ORDER_ALREADY_PAID(HttpStatus.CONFLICT, "SO301", "이미 결제 완료된 주문입니다."),
    ORDER_ALREADY_CANCELED(HttpStatus.CONFLICT, "SO302", "이미 취소된 주문입니다."),
    ORDER_CANCELED(HttpStatus.CONFLICT, "SO303", "취소된 주문은 결제할 수 없습니다."),
    ORDER_NOT_PAID(HttpStatus.BAD_REQUEST, "SO304", "결제 완료된 주문만 취소할 수 있습니다."),
    ORDER_CANCEL_NOT_ALLOWED(HttpStatus.BAD_REQUEST, "SO305", "배송준비중 상태의 주문만 취소할 수 있습니다."),

    INVALID_USED_POINT(HttpStatus.BAD_REQUEST, "SO401", "사용 포인트는 0 이상이어야 합니다."),
    INVALID_POINT_UNIT(HttpStatus.BAD_REQUEST, "SO402", "포인트는 100P 단위로만 사용할 수 있습니다."),
    POINT_OVER_BALANCE(HttpStatus.BAD_REQUEST, "SO403", "보유 포인트보다 많이 사용할 수 없습니다."),
    POINT_OVER_PAYMENT_AMOUNT(HttpStatus.BAD_REQUEST, "SO404", "결제금액보다 많은 포인트는 사용할 수 없습니다."),

    KAKAO_PAY_READY_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "SO501", "카카오페이 결제 준비에 실패했습니다."),
    KAKAO_PAY_APPROVE_FAIL(HttpStatus.INTERNAL_SERVER_ERROR, "SO502", "카카오페이 결제 승인에 실패했습니다."),

// =====================================================
// 리뷰 SR
// =====================================================
    REVIEW_NOT_FOUND(HttpStatus.NOT_FOUND, "SR001", "존재하지 않는 리뷰입니다."),
    REVIEW_ORDER_ITEM_NOT_FOUND(HttpStatus.NOT_FOUND, "SR002", "리뷰 작성 가능한 주문상품을 찾을 수 없습니다."),
    REVIEW_MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "SR003", "리뷰 회원 정보를 찾을 수 없습니다."),

    REVIEW_DATA_REQUIRED(HttpStatus.BAD_REQUEST, "SR101", "리뷰 데이터가 없습니다."),
    REVIEW_ORDER_ITEM_ID_REQUIRED(HttpStatus.BAD_REQUEST, "SR102", "주문상품 ID는 필수입니다."),
    REVIEW_TITLE_REQUIRED(HttpStatus.BAD_REQUEST, "SR103", "리뷰 제목은 필수입니다."),
    REVIEW_TITLE_TOO_LONG(HttpStatus.BAD_REQUEST, "SR104", "리뷰 제목은 200자 이하로 입력해주세요."),
    REVIEW_CONTENT_REQUIRED(HttpStatus.BAD_REQUEST, "SR105", "리뷰 내용은 필수입니다."),
    REVIEW_CONTENT_TOO_LONG(HttpStatus.BAD_REQUEST, "SR106", "리뷰 내용은 500자 이하로 입력해주세요."),
    REVIEW_RATING_REQUIRED(HttpStatus.BAD_REQUEST, "SR107", "별점은 필수입니다."),
    INVALID_REVIEW_RATING(HttpStatus.BAD_REQUEST, "SR108", "별점은 1점부터 5점까지 입력 가능합니다."),
    REVIEW_IMAGE_COUNT_EXCEEDED(HttpStatus.BAD_REQUEST, "SR109", "리뷰 이미지는 최대 3장까지 첨부 가능합니다."),
    INVALID_REVIEW_IMAGE_TYPE(HttpStatus.BAD_REQUEST, "SR110", "이미지 파일만 업로드할 수 있습니다."),
    REVIEW_IMAGE_SIZE_EXCEEDED(HttpStatus.BAD_REQUEST, "SR111", "리뷰 이미지는 파일당 최대 3MB까지 업로드할 수 있습니다."),

    REVIEW_LOGIN_REQUIRED(HttpStatus.UNAUTHORIZED, "SR201", "로그인이 필요합니다."),
    REVIEW_ACCESS_DENIED(HttpStatus.FORBIDDEN, "SR202", "본인이 작성한 리뷰만 수정할 수 있습니다."),
    REVIEW_DELETE_ACCESS_DENIED(HttpStatus.FORBIDDEN, "SR203", "리뷰 삭제 권한이 없습니다."),
    REVIEW_ORDER_ACCESS_DENIED(HttpStatus.FORBIDDEN, "SR204", "본인이 구매한 상품에만 리뷰를 작성할 수 있습니다."),

    REVIEW_ALREADY_WRITTEN(HttpStatus.CONFLICT, "SR301", "이미 리뷰를 작성한 주문상품입니다."),
    REVIEW_DELETED(HttpStatus.CONFLICT, "SR302", "삭제된 리뷰는 수정할 수 없습니다."),
    REVIEW_ORDER_NOT_PAID(HttpStatus.BAD_REQUEST, "SR303", "결제 완료된 주문만 리뷰를 작성할 수 있습니다.");

    private final HttpStatus status;
    private final String code;
    private final String msg;

}
