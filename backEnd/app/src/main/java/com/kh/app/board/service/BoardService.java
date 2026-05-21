package com.kh.app.board.service;

import com.kh.app.board.dto.request.BoardSearchCondition;
import com.kh.app.board.dto.request.BoardWriteReqDto;
import com.kh.app.board.dto.response.BoardResDto;
import com.kh.app.board.entity.BoardEntity;
import com.kh.app.board.entity.BoardFileEntity; // 깃허브 기준 board_image 테이블 매핑 엔티티
import com.kh.app.board.repository.BoardFileRepository; // boardFileRepository 주입
import com.kh.app.board.repository.BoardRepository;
import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.member.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class BoardService {

    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;
    private final BoardFileRepository boardFileRepository; // 파일 관리를 위해 주입 유지

    // 이미지가 실제로 저장될 로컬 하드디스크 경로 (폴더를 미리 만들어두지 않아도 코드가 자동 생성합니다)
    private final String uploadPath = "C:/upload/board/";

    public Page<BoardResDto> getList(String category, BoardSearchCondition condition, int page) {
        Pageable pageable = PageRequest.of(page, 10);
        System.out.println("BoardService.getList@@@@@servicedeee ");
        Page<BoardEntity> entityPage = boardRepository.getListByCategory(category, condition, pageable);
        return entityPage.map(BoardResDto::from);
    }

    @Transactional
    public void write(BoardWriteReqDto reqDto, List<MultipartFile> fileList, String username) throws IOException {
        // 1. 회원 정보 조회 (깃허브 기존 코드 방식 완벽 유지)
        MemberEntity memberEntity = memberRepository
                .findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND ........"));

        // 2. 먼저 게시글 엔티티 생성 및 영속화 (ID 발급 및 파일 연동을 위함)
        BoardEntity boardEntity = reqDto.toEntity(memberEntity);
        boardRepository.save(boardEntity);

        String content = reqDto.getContent();

        // 3. 파일 리스트가 존재할 때 로컬 디스크 저장 및 본문 <img> 태그 치환 처리
        if (fileList != null && !fileList.isEmpty()) {
            File folder = new File(uploadPath);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            // HTML 본문 내의 <img src="..."> 주소를 정밀하게 낚아채기 위한 정규식
            Pattern pattern = Pattern.compile("<img[^>]*src=[\"']([^\"']*)[\"'][^>]*>");
            Matcher matcher = pattern.matcher(content);

            StringBuffer sb = new StringBuffer();
            int fileIndex = 0;

            // 에디터 본문 속의 <img> 태그와 프론트엔드가 보낸 파일 객체들을 순서대로 매칭
            while (matcher.find() && fileIndex < fileList.size()) {
                MultipartFile file = fileList.get(fileIndex);

                if (!file.isEmpty()) {
                    log.info("[게시글 이미지 로컬 저장 시작] 파일명 : {}", file.getOriginalFilename());

                    // 파일명 중복을 피하기 위해 UUID 식별자 고유 파일명 생성
                    String originalFilename = file.getOriginalFilename();
                    String ext = originalFilename.substring(originalFilename.lastIndexOf("."));
                    String savedFilename = UUID.randomUUID().toString() + ext;

                    // 하드디스크 C:/upload/board/ 폴더에 물리 파일 저장
                    File targetFile = new File(uploadPath + savedFilename);
                    file.transferTo(targetFile);

                    // 웹 브라우저가 정적 이미지 리소스로 접근할 가상 주소 설정
                    String localWebUrl = "/uploads/board/" + savedFilename;

                    // 깃허브의 BoardFileEntity 테이블 구조에 맞춰 첨부파일 데이터베이스 기록 저장
                    BoardFileEntity boardFile = BoardFileEntity.builder()
                            .boardEntity(boardEntity)
                            .imageOriginName(originalFilename)
                            .imageChangedName(savedFilename)
                            .boardFileSize(file.getSize())
                            .boardFileOrder(fileIndex)
                            .build();
                    boardFileRepository.save(boardFile);

                    // 핵심: React-Quill 본문 HTML 내부의 임시 src 주소를 서버의 웹 정적 주소로 일괄 치환
                    String replacement = matcher.group().replace(matcher.group(1), localWebUrl);
                    matcher.appendReplacement(sb, Matcher.quoteReplacement(replacement));
                }
                fileIndex++;
            }
            matcher.appendTail(sb);
            content = sb.toString(); // 매핑 가공이 완벽하게 끝난 최종 HTML 텍스트
        }

        // 4. 가공 완료된 본문을 엔티티에 최종 업데이트 반영
        boardEntity.setContent(content);

        log.info("[로컬 디스크 기반 게시글 작성 완료] boardId : {}, writer : {}", boardEntity.getId(), username);
    }
}