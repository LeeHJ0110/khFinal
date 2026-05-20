package com.kh.app.store.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PRODUCT_TAG")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StoreProductTagEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TAG_ID")
    private Long tagId;

    @Column(name = "TAG_NAME", nullable = false, length = 100)
    private String tagName;

    @Column(name = "TAG_SUMMARY", length = 500)
    private String tagSummary;

    @Column(name = "TAG_DESCRIPTION", length = 2000)
    private String tagDescription;

    @Column(name = "TAG_USE_YN", nullable = false, length = 1)
    @Builder.Default
    private String tagUseYn = "Y";

    public void update(String tagName, String tagSummary, String tagDescription, String tagUseYn) {
        this.tagName = tagName;
        this.tagSummary = tagSummary;
        this.tagDescription = tagDescription;
        this.tagUseYn = tagUseYn;
    }
}