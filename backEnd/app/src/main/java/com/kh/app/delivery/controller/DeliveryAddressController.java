package com.kh.app.delivery.controller;

import com.kh.app.delivery.dto.request.DeliveryAddressCreateReqDto;
import com.kh.app.delivery.dto.request.DeliveryAddressUpdateReqDto;
import com.kh.app.delivery.dto.response.DeliveryAddressListResDto;
import com.kh.app.delivery.service.DeliveryAddressService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "배송지", description = "배송지 관리 API")
@RestController
@RequestMapping("/api/mypage/delivery")
@RequiredArgsConstructor
public class DeliveryAddressController {

    private final DeliveryAddressService deliveryAddressService;

    @GetMapping
    public ResponseEntity<List<DeliveryAddressListResDto>> getMyDeliveryAddressList(
            Authentication authentication
    ) {
        String loginKey = authentication.getName();

        return ResponseEntity.ok(
                deliveryAddressService.getMyDeliveryAddressList(loginKey)
        );
    }

    @PostMapping
    public ResponseEntity<Long> create(
            Authentication authentication,
            @Valid @RequestBody DeliveryAddressCreateReqDto request
    ) {
        String loginKey = authentication.getName();

        Long deliveryAddressId =
                deliveryAddressService.create(loginKey, request);

        return ResponseEntity.ok(deliveryAddressId);
    }

    @PutMapping("/{deliveryAddressId}")
    public ResponseEntity<Void> update(
            Authentication authentication,
            @PathVariable Long deliveryAddressId,
            @Valid @RequestBody DeliveryAddressUpdateReqDto request
    ) {
        String loginKey = authentication.getName();

        deliveryAddressService.update(
                loginKey,
                deliveryAddressId,
                request
        );

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{deliveryAddressId}")
    public ResponseEntity<Void> delete(
            Authentication authentication,
            @PathVariable Long deliveryAddressId
    ) {
        String loginKey = authentication.getName();

        deliveryAddressService.delete(loginKey, deliveryAddressId);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{deliveryAddressId}/default")
    public ResponseEntity<Void> changeDefault(
            Authentication authentication,
            @PathVariable Long deliveryAddressId
    ) {
        String loginKey = authentication.getName();

        deliveryAddressService.changeDefault(loginKey, deliveryAddressId);

        return ResponseEntity.ok().build();
    }
}