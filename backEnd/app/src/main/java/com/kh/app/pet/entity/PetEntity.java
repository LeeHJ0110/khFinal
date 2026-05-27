package com.kh.app.pet.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "PET")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class PetEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PET_ID")
    private Long id;

    // 대표동물 여부
    @Enumerated(EnumType.STRING)
    @Column(name = "PET_REPRESENT_YN", length = 1)
    private PetRepresentYn representYn;

    // 이름
    @Column(name = "PET_NAME", length = 30, nullable = false)
    private String name;

    // 생년월일
    @Column(name = "PET_BIRTH_DATE", length = 8)
    private String birthDate;

    // 성별
    @Enumerated(EnumType.STRING)
    @Column(name = "PET_GENDER", length = 1)
    private PetGender gender;

    // 몸무게
    @Column(name = "PET_WEIGHT")
    private BigDecimal weight;

    // 중성화 여부
    @Enumerated(EnumType.STRING)
    @Column(name = "PET_NEUTERED_YN", length = 1)
    private PetNeuteredYn neuteredYn;

    // 회원
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID")
    private MemberEntity member;

    // 품종
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BREED_ID")
    private BreedEntity breed;

    public void update(
            BreedEntity breed,
            String name,
            PetGender gender,
            String birthDate,
            BigDecimal weight,
            PetRepresentYn representYn
    ) {
        this.breed = breed;
        this.name = name;
        this.gender = gender;
        this.birthDate = birthDate;
        this.weight = weight;
        this.representYn = representYn;
    }
    public void delete() {
        this.delYn = DelYn.Y;
    }

}
