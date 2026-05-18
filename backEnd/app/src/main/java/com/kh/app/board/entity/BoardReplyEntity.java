package com.kh.app.board.entity;

//import com.kh.app.common.entity.BaseEntity;
//import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "BOARD_REPLY")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class BoardReplyEntity { //extends BaseEntity

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BOARD_REPLY_ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BOARD_ID" , nullable = false)
    private BoardEntity board;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID" , nullable = false)
    private String member; //MemberEntity

    @Column(name = "BOARD_REPLY_CONTENT", length = 100)
    private String content;

    @Column(name = "BOARD_REPLY_BLIND_YN", nullable = false, length = 1)
    @Builder.Default
    private String blindYn = "N";

}