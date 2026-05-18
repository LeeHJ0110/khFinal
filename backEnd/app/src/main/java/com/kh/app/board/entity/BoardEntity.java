package com.kh.app.board.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "BOARD")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class BoardEntity {  //extends BaseEntity

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Board_id;

    @JoinColumn(name = "WRITER_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Long Member_id;       //Type -> MemberEntity

    @Column(length = 50, nullable = false)
    private String Board_Category;

    @Column(length = 100, nullable = false)
    private String Board_Title;

    @Column(length = 4000, nullable = false)
    private String Board_Content;

    @Column(nullable = false)
    @Builder.Default
    private Long Board_Hits = 0L;

    @Column(nullable = false , length = 1)
    @Builder.Default
    private String Board_Blind_Yn = "N";

    @Column(length = 100)
    private String Board_Sub_category;

    @Column(nullable = true)
    private Long Board_Top_order;

    @Column(nullable = true)
    private Long Board_Stars;


    public void increaseHit(){
        this.Board_Hits++;
    }

    public void update(String title, String content){
        this.Board_Title = title;
        this.Board_Content = content;
    }


}
