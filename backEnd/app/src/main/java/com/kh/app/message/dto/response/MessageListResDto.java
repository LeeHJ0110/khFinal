package com.kh.app.message.dto.response;

import com.kh.app.message.entity.MessageEntity;
import com.kh.app.message.entity.MessageReadYn;
import com.kh.app.message.entity.MessageReasonType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MessageListResDto {

    private Long id;

    private String senderNickname;

    private String title;

    private String content;

    private MessageReasonType reasonType;

    private MessageReadYn readYn;

    private String createdAt;

    public static MessageListResDto from(MessageEntity message) {
        return MessageListResDto.builder()
                .id(message.getId())
                .senderNickname(message.getSenderNickname())
                .title(message.getTitle())
                .content(message.getContent())
                .reasonType(message.getReasonType())
                .readYn(message.getReadYn())
                .createdAt(
                        message.getCreatedAt() != null
                                ? message.getCreatedAt().toString()
                                : null
                )
                .build();
    }
}