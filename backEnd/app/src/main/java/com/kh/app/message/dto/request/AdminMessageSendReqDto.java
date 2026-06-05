package com.kh.app.message.dto.request;

import com.kh.app.message.entity.MessageReasonType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminMessageSendReqDto {

    private Long receiverId;

    private String title;

    private String content;

    private MessageReasonType reasonType;
}