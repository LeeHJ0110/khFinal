package com.kh.app.board.entity;

import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "BOARD_LIKE", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"MEMBER_ID", "BOARD_ID"})
})
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class BoardLikeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "MEMBER_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private MemberEntity member;

    @JoinColumn(name = "BOARD_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private BoardEntity board;
}
