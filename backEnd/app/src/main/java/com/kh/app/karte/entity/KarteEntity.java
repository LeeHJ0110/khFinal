package com.kh.app.karte.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "KARTE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class KarteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @JoinColumn(name = "REQ_ID", nullable = false)
//    @ManyToOne(fetch = FetchType.LAZY)
//    private Long req;           //TODO Type -> DiagnosisReqEntity
//
//    @JoinColumn(name = "WRITER_ID", nullable = false)
//    @ManyToOne(fetch = FetchType.LAZY)
//    private Long writer;        //TODO Type -> MemberEntity

    @Column(length = 1000, nullable = false)
    private String summary;

    @Column(length = 4000, nullable = false)
    private String opinion;

    @Column(nullable = false , length = 1)
    @Builder.Default
    private VisitedYn visitedYn = VisitedYn.N;

    public void visited(){
        visitedYn = VisitedYn.Y;
    }
}
