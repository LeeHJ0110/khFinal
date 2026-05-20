package com.kh.app.pet.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

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
    private Long petId;

    // 대표동물 여부
    @Enumerated(EnumType.STRING)
    @Column(name = "PET_REPRESENT_YN", length = 1)
    private PetRepresentYn petRepresentYn;

    // 이름
    @Column(name = "PET_NAME", length = 30, nullable = false)
    private String petName;

    // 생년월일
    @Column(name = "PET_BIRTH_DATE", length = 8)
    private String petBirthDate;

    // 성별
    @Enumerated(EnumType.STRING)
    @Column(name = "PET_GENDER", length = 1)
    private PetGender petGender;

    // 몸무게
    @Column(name = "PET_WEIGHT")
    private Double petWeight;

    // 중성화 여부
    @Enumerated(EnumType.STRING)
    @Column(name = "PET_NEUTERED_YN", length = 1)
    private PetNeuteredYn petNeuteredYn;

    // 회원
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID")
    private MemberEntity memberId;

    // 품종
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BREED_ID")
    private BreedEntity breedId;

}
