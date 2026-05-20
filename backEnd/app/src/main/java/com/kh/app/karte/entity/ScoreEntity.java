package com.kh.app.karte.entity;

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

    @Column(length = 500, nullable = false)
    private String category;

    @Column(nullable = false)
    private Long score;
}
