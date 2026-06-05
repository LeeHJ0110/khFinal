package com.kh.app.message.service;

import com.kh.app.admin.dto.request.AdminMemberSearchReqDto;
import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.message.dto.request.AdminMessageBulkSendReqDto;
import com.kh.app.message.dto.request.AdminMessageSendReqDto;
import com.kh.app.message.dto.response.MessageListResDto;
import com.kh.app.message.entity.MessageEntity;
import com.kh.app.message.entity.MessageReadYn;
import com.kh.app.message.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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

    public void read(Long messageId, String loginKey) {

        MemberEntity member = findLoginMember(loginKey);

        MessageEntity message = messageRepository.findById(messageId)
                .orElseThrow(() ->
                        new IllegalStateException("쪽지가 존재하지 않습니다.")
                );

        if (!message.getReceiver().getId().equals(member.getId())) {
            throw new IllegalStateException("본인의 쪽지만 읽을 수 있습니다.");
        }

        message.read();
    }

    public void delete(Long messageId, String loginKey) {

        MemberEntity member = findLoginMember(loginKey);

        MessageEntity message = messageRepository.findById(messageId)
                .orElseThrow(() ->
                        new IllegalStateException("쪽지가 존재하지 않습니다.")
                );

        if (!message.getReceiver().getId().equals(member.getId())) {
            throw new IllegalStateException("본인의 쪽지만 삭제할 수 있습니다.");
        }

        message.delete();
    }

    private MemberEntity findLoginMember(String loginKey) {
        return memberRepository.findByUsername(loginKey)
                .or(() -> memberRepository.findBySocialId(loginKey))
                .orElseThrow(() ->
                        new IllegalStateException("회원 정보가 존재하지 않습니다.")
                );
    }

    public void sendMessage(
            AdminMessageSendReqDto dto,
            String loginKey
    ) {

        MemberEntity sender = findLoginMember(loginKey);

        MemberEntity receiver = memberRepository.findById(dto.getReceiverId())
                .orElseThrow(() ->
                        new IllegalStateException("수신자가 존재하지 않습니다.")
                );

        MessageEntity message = MessageEntity.builder()
                .sender(sender)
                .receiver(receiver)
                .title(dto.getTitle())
                .content(dto.getContent())
                .reasonType(dto.getReasonType())
                .readYn(MessageReadYn.N)
                .build();

        messageRepository.save(message);
    }

    @Transactional(readOnly = true)
    public List<MessageListResDto> getSentMessages(
            String loginKey
    ) {

        MemberEntity sender = findLoginMember(loginKey);

        return messageRepository
                .findAllBySender_IdAndDelYnOrderByCreatedAtDesc(
                        sender.getId(),
                        DelYn.N
                )
                .stream()
                .map(MessageListResDto::from)
                .toList();
    }

    @Transactional
    public void bulkSendMessage(
            AdminMessageBulkSendReqDto reqDto,
            String loginKey
    ) {

        List<Long> receiverIds = new ArrayList<>();
        MemberEntity sender = findLoginMember(loginKey);

        switch (reqDto.getTargetType()) {

            case SELECTED -> {
                receiverIds.addAll(reqDto.getReceiverIds());
            }

            case SEARCH_RESULT -> {

                AdminMemberSearchReqDto searchReqDto =
                        new AdminMemberSearchReqDto();

                searchReqDto.setSearchType(reqDto.getSearchType());
                searchReqDto.setKeyword(reqDto.getKeyword());
                searchReqDto.setPetType(reqDto.getPetType());
                searchReqDto.setMarketingAgreeYn(
                        reqDto.getMarketingAgreeYn() != null
                                ? reqDto.getMarketingAgreeYn().name()
                                : null
                );
                searchReqDto.setStatus(reqDto.getStatus());
                searchReqDto.setRole(reqDto.getRole());
                searchReqDto.setAdminOnly(reqDto.getAdminOnly());

                receiverIds.addAll(
                        memberRepository.findMemberIdsForMessage(searchReqDto)
                );
            }

            case ALL -> {

                receiverIds.addAll(
                        memberRepository.findAll()
                                .stream()
                                .map(MemberEntity::getId)
                                .toList()
                );
            }
        }

        for (Long receiverId : receiverIds) {

            MemberEntity receiver = memberRepository.findById(receiverId)
                    .orElseThrow(() ->
                            new IllegalStateException("회원이 존재하지 않습니다.")
                    );

            MessageEntity message = MessageEntity.builder()
                    .receiver(receiver)
                    .sender(sender)
                    .title(reqDto.getTitle())
                    .content(reqDto.getContent())
                    .reasonType(reqDto.getReasonType())
                    .readYn(MessageReadYn.N)
                    .build();

            messageRepository.save(message);
        }
    }
}