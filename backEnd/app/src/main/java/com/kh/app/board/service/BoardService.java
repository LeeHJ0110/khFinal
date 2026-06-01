package com.kh.app.board.service;

import com.kh.app.board.dto.request.BoardSearchCondition;
import com.kh.app.board.dto.request.BoardWriteReqDto;
import com.kh.app.board.dto.response.BoardDetailResDto;
import com.kh.app.board.dto.response.BoardFileResDto;
import com.kh.app.board.dto.response.BoardResDto;
import com.kh.app.board.entity.BoardEntity;
import com.kh.app.board.entity.BoardFileEntity;
import com.kh.app.board.exception.BoardErrorCode;
import com.kh.app.board.repository.BoardFileRepository;
import com.kh.app.board.repository.BoardRepository;
import com.kh.app.common.entity.DelYn;
import com.kh.app.common.exception.CustomException;
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
    public BoardDetailResDto getBoardDetail(Long id) {
        BoardEntity entity = boardRepository.findById(id)
                .orElseThrow(() -> new CustomException(BoardErrorCode.BOARD_NOT_FOUND));

        entity.increaseHit();

        List<BoardFileResDto> fileList = boardFileRepository.findByBoardEntity(entity)
                .stream()
                .map(fileEntity -> {
                    String fileUrl = s3Service.getFileUrl(fileEntity.getImageChangedName());
                    return BoardFileResDto.from(fileEntity, fileUrl);
                })
                .toList();

        return BoardDetailResDto.from(entity, fileList);
    }

    @Transactional
    public void write(BoardWriteReqDto reqDto, List<MultipartFile> fileList, String username) throws IOException {
        MemberEntity memberEntity = memberRepository
                .findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND ........"));

        BoardEntity boardEntity = reqDto.toEntity(memberEntity);
        boardRepository.save(boardEntity);

        String content = processImagesAndFiles(boardEntity, reqDto.getContent(), fileList);
        boardEntity.setContent(content);
        log.info("[S3 업로드 및 치환 성공 완료] boardId : {}", boardEntity.getId());
    }

    @Transactional
    public void update(Long boardId, BoardWriteReqDto reqDto, List<MultipartFile> fileList, String username) throws IOException {
        BoardEntity boardEntity = boardRepository.findById(boardId)
                .orElseThrow(() -> new EntityNotFoundException("BOARD NOT FOUND ........"));

        // 작성자 본인 검증
        if (!boardEntity.getWriter().getUsername().equals(username)) {
            throw new IllegalStateException("NO PERMISSION TO UPDATE BOARD ........");
        }

        // 제목 업데이트
        boardEntity.setTitle(reqDto.getTitle());

        // 카테고리 업데이트
        com.kh.app.board.entity.BoardCategory categoryEnum = (reqDto.getBoardCategory() != null)
                ? com.kh.app.board.entity.BoardCategory.valueOf(reqDto.getBoardCategory())
                : com.kh.app.board.entity.BoardCategory.FREE;
        boardEntity.setCategory(categoryEnum);

        // 서브카테고리 업데이트
        com.kh.app.board.entity.BoardSubCategory subCategoryEnum = (reqDto.getBoardSubCategory() != null)
                ? com.kh.app.board.entity.BoardSubCategory.valueOf(reqDto.getBoardSubCategory())
                : null;
        boardEntity.setSubCategory(subCategoryEnum);

        // 평점 설정 (후기게시판 전용)
        if ("PRODUCT_REVIEW".equals(categoryEnum.name()) || "FAC_REVIEW".equals(categoryEnum.name())) {
            boardEntity.setStars(reqDto.getBoardStars() != null ? reqDto.getBoardStars() : 5L);
        } else {
            boardEntity.setStars(5L);
        }

        // 새 이미지 파싱 및 S3 업로드 적용
        String updatedContent = processImagesAndFiles(boardEntity, reqDto.getContent(), fileList);
        boardEntity.setContent(updatedContent);
        log.info("[S3 업로드 및 수정 완료] boardId : {}", boardEntity.getId());
    }

    private String processImagesAndFiles(BoardEntity boardEntity, String content, List<MultipartFile> fileList) throws IOException {
        if (content == null || !content.contains("<img")) {
            return content;
        }

        Pattern pattern = Pattern.compile("<img[^>]*src=[\"']([^\"']*)[\"'][^>]*>");
        Matcher matcher = pattern.matcher(content);

        StringBuffer sb = new StringBuffer();
        int fileIndex = 0;

        while (matcher.find()) {
            String src = matcher.group(1);


            if (src != null && src.startsWith("data:image/")) {
                int commaIndex = src.indexOf(",");
                if (commaIndex != -1) {
                    String metadata = src.substring(0, commaIndex);
                    String base64Data = src.substring(commaIndex + 1);

                    String contentType = "image/png";
                    String ext = ".png";

                    Pattern metaPattern = Pattern.compile("data:(image/[^;]+);base64");
                    Matcher metaMatcher = metaPattern.matcher(metadata);
                    if (metaMatcher.find()) {
                        contentType = metaMatcher.group(1);
                        if (contentType.equals("image/jpeg") || contentType.equals("image/jpg")) {
                            ext = ".jpg";
                        } else if (contentType.equals("image/gif")) {
                            ext = ".gif";
                        } else if (contentType.equals("image/webp")) {
                            ext = ".webp";
                        } else if (contentType.equals("image/png")) {
                            ext = ".png";
                        } else {
                            int slashIndex = contentType.indexOf("/");
                            if (slashIndex != -1) {
                                ext = "." + contentType.substring(slashIndex + 1);
                            }
                        }
                    }

                    try {
                        byte[] decodedBytes = java.util.Base64.getDecoder().decode(base64Data.trim());
                        String originalFilename = "embedded_image_" + (fileIndex + 1) + ext;
                        log.info("[S3 Base64 업로드 가동] 파일명 : {}", originalFilename);

                        MultipartFile multipartFile = new CustomMultipartFile(decodedBytes, "file", originalFilename, contentType);
                        String savedFilename = s3Service.upload(multipartFile, "board");

                        String s3KeyPath = savedFilename.startsWith("board/") ? savedFilename : "board/" + savedFilename;
                        String s3FullUrl = "https://" + bucketName + ".s3.ap-northeast-2.amazonaws.com/" + s3KeyPath;

                        BoardFileEntity boardFile = BoardFileEntity.builder()
                                .boardEntity(boardEntity)
                                .imageOriginName(originalFilename)
                                .imageChangedName(savedFilename)
                                .boardFileSize((long) decodedBytes.length)
                                .boardFileOrder(fileIndex)
                                .build();
                        boardFileRepository.save(boardFile);

                        String replacement = matcher.group().replace(src, s3FullUrl);
                        matcher.appendReplacement(sb, Matcher.quoteReplacement(replacement));

                        fileIndex++;
                        continue;
                    } catch (IllegalArgumentException e) {
                        log.error("Failed to decode Base64 image", e);
                    }
                }
            }

            if (fileList != null && fileIndex < fileList.size()) {
                MultipartFile file = fileList.get(fileIndex);

                if (file != null && !file.isEmpty()) {
                    log.info("[S3 파일 업로드 가동] 파일명 : {}", file.getOriginalFilename());

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

                    String replacement = matcher.group().replace(src, s3FullUrl);
                    matcher.appendReplacement(sb, Matcher.quoteReplacement(replacement));

                    fileIndex++;
                    continue;
                }
            }
            matcher.appendReplacement(sb, Matcher.quoteReplacement(matcher.group()));
        }
        matcher.appendTail(sb);
        return sb.toString();
    }

    @Transactional
    public void delete(Long id) {
        BoardEntity boardEntity = boardRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Board Not Found......"));

        boardEntity.delete();

        log.info("[게시글 소프트 딜리트 완료] boardId : {}, 상태: {}", id, boardEntity.getDelYn());
    }
}