package com.kh.app.admin.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AdminDeliveryBulkShippingReqDto {

    private List<Long> deliveryIds;

    private String deliveryCompanyName;

    private String deliveryTrackingNumber;
}