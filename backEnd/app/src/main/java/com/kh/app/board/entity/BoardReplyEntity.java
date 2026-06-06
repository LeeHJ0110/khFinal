package com.kh.app.board.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "BOARD_REPLY")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@Setter
public class BoardReplyEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BOARD_REPLY_ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BOARD_ID" , nullable = false)
    private BoardEntity board;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID" , nullable = false)
    private MemberEntity member;

    @Column(name = "BOARD_REPLY_CONTENT", length = 1000)
    private String content;

    @Column(name = "BOARD_REPLY_BLIND_YN", nullable = false, length = 1)
    @Builder.Default
    private String blindYn = "N";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 1)
    @Builder.Default
    private DelYn delYn = DelYn.N;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PARENT_REPLY_ID")
    private BoardReplyEntity parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BoardReplyEntity> children = new ArrayList<>();

    public void delete() {
        this.delYn = DelYn.Y;
    }
}