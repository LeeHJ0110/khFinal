package com.kh.app.pet.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "BREED")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BreedEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BREED_ID")
    private Long id;

    // 품종명
    @Column(name = "BREED_NAME", length = 30, nullable = false)
    private String name;

    // 적정 최소 몸무게
    @Column(name = "BREED_AVG_WEIGHT_MIN")
    private BigDecimal weightMin;

    // 적정 최대 몸무게
    @Column(name = "BREED_AVG_WEIGHT_MAX")
    private BigDecimal weightMax;

    // 종류
    @Enumerated(EnumType.STRING)
    @Column(name = "PET_TYPE", length = 1)
    private PetType petType;

    // 크기 분류
    @Enumerated(EnumType.STRING)
    @Column(name = "SIZE_TYPE", length = 1)
    private SizeType sizeType;
}
