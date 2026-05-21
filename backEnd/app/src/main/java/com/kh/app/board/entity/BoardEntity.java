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
    private Long id;

    @JoinColumn(name = "WRITER_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private MemberEntity writer;

    @Column(length = 50, nullable = false)
    private String category;

    @Column(length = 100, nullable = false)
    private String title;

    @Column(length = 4000, nullable = false)
    private String content;

    @Column(nullable = false)
    @Builder.Default
    private Long hits = 0L;

    @Column(nullable = false , length = 1)
    @Builder.Default
    private String blindYn = "N";

    @Column(length = 20)
    private String subCategory;

    @Column(nullable = true)
    private Long topOrder;

    @Column(nullable = true, precision = 2, scale = 1)  // precision=2(총 자릿수 2자리), scale=1(소수점 이하 1자리)
    private Long stars;


    public void increaseHit(){
        this.hits++;
    }

    public void update(String title, String content){
        this.title = title;
        this.content = content;
    }




}
