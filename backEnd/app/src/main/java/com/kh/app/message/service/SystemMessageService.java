package com.kh.app.message.service;

import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.message.entity.*;
import com.kh.app.message.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class SystemMessageService {

    private final MemberRepository memberRepository;
    private final MessageRepository messageRepository;

    public void sendByAdmin(
            String adminUsername,
            MemberEntity receiver,
            MessageReasonType reasonType,
            String title,
            String content
    ) {

        MemberEntity admin = memberRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new IllegalStateException("관리자를 찾을 수 없습니다."));

        MessageEntity message = MessageEntity.builder()
                .sender(admin)
                .receiver(receiver)
                .title(title)
                .content(content)
                .reasonType(reasonType)
                .readYn(MessageReadYn.N)
                .build();

        messageRepository.save(message);
    }
}