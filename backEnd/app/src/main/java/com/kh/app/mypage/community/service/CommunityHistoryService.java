package com.kh.app.mypage.community.service;

import com.kh.app.board.entity.BoardCategory;
import com.kh.app.board.repository.BoardRepository;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.mypage.community.dto.response.CommunityHistoryBoardResDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommunityHistoryService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    public Page<CommunityHistoryBoardResDto> getMyFreeBoards(
            String loginKey,
            Pageable pageable
    ) {
        MemberEntity member = getLoginMember(loginKey);

        return boardRepository
                .findByWriter_IdAndCategoryOrderByCreatedAtDesc(
                        member.getId(),
                        BoardCategory.FREE,
                        pageable
                )
                .map(CommunityHistoryBoardResDto::from);
    }

    public Page<CommunityHistoryBoardResDto> getMyProductReviews(
            String loginKey,
            Pageable pageable
    ) {
        MemberEntity member = getLoginMember(loginKey);

        return boardRepository
                .findByWriter_IdAndCategoryOrderByCreatedAtDesc(
                        member.getId(),
                        BoardCategory.PRODUCT_REVIEW,
                        pageable
                )
                .map(CommunityHistoryBoardResDto::from);
    }

    public Page<CommunityHistoryBoardResDto> getMyFacilityReviews(
            String loginKey,
            Pageable pageable
    ) {
        MemberEntity member = getLoginMember(loginKey);

        return boardRepository
                .findByWriter_IdAndCategoryOrderByCreatedAtDesc(
                        member.getId(),
                        BoardCategory.FAC_REVIEW,
                        pageable
                )
                .map(CommunityHistoryBoardResDto::from);
    }

    private MemberEntity getLoginMember(String loginKey) {
        return memberRepository.findByUsername(loginKey)
                .or(() -> memberRepository.findBySocialId(loginKey))
                .orElseThrow(() ->
                        new IllegalStateException("회원 정보가 존재하지 않습니다.")
                );
    }
}