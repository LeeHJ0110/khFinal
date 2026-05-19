package com.kh.app.schedule.entity;

import com.kh.app.common.entity.BaseEntity;
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
    private Long member;        //TODO Type -> MemberEntity

    @Column(name = "IMAGE_ORIGIN_NAME", nullable = false, length = 4000)
    private String imageOriginName;

    @Column(name = "IMAGE_CHANGED_NAME", nullable = false, length = 4000)
    private String imageChangedName;
}
