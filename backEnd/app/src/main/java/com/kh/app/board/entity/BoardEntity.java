package com.kh.app.board.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "BOARD")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@Setter
public class BoardEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "WRITER_ID", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private MemberEntity writer;

    @Enumerated(EnumType.STRING)
    @Column(length = 50, nullable = false)
    private BoardCategory category;

    @Column(length = 100, nullable = false)
    private String title;

    @Lob // react-quill-new 를 사용하여 이미지를 받아오게 되면 글자가 말도안되게 길음 그래서 그냥 텍스트를 숫자로 처리
    @Column(name = "CONTENT", nullable = false, columnDefinition = "TEXT") // DB에 TEXT 타입으로 지정
    private String content;

    @Column(nullable = false)
    @Builder.Default
    private Long hits = 0L;

    @Column(nullable = false , length = 1)
    @Builder.Default
    private String blindYn = "N";

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private BoardSubCategory subCategory;

    @Column(nullable = true)
    private Long topOrder;

    @Column(nullable = true, precision = 2, scale = 1)
    private Long stars;


    public void increaseHit(){
        this.hits++;
    }

    public void update(String title, String content){
        this.title = title;
        this.content = content;
    }

}
