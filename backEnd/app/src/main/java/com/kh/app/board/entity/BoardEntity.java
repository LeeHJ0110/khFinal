package com.kh.app.board.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "BOARD")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class BoardEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long boardId;

    @JoinColumn(name = "WRITER_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private MemberEntity memberId;       //Type -> MemberEntity

    @Column(length = 50, nullable = false)
    private String boardCategory;

    @Column(length = 100, nullable = false)
    private String boardTitle;

    @Column(length = 4000, nullable = false)
    private String boardContent;

    @Column(nullable = false)
    @Builder.Default
    private Long boardHits = 0L;

    @Column(nullable = false , length = 1)
    @Builder.Default
    private String boardBlindYn = "N";

    @Column(length = 20)
    private String boardSubCategory;

    @Column(nullable = true)
    private Long boardTopOrder;

    @Column(nullable = true, precision = 2, scale = 1)  // precision=2(총 자릿수 2자리), scale=1(소수점 이하 1자리)
    private Double boardStars;


    public void increaseHit(){
        this.boardHits++;
    }

    public void update(String title, String content){
        this.boardTitle = title;
        this.boardContent = content;
    }




}
