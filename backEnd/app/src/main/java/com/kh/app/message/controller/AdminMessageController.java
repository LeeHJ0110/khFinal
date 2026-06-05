package com.kh.app.message.controller;

import com.kh.app.message.dto.request.AdminMessageBulkSendReqDto;
import com.kh.app.message.dto.request.AdminMessageSendReqDto;
import com.kh.app.message.dto.response.MessageListResDto;
import com.kh.app.message.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/message")
@RequiredArgsConstructor
public class AdminMessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<Void> send(
            @RequestBody AdminMessageSendReqDto dto,
            Authentication authentication
    ) {

        messageService.sendMessage(
                dto,
                authentication.getName()
        );

        return ResponseEntity.ok().build();
    }

    @GetMapping("/sent")
    public ResponseEntity<List<MessageListResDto>> getSentMessages(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                messageService.getSentMessages(
                        authentication.getName()
                )
        );
    }

    @PostMapping("/bulk")
    public ResponseEntity<Void> bulkSend(
            @RequestBody AdminMessageBulkSendReqDto reqDto,
            Authentication authentication
    ) {

        messageService.bulkSendMessage(
                reqDto,
                authentication.getName()
        );

        return ResponseEntity.ok().build();
    }
}