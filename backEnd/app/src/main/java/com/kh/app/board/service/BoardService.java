package com.kh.app.board.service;

import com.kh.app.board.dto.request.BoardSearchCondition;
import com.kh.app.board.dto.request.BoardWriteReqDto;
import com.kh.app.board.dto.response.BoardResDto;
import com.kh.app.board.entity.BoardEntity;
import com.kh.app.board.entity.BoardFileEntity;
import com.kh.app.board.repository.BoardFileRepository;
import com.kh.app.board.repository.BoardRepository;
import com.kh.app.common.entity.DelYn;
import com.kh.app.member.entity.MemberEntity;
import com.kh.app.aws.service.S3Service;
import com.kh.app.member.repository.MemberRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
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
        MemberEntity memberEntity = memberRepository
                .findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND ........"));

        // @Lob 설정 덕분에 이제 대용량 Base64 본문이 들어와도 튕기지 않고 무사통과합니다!
        BoardEntity boardEntity = reqDto.toEntity(memberEntity);
        boardRepository.save(boardEntity);

        String content = reqDto.getContent();

        if (content != null && content.contains("<img")) {
            Pattern pattern = Pattern.compile("<img[^>]*src=[\"']([^\"']*)[\"'][^>]*>");
            Matcher matcher = pattern.matcher(content);

            StringBuffer sb = new StringBuffer();
            int fileIndex = 0;

            while (matcher.find()) {
                if (fileList != null && fileIndex < fileList.size()) {
                    MultipartFile file = fileList.get(fileIndex);

                    if (file != null && !file.isEmpty()) {
                        log.info("[S3 업로드 가동] 파일명 : {}", file.getOriginalFilename());

                        // S3 버킷에 물리 저장 처리
                        String savedFilename = s3Service.upload(file, "board");

                        String s3KeyPath = savedFilename.startsWith("board/") ? savedFilename : "board/" + savedFilename;
                        String s3FullUrl = "https://" + bucketName + ".s3.ap-northeast-2.amazonaws.com/" + s3KeyPath;

                        BoardFileEntity boardFile = BoardFileEntity.builder()
                                .boardEntity(boardEntity)
                                .imageOriginName(file.getOriginalFilename())
                                .imageChangedName(savedFilename)
                                .boardFileSize(file.getSize())
                                .boardFileOrder(fileIndex)
                                .build();
                        boardFileRepository.save(boardFile);

                        String replacement = matcher.group().replace(matcher.group(1), s3FullUrl);
                        matcher.appendReplacement(sb, Matcher.quoteReplacement(replacement));

                        fileIndex++;
                        continue;
                    }
                }
                matcher.appendReplacement(sb, Matcher.quoteReplacement(matcher.group()));
            }
            matcher.appendTail(sb);
            content = sb.toString();
        }

        boardEntity.setContent(content);
        log.info("[S3 업로드 및 치환 성공 완료] boardId : {}", boardEntity.getId());
    }
}