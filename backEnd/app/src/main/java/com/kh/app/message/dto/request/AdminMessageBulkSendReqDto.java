package com.kh.app.message.dto.request;

import com.kh.app.member.entity.MemberMarketingAgreeYn;
import com.kh.app.member.entity.MemberRole;
import com.kh.app.member.entity.MemberStatus;
import com.kh.app.message.entity.MessageReasonType;
import com.kh.app.message.entity.MessageTargetType;
import com.kh.app.pet.entity.PetType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AdminMessageBulkSendReqDto {

    private MessageTargetType targetType;

    private List<Long> receiverIds;

    private String searchType;
    private String keyword;

    private PetType petType;
    private MemberMarketingAgreeYn marketingAgreeYn;
    private MemberStatus status;
    private MemberRole role;
    private Boolean adminOnly;

    private String title;
    private String content;
    private MessageReasonType reasonType;
}