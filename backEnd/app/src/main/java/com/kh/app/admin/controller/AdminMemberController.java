package com.kh.app.admin.controller;

import com.kh.app.admin.dto.request.AdminMemberRoleUpdateReqDto;
import com.kh.app.admin.dto.request.AdminMemberSearchReqDto;
import com.kh.app.admin.dto.request.AdminMemberStatusUpdateReqDto;
import com.kh.app.admin.dto.response.AdminMeResDto;
import com.kh.app.admin.dto.response.AdminMemberDetailResDto;
import com.kh.app.admin.dto.response.AdminMemberListResDto;
import com.kh.app.admin.service.AdminMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/admin/members")
@RequiredArgsConstructor
public class AdminMemberController {

    private final AdminMemberService adminMemberService;

    @GetMapping
    public Page<AdminMemberListResDto> searchMembers(
            AdminMemberSearchReqDto reqDto,
            Pageable pageable
    ) {
        return adminMemberService.searchMembers(reqDto, pageable);
    }

    @GetMapping("/profile/me")
    public AdminMeResDto getAdminMe(Authentication authentication) {
        return adminMemberService.getAdminMe(authentication.getName());
    }

    @GetMapping("/{memberId}")
    public AdminMemberDetailResDto getMemberDetail(@PathVariable Long memberId) {
        return adminMemberService.getMemberDetail(memberId);
    }

    @PutMapping("/{memberId}/status")
    public void updateMemberStatus(
            @PathVariable Long memberId,
            @RequestBody AdminMemberStatusUpdateReqDto reqDto
    ) {
        adminMemberService.updateMemberStatus(memberId, reqDto);
    }

    @PutMapping("/{memberId}/role")
    public void updateMemberRole(
            @PathVariable Long memberId,
            @RequestBody AdminMemberRoleUpdateReqDto reqDto
    ) {
        adminMemberService.updateMemberRole(memberId, reqDto);
    }

    @PutMapping("/{memberId}/nickname/clean")
    public String cleanMemberNickname(@PathVariable Long memberId) {
        return adminMemberService.cleanMemberNickname(memberId);
    }
}