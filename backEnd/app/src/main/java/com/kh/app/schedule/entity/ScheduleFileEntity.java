package com.kh.app.schedule.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SCHEDULE_IMAGE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class ScheduleFileEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "SCHEDULE_ID", nullable = false)
    private ScheduleEntity schedule;

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


}
