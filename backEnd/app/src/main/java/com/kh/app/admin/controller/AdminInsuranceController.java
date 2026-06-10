package com.kh.app.admin.controller;

import com.kh.app.admin.dto.request.AdminInsuranceBulkReqDto;
import com.kh.app.admin.dto.response.AdminInsuranceDetailResDto;
import com.kh.app.admin.dto.response.AdminInsuranceListResDto;
import com.kh.app.admin.service.AdminInsuranceService;
import com.kh.app.petinsurance.entity.PetInsuranceApproveStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/pet-insurances")
@RequiredArgsConstructor
public class AdminInsuranceController {

    private final AdminInsuranceService adminInsuranceService;

    @GetMapping
    public Page<AdminInsuranceListResDto> getApplications(
            @RequestParam(defaultValue = "WAITING") PetInsuranceApproveStatus status,
            Pageable pageable
    ) {
        return adminInsuranceService.getApplications(status, pageable);
    }

    @GetMapping("/{applicationId}")
    public AdminInsuranceDetailResDto getApplicationDetail(@PathVariable Long applicationId) {
        return adminInsuranceService.getApplicationDetail(applicationId);
    }

    @PutMapping("/{applicationId}/approve")
    public void approve(@PathVariable Long applicationId,
                        Authentication authentication) {

        adminInsuranceService.approve(
                applicationId,
                authentication.getName()
        );
    }

    @PutMapping("/{applicationId}/reject")
    public void reject(@PathVariable Long applicationId,
                       Authentication authentication) {
        adminInsuranceService.reject(applicationId,
                authentication.getName());
    }

    @PutMapping("/approve")
    public void approveBulk(@RequestBody AdminInsuranceBulkReqDto reqDto,
                            Authentication authentication) {
        adminInsuranceService.approveBulk(reqDto,
                authentication.getName());
    }

    @PutMapping("/reject")
    public void rejectBulk(@RequestBody AdminInsuranceBulkReqDto reqDto,
                           Authentication authentication) {
        adminInsuranceService.rejectBulk(reqDto,
                authentication.getName());
    }
}