package com.kh.app.karte.repository;

import com.kh.app.karte.dto.response.KarteListResDto;
import com.kh.app.member.entity.MemberEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface KarteRepositoryCustom {
    Page<KarteListResDto> findKarteList(PageRequest pageRequest, MemberEntity member);
}
