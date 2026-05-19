package com.kh.app.karte.service;

import com.kh.app.karte.repository.KarteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class KarteService {
    private final KarteRepository karteRepository;
}
