package com.kh.app.admin.controller;

import com.kh.app.admin.dto.request.AdminDeliveryBulkShippingReqDto;
import com.kh.app.admin.dto.response.AdminDeliveryDetailResDto;
import com.kh.app.admin.dto.response.AdminDeliveryListResDto;
import com.kh.app.admin.service.AdminDeliveryService;
import com.kh.app.store.entity.StoreDeliveryStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/deliveries")
@RequiredArgsConstructor
public class AdminDeliveryController {

    private final AdminDeliveryService adminDeliveryService;

    @GetMapping
    public Page<AdminDeliveryListResDto> getDeliveries(
            @RequestParam(defaultValue = "READY") StoreDeliveryStatus status,
            Pageable pageable
    ) {
        return adminDeliveryService.getDeliveries(status, pageable);
    }

    @GetMapping("/{deliveryId}")
    public AdminDeliveryDetailResDto getDeliveryDetail(@PathVariable Long deliveryId) {
        return adminDeliveryService.getDeliveryDetail(deliveryId);
    }

    @PutMapping("/{deliveryId}/shipping")
    public void startShipping(
            @PathVariable Long deliveryId,
            @RequestBody AdminDeliveryBulkShippingReqDto reqDto
    ) {
        adminDeliveryService.startShipping(deliveryId, reqDto);
    }

    @PutMapping("/shipping")
    public void startShippingBulk(@RequestBody AdminDeliveryBulkShippingReqDto reqDto) {
        adminDeliveryService.startShippingBulk(reqDto);
    }
}