package com.kh.app.karte.dto.response;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.karte.entity.VisitedYn;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class KarteListResDto{
    private Long id;
    private String petName;
    private String writer;
    private LocalDateTime createdAt;
    private VisitedYn visited;
}
