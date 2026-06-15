package com.kh.app.member.service;

import com.kh.app.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class PhoneAuthService {

    private final MemberRepository memberRepository;
    private final StringRedisTemplate redisTemplate;
    private final SmsService smsService;
    private static final String AUTH_CODE_PREFIX = "phone:auth:code:";
    private static final String AUTH_DONE_PREFIX = "phone:auth:done:";

    public void sendCode(String phone) {
        phone = normalizePhone(phone);

        if (memberRepository.existsByPhone(phone)) {
            throw new IllegalStateException("이미 가입된 전화번호입니다.");
        }

        String code = String.format("%06d", new Random().nextInt(1000000));

        redisTemplate.opsForValue().set(
                AUTH_CODE_PREFIX + phone,
                code,
                Duration.ofMinutes(5)
        );

        redisTemplate.delete(AUTH_DONE_PREFIX + phone);

        smsService.sendAuthCode(phone, code);
    }

    public void verifyCode(String phone, String code) {
        phone = normalizePhone(phone);

        String savedCode = redisTemplate.opsForValue().get(AUTH_CODE_PREFIX + phone);

        if (savedCode == null) {
            throw new IllegalStateException("인증번호를 먼저 발송했거나 인증번호가 만료되었습니다.");
        }

        if (!savedCode.equals(code)) {
            throw new IllegalStateException("인증번호가 일치하지 않습니다.");
        }

        redisTemplate.opsForValue().set(
                AUTH_DONE_PREFIX + phone,
                "Y",
                Duration.ofMinutes(10)
        );

        redisTemplate.delete(AUTH_CODE_PREFIX + phone);
    }

    public boolean isVerified(String phone) {
        phone = normalizePhone(phone);

        String verified = redisTemplate.opsForValue().get(AUTH_DONE_PREFIX + phone);

        return "Y".equals(verified);
    }

    private String normalizePhone(String phone) {
        if (phone == null) {
            return null;
        }

        return phone.replaceAll("[^0-9]", "");
    }
    public void clearVerified(String phone) {
        phone = normalizePhone(phone);

        redisTemplate.delete(AUTH_DONE_PREFIX + phone);
    }
}