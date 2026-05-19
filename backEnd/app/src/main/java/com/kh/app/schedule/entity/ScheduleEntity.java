package com.kh.app.schedule.entity;

import com.kh.app.common.entity.BaseEntity;
import com.kh.app.schedule.dto.request.EventReqDto;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SCHEDULE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ScheduleEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MEMBER_ID", nullable = false)
    private MemberEntity member;

    @Column(name = "AT", nullable = false, length = 4)
    private String at;

    @Column(name = "START_DATE", nullable = false, length = 8)
    private String startDate;

    @Column(name = "END_DATE", nullable = false, length = 8)
    private String endDate;

    @Column(name = "TITLE", nullable = false, length = 1000)
    private String title;

    @Column(name = "CONTENT", length = 4000)
    private String content;

    @Column(name = "COLOR", length = 6)
    private String color = "5EC8A7";

    public void update(EventReqDto reqDto) {
        this.at = reqDto.getAt();
        this.startDate = reqDto.getStartDate();
        this.endDate = reqDto.getEndDate();
        this.title = reqDto.getTitle();
        this.content = reqDto.getContent();
        this.color = reqDto.getBackgroundColor();
    }
}
