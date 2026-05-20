package com.kh.app.store.entity;

import com.kh.app.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "PRODUCT_IMAGE")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class StoreProductImageEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PRODUCT_IMAGE_ID")
    private Long productImageId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private StoreProductEntity product;

    @Column(name = "SORT_ORDER")
    private Long sortOrder;

    @Column(name = "IMAGE_REPRESENT_YN", nullable = false, length = 1)
    @Builder.Default
    private String imageRepresentYn = "N";

    @Column(name = "IMAGE_ORIGIN_NAME", nullable = false, length = 4000)
    private String imageOriginName;

    @Column(name = "IMAGE_CHANGED_NAME", nullable = false, length = 4000)
    private String imageChangedName;

    public static StoreProductImageEntity from(
            StoreProductEntity product,
            MultipartFile file,
            String changedName,
            Long sortOrder,
            String imageRepresentYn
    ) {
        return StoreProductImageEntity.builder()
                .product(product)
                .sortOrder(sortOrder)
                .imageRepresentYn(imageRepresentYn)
                .imageOriginName(file.getOriginalFilename())
                .imageChangedName(changedName)
                .build();
    }
}