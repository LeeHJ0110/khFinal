package com.kh.app.mypage.store.service;

import com.kh.app.aws.service.S3Service;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.mypage.store.dto.response.StoreOrderHistoryItemResDto;
import com.kh.app.mypage.store.dto.response.StoreOrderHistoryResDto;
import com.kh.app.store.entity.StoreOrderEntity;
import com.kh.app.store.entity.StoreOrderItemEntity;
import com.kh.app.store.entity.StoreProductImageEntity;
import com.kh.app.store.repository.StoreOrderItemRepository;
import com.kh.app.store.repository.StoreOrderRepository;
import com.kh.app.store.repository.StoreProductImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyPageStoreService {

    private final MemberRepository memberRepository;
    private final StoreOrderRepository storeOrderRepository;
    private final StoreOrderItemRepository storeOrderItemRepository;
    private final StoreProductImageRepository storeProductImageRepository;
    private final S3Service s3Service;

    public Page<StoreOrderHistoryResDto> getMyOrders(
            String loginKey,
            Pageable pageable
    ) {
        MemberEntity member = memberRepository.findByUsername(loginKey)
                .or(() -> memberRepository.findBySocialId(loginKey))
                .orElseThrow(() ->
                        new IllegalStateException("회원 정보가 존재하지 않습니다.")
                );

        return storeOrderRepository
                .findByMember_IdOrderByCreatedAtDesc(
                        member.getId(),
                        pageable
                )
                .map(this::convertToDto);
    }

    private StoreOrderHistoryResDto convertToDto(
            StoreOrderEntity order
    ) {
        List<StoreOrderHistoryItemResDto> itemList =
                storeOrderItemRepository
                        .findByOrder_OrderId(order.getOrderId())
                        .stream()
                        .map(this::convertItemDto)
                        .toList();

        return StoreOrderHistoryResDto.from(
                order,
                itemList
        );
    }

    private StoreOrderHistoryItemResDto convertItemDto(
            StoreOrderItemEntity item
    ) {
        String imageUrl =
                storeProductImageRepository
                        .findFirstByProduct_ProductIdAndImageRepresentYnOrderBySortOrderAsc(
                                item.getProduct().getProductId(),
                                "Y"
                        )
                        .map(StoreProductImageEntity::getImageChangedName)
                        .map(s3Service::getFileUrl)
                        .orElse(null);

        return StoreOrderHistoryItemResDto.from(
                item,
                imageUrl
        );
    }
}