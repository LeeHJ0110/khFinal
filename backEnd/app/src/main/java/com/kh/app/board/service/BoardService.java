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
import com.kh.app.aws.service.S3Service; // S3 서비스 주입
import com.kh.app.board.entity.BoardFileEntity; // board_image 테이블 매핑 엔티티
import com.kh.app.member.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Value; // 버킷 도메인 조립용
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    private final BoardFileRepository boardFileRepository;
    private final S3Service s3Service;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

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

        // 3. 파일 리스트가 존재할 때 S3 업로드 및 본문 <img> 태그 치환 처리
        if (fileList != null && !fileList.isEmpty()) {

            // HTML 본문 내의 <img src="..."> 주소를 정밀하게 조준하는 정규식
            Pattern pattern = Pattern.compile("<img[^>]*src=[\"']([^\"']*)[\"'][^>]*>");
            Matcher matcher = pattern.matcher(content);

            StringBuffer sb = new StringBuffer();
            int fileIndex = 0;

            // 에디터 본문 속의 <img> 태그 개수와 프론트엔드가 보낸 파일 개수를 순서대로 매칭하며 루프 실행
            while (matcher.find() && fileIndex < fileList.size()) {
                MultipartFile file = fileList.get(fileIndex);

                if (!file.isEmpty()) {
                    log.info("[게시글 이미지 S3 업로드 시작] 파일명 : {}", file.getOriginalFilename());

                    // S3Service를 활용하여 S3 인스턴스에 파일 업로드하고 저장된 파일명(s3key) 리턴 받기
                    String savedFilename = s3Service.upload(file, "board");

                    // 브라우저가 다이렉트로 S3 우회 접근할 수 있는 Full AWS URL 생성
                    String s3FullUrl = "https://" + bucketName + ".s3.ap-northeast-2.amazonaws.com/board/" + savedFilename;

                    // 깃허브의 BoardFileEntity 구조에 맞춰 연관 데이터 세팅 후 DB 저장
                    // 부모 필드(uploadAt, delYn)는 @PrePersist가 채워주므로 지우고 자식 변수명(.boardEntity)만 매핑
                    BoardFileEntity boardFile = BoardFileEntity.builder()
                            .boardEntity(boardEntity)
                            .imageOriginName(file.getOriginalFilename())
                            .imageChangedName(savedFilename)
                            .boardFileSize(file.getSize())
                            .boardFileOrder(fileIndex)
                            .build();
                    boardFileRepository.save(boardFile);

                    log.info("[게시글 이미지 S3 업로드 완료] S3 URL : {}", s3FullUrl);

                    // 핵심: React-Quill 본문 HTML 내부의 임시 src 주소를 실제 S3 원본 웹 주소로 교체
                    String replacement = matcher.group().replace(matcher.group(1), s3FullUrl);
                    matcher.appendReplacement(sb, Matcher.quoteReplacement(replacement));
                }
                fileIndex++;
            }
            matcher.appendTail(sb);
            content = sb.toString(); // S3 원본 주소 링크로 완전히 갈아끼워진 HTML 텍스트 완성
        }

        // 4. 가공 완료된 본문을 엔티티에 최종 업데이트 반영
        boardEntity.setContent(content);

        log.info("[S3 기반 게시글 작성 완료] boardId : {}, writer : {}", boardEntity.getId(), username);
    }
}
