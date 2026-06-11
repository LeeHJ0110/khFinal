package com.kh.app.board.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "BOARD_REPLY_REORT", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"BOARD_REPLY_ID", "REPORTER_ID"})
})
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@Setter
public class BoardReplyReportEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BOARD_REPLY_ID", nullable = false)
    private BoardReplyEntity reply;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "REPORTER_ID", nullable = false)
    private MemberEntity reporter;

    @Column(length = 255, nullable = false)
    private String reason;

    // PENDING (대기), APPROVED (승인-블라인드), REJECTED (반려-유지)
    @Column(length = 20, nullable = false)
    @Builder.Default
    private String status = "PENDING";
}
