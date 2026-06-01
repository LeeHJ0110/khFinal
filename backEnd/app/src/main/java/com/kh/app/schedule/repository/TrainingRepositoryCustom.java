package com.kh.app.schedule.repository;

import java.time.LocalDateTime;

public interface TrainingRepositoryCustom {
    boolean existsByDate(LocalDateTime start, LocalDateTime end);
}
