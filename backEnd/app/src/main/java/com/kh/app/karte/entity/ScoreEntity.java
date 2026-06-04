package com.kh.app.karte.entity;

import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "SCORE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ScoreEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "KARTE_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private KarteEntity karte;

    @Enumerated(EnumType.STRING)
    @Column(length = 500, nullable = false)
    private ScoreCategory category;

    @Column(nullable = false)
    private Long score;


}
