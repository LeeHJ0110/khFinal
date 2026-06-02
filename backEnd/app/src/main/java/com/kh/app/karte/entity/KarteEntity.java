package com.kh.app.karte.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.petcare.entity.DiagnosisReqEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "KARTE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class KarteEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "REQ_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private DiagnosisReqEntity diaReq;

    @JoinColumn(name = "WRITER_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private MemberEntity member;

    @Column(length = 1000, nullable = false)
    private String summary;

    @Column(length = 4000, nullable = false)
    private String opinion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false , length = 1)
    @Builder.Default
    private VisitedYn visitedYn = VisitedYn.N;

    public void visite(){
        visitedYn = VisitedYn.Y;
    }
}
