package com.kh.app.store.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StoreCartInsertReqDto {

    private Long productId;

    private Integer qty;
}