package com.kh.app.admin.service;

import com.kh.app.admin.dto.request.AdminDeliveryBulkShippingReqDto;
import com.kh.app.admin.dto.response.AdminDeliveryDetailResDto;
import com.kh.app.admin.dto.response.AdminDeliveryListResDto;
import com.kh.app.store.entity.StoreDeliveryStatus;
import com.kh.app.store.entity.StoreOrderDeliveryEntity;
import com.kh.app.store.entity.StoreOrderItemEntity;
import com.kh.app.store.repository.StoreOrderDeliveryRepository;
import com.kh.app.store.repository.StoreOrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminDeliveryService {

    private final StoreOrderDeliveryRepository deliveryRepository;
    private final StoreOrderItemRepository orderItemRepository;

    public Page<AdminDeliveryListResDto> getDeliveries(
            StoreDeliveryStatus status,
            Pageable pageable
    ) {
        return deliveryRepository.findByDeliveryStatusOrderByCreatedAtDesc(status, pageable)
                .map(AdminDeliveryListResDto::from);
    }

    public AdminDeliveryDetailResDto getDeliveryDetail(Long deliveryId) {
        StoreOrderDeliveryEntity delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new IllegalStateException("배송 정보를 찾을 수 없습니다."));

        List<StoreOrderItemEntity> orderItems =
                orderItemRepository.findAllByOrder_OrderId(delivery.getOrder().getOrderId());

        return AdminDeliveryDetailResDto.from(delivery, orderItems);
    }

    @Transactional
    public void startShipping(Long deliveryId, AdminDeliveryBulkShippingReqDto reqDto) {
        StoreOrderDeliveryEntity delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new IllegalStateException("배송 정보를 찾을 수 없습니다."));

        if (delivery.getDeliveryStatus() != StoreDeliveryStatus.READY) {
            throw new IllegalStateException("배송 준비중 상태만 배송중으로 변경할 수 있습니다.");
        }

        delivery.startShipping(
                reqDto.getDeliveryCompanyName(),
                reqDto.getDeliveryTrackingNumber()
        );
    }

    @Transactional
    public void startShippingBulk(AdminDeliveryBulkShippingReqDto reqDto) {
        List<StoreOrderDeliveryEntity> deliveries =
                deliveryRepository.findAllByDeliveryIdIn(reqDto.getDeliveryIds());

        for (StoreOrderDeliveryEntity delivery : deliveries) {
            if (delivery.getDeliveryStatus() == StoreDeliveryStatus.READY) {
                delivery.startShipping(
                        reqDto.getDeliveryCompanyName(),
                        reqDto.getDeliveryTrackingNumber()
                );
            }
        }
    }
}