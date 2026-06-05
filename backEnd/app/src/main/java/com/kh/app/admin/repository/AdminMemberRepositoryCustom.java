package com.kh.app.admin.repository;

import com.kh.app.admin.dto.request.AdminMemberSearchReqDto;
import com.kh.app.admin.dto.response.AdminMemberListResDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AdminMemberRepositoryCustom {

    Page<AdminMemberListResDto> searchMembers(AdminMemberSearchReqDto reqDto, Pageable pageable);
    List<Long> findMemberIdsForMessage(
            AdminMemberSearchReqDto reqDto
    );
}