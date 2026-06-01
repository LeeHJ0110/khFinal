package com.kh.app.message.repository;

import com.kh.app.common.entity.DelYn;
import com.kh.app.message.entity.MessageEntity;
import com.kh.app.message.entity.MessageReadYn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {

    List<MessageEntity> findAllByReceiver_IdAndDelYnOrderByReadYnAscCreatedAtDesc(
            Long receiverId,
            DelYn delYn
    );

    long countByReceiver_IdAndReadYnAndDelYn(
            Long receiverId,
            MessageReadYn readYn,
            DelYn delYn
    );
}