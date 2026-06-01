package com.kh.app.message.controller;

import com.kh.app.message.dto.response.MessageListResDto;
import com.kh.app.message.service.MessageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "쪽지", description = "쪽지 API")
@RestController
@RequestMapping("/api/message")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping
    public ResponseEntity<List<MessageListResDto>> getMyMessages(
            Authentication authentication
    ) {

        String loginKey = authentication.getName();

        return ResponseEntity.ok(
                messageService.getMyMessages(loginKey)
        );
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<Void> read(
            @PathVariable Long messageId
    ) {

        messageService.read(messageId);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long messageId
    ) {

        messageService.delete(messageId);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(
            Authentication authentication
    ) {
        String loginKey = authentication.getName();

        return ResponseEntity.ok(
                messageService.getUnreadCount(loginKey)
        );
    }
}