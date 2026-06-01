package com.kh.app.message.service;

import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.message.dto.response.MessageListResDto;
import com.kh.app.message.entity.MessageEntity;
import com.kh.app.message.entity.MessageReadYn;
import com.kh.app.message.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public List<MessageListResDto> getMyMessages(String loginKey) {

        MemberEntity member = memberRepository.findByUsername(loginKey)
                .or(() -> memberRepository.findBySocialId(loginKey))
                .orElseThrow(() ->
                        new IllegalStateException("회원 정보가 존재하지 않습니다.")
                );

        return messageRepository
                .findAllByReceiver_IdAndDelYnOrderByReadYnAscCreatedAtDesc(
                        member.getId(),
                        DelYn.N
                )
                .stream()
                .map(MessageListResDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String loginKey) {

        MemberEntity member = memberRepository.findByUsername(loginKey)
                .or(() -> memberRepository.findBySocialId(loginKey))
                .orElseThrow(() ->
                        new IllegalStateException("회원 정보가 존재하지 않습니다.")
                );

        return messageRepository.countByReceiver_IdAndReadYnAndDelYn(
                member.getId(),
                MessageReadYn.N,
                DelYn.N
        );
    }

    public void read(Long messageId) {

        MessageEntity message = messageRepository.findById(messageId)
                .orElseThrow(() ->
                        new IllegalStateException("쪽지가 존재하지 않습니다.")
                );

        message.read();
    }

    public void delete(Long messageId) {

        MessageEntity message = messageRepository.findById(messageId)
                .orElseThrow(() ->
                        new IllegalStateException("쪽지가 존재하지 않습니다.")
                );

        message.delete();
    }
}