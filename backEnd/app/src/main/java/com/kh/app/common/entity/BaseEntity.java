package com.kh.app.common.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@MappedSuperclass
public class BaseEntity {

    @Column(name = "CREATED_AT", nullable = false , updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "DEL_YN", nullable = false , length = 1)
    public DelYn delYn;

    @PrePersist
    public void onPersist(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        delYn = DelYn.N;
    }

    @PreUpdate
    public void onUpdate(){
        updatedAt = LocalDateTime.now();
    }

    public void delete(){
        delYn = DelYn.Y;
        updatedAt = LocalDateTime.now();
    }

}