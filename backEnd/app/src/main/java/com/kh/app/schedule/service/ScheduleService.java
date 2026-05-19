package com.kh.app.schedule.service;

import com.kh.app.schedule.repository.ScheduleRepository;
import com.kh.app.schedule.repository.TrainingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class ScheduleService {
    private final ScheduleRepository scheduleRepository;
    private final TrainingRepository trainingRepository;
}
