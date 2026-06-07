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
import com.kh.app.member.entity.MemberRole;
import com.kh.app.aws.service.S3Service;
import com.kh.app.member.repository.MemberRepository;
import com.kh.app.board.dto.response.BoardReplyResDto;
import com.kh.app.board.entity.BoardReplyEntity;
import com.kh.app.board.repository.BoardReplyRepository;
import com.kh.app.board.entity.BoardLikeEntity;
import com.kh.app.board.repository.BoardLikeRepository;
import com.kh.app.board.dto.response.BoardLikeResDto;
import com.kh.app.board.dto.response.NaverNewsResDto;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.web.util.UriComponentsBuilder;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.ArrayList;
import java.time.format.DateTimeFormatter;
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
    private final BoardReplyRepository boardReplyRepository;
    private final BoardLikeRepository boardLikeRepository;
    private final S3Service s3Service;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${naver.client-id}")
    private String naverClientId;

    @Value("${naver.client-secret}")
    private String naverClientSecret;

    public Page<BoardResDto> getList(String category, BoardSearchCondition condition, int page) {
        Pageable pageable = PageRequest.of(page, 10);
        System.out.println("BoardService.getList@@@@@servicedeee ");
        Page<BoardEntity> entityPage = boardRepository.getListByCategory(category, condition, pageable);
        return entityPage.map(entity -> {
            long replyCount = boardReplyRepository.countByBoardAndDelYn(entity, DelYn.N);
            long likeCount = boardLikeRepository.countByBoard(entity);
            return BoardResDto.from(entity, replyCount, likeCount);
        });
    }

    @Transactional
    public BoardDetailResDto getBoardDetail(Long id, String username) {
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

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");

        // 1. 최상위 댓글 조회
        List<BoardReplyEntity> rootReplies = boardReplyRepository.findByBoardAndParentIsNullOrderByCreatedAtAsc(entity);

        // 2. DTO 변환 및 대댓글 매핑 (부모 댓글이 삭제되었고 대댓글 또한 삭제되었거나 존재하지 않는다면 필터링)
        List<BoardReplyResDto> replyList = rootReplies.stream()
                .filter(reply -> {
                    // 부모 댓글이 삭제되지 않은 경우 노출
                    if (reply.getDelYn() == DelYn.N) {
                        return true;
                    }
                    // 부모 댓글이 삭제된 경우, 대댓글 중 삭제되지 않은 것이 하나라도 있으면 노출 (그렇지 않으면 완전히 숨김)
                    return reply.getChildren().stream()
                            .anyMatch(child -> child.getDelYn() == DelYn.N);
                })
                .map(reply -> {
                    List<BoardReplyResDto> childReplies = reply.getChildren().stream()
                            .map(child -> {
                                String childContent = child.getDelYn() == DelYn.Y ? "삭제된 댓글입니다." : child.getContent();
                                String childNickname = child.getDelYn() == DelYn.Y ? "" : child.getMember().getNickname();
                                Long childLevel = child.getDelYn() == DelYn.Y ? 0L : child.getMember().getLevelExp();
                                String childProfileUrl = child.getDelYn() == DelYn.Y ? "/images/default-profile.png" : s3Service.getFileUrl(child.getMember().getProfileImageUrl());
                                if (childProfileUrl == null || childProfileUrl.isBlank()) {
                                    childProfileUrl = "/images/default-profile.png";
                                }
                                Boolean childIsAuthor = child.getDelYn() == DelYn.Y ? false : child.getMember().getId().equals(entity.getWriter().getId());

                                return BoardReplyResDto.builder()
                                        .id(child.getId())
                                        .writerNickname(childNickname)
                                        .writerLevel(childLevel)
                                        .content(childContent)
                                        .createdAt(child.getCreatedAt() != null ? child.getCreatedAt().format(formatter) : "")
                                        .profileImageUrl(childProfileUrl)
                                        .isAuthor(childIsAuthor)
                                        .build();
                            }).toList();

                    String parentContent = reply.getDelYn() == DelYn.Y ? "삭제된 댓글입니다." : reply.getContent();
                    String parentNickname = reply.getDelYn() == DelYn.Y ? "" : reply.getMember().getNickname();
                    Long parentLevel = reply.getDelYn() == DelYn.Y ? 0L : reply.getMember().getLevelExp();
                    String parentProfileUrl = reply.getDelYn() == DelYn.Y ? "/images/default-profile.png" : s3Service.getFileUrl(reply.getMember().getProfileImageUrl());
                    if (parentProfileUrl == null || parentProfileUrl.isBlank()) {
                        parentProfileUrl = "/images/default-profile.png";
                    }
                    Boolean parentIsAuthor = reply.getDelYn() == DelYn.Y ? false : reply.getMember().getId().equals(entity.getWriter().getId());

                    return BoardReplyResDto.builder()
                            .id(reply.getId())
                            .writerNickname(parentNickname)
                            .writerLevel(parentLevel)
                            .content(parentContent)
                            .createdAt(reply.getCreatedAt() != null ? reply.getCreatedAt().format(formatter) : "")
                            .profileImageUrl(parentProfileUrl)
                            .isAuthor(parentIsAuthor)
                            .replies(childReplies)
                            .build();
                }).toList();

        String writerProfileUrl = s3Service.getFileUrl(entity.getWriter().getProfileImageUrl());
        if (writerProfileUrl == null || writerProfileUrl.isBlank()) {
            writerProfileUrl = "/images/default-profile.png";
        }

        long likeCount = boardLikeRepository.countByBoard(entity);
        boolean isLiked = false;
        if (username != null && !username.isBlank()) {
            MemberEntity memberEntity = memberRepository.findByUsernameAndDelYn(username, DelYn.N).orElse(null);
            if (memberEntity != null) {
                isLiked = boardLikeRepository.existsByBoardAndMember(entity, memberEntity);
            }
        }

        return BoardDetailResDto.from(entity, fileList, replyList, writerProfileUrl, likeCount, isLiked);
    }


    @Transactional
    public void write(BoardWriteReqDto reqDto, List<MultipartFile> fileList, String username) throws IOException {
        MemberEntity memberEntity = memberRepository
                .findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND ........"));

        com.kh.app.board.entity.BoardCategory categoryEnum = (reqDto.getBoardCategory() != null)
                ? com.kh.app.board.entity.BoardCategory.valueOf(reqDto.getBoardCategory())
                : com.kh.app.board.entity.BoardCategory.FREE;

        if (categoryEnum == com.kh.app.board.entity.BoardCategory.FAQ) {
            if (memberEntity.getRole() != MemberRole.A && memberEntity.getRole() != MemberRole.B) {
                throw new IllegalStateException("Only ADMIN or BOARD manager can create FAQ posts.");
            }
        }

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

        MemberEntity memberEntity = memberRepository
                .findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND ........"));

        com.kh.app.board.entity.BoardCategory categoryEnum = (reqDto.getBoardCategory() != null)
                ? com.kh.app.board.entity.BoardCategory.valueOf(reqDto.getBoardCategory())
                : com.kh.app.board.entity.BoardCategory.FREE;

        if (boardEntity.getCategory() == com.kh.app.board.entity.BoardCategory.FAQ ||
            categoryEnum == com.kh.app.board.entity.BoardCategory.FAQ) {
            if (memberEntity.getRole() != MemberRole.A && memberEntity.getRole() != MemberRole.B) {
                throw new IllegalStateException("Only ADMIN or BOARD manager can manage FAQ posts.");
            }
        }

        if (!boardEntity.getWriter().getUsername().equals(username) && memberEntity.getRole() != MemberRole.A && memberEntity.getRole() != MemberRole.B) {
            throw new IllegalStateException("NO PERMISSION TO UPDATE BOARD ........");
        }

        boardEntity.setTitle(reqDto.getTitle());
        boardEntity.setCategory(categoryEnum);

        com.kh.app.board.entity.BoardSubCategory subCategoryEnum = (reqDto.getBoardSubCategory() != null)
                ? com.kh.app.board.entity.BoardSubCategory.valueOf(reqDto.getBoardSubCategory())
                : null;
        boardEntity.setSubCategory(subCategoryEnum);

        if ("PRODUCT_REVIEW".equals(categoryEnum.name()) || "FAC_REVIEW".equals(categoryEnum.name())) {
            boardEntity.setStars(reqDto.getBoardStars() != null ? reqDto.getBoardStars() : 5L);
        } else {
            boardEntity.setStars(5L);
        }

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
                        String s3FullUrl = "https://" + bucketName.trim() + ".s3.ap-northeast-2.amazonaws.com/" + s3KeyPath;

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
                    String s3FullUrl = "https://" + bucketName.trim() + ".s3.ap-northeast-2.amazonaws.com/" + s3KeyPath;

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
    public void delete(Long id, String username) {
        BoardEntity boardEntity = boardRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Board Not Found......"));

        MemberEntity memberEntity = memberRepository
                .findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND ........"));

        if (boardEntity.getCategory() == com.kh.app.board.entity.BoardCategory.FAQ) {
            if (memberEntity.getRole() != MemberRole.A) {
                throw new IllegalStateException("Only ADMIN can delete FAQ posts.");
            }
        } else {
            if (!boardEntity.getWriter().getUsername().equals(username) && memberEntity.getRole() != MemberRole.A) {
                throw new IllegalStateException("NO PERMISSION TO DELETE BOARD ........");
            }
        }

        boardEntity.delete();

        log.info("[게시글 소프트 딜리트 완료] boardId : {}, 상태: {}", id, boardEntity.getDelYn());
    }

    @Transactional
    public BoardLikeResDto toggleLike(Long boardId, String username) {
        BoardEntity board = boardRepository.findById(boardId)
                .orElseThrow(() -> new CustomException(BoardErrorCode.BOARD_NOT_FOUND));

        MemberEntity member = memberRepository.findByUsernameAndDelYn(username, DelYn.N)
                .orElseThrow(() -> new EntityNotFoundException("MEMBER NOT FOUND ........"));

        java.util.Optional<BoardLikeEntity> boardLikeOpt = boardLikeRepository.findByBoardAndMember(board, member);
        boolean isLiked;
        if (boardLikeOpt.isPresent()) {
            boardLikeRepository.delete(boardLikeOpt.get());
            isLiked = false;
        } else {
            BoardLikeEntity boardLike = BoardLikeEntity.builder()
                    .board(board)
                    .member(member)
                    .build();
            boardLikeRepository.save(boardLike);
            isLiked = true;
        }

        long likeCount = boardLikeRepository.countByBoard(board);
        return BoardLikeResDto.builder()
                .likeCount(likeCount)
                .isLiked(isLiked)
                .build();
    }

    public NaverNewsResDto getNaverNews(int page, String search) {
        boolean isDefault = search == null || search.isBlank() || "반려동물".equals(search) || "동물".equals(search);

        int display = 100;
        int start = 1;

        String queryStr = isDefault ? "반려동물" : search;

        URI uri = UriComponentsBuilder
                .fromUriString("https://openapi.naver.com")
                .path("/v1/search/news.json")
                .queryParam("query", queryStr)
                .queryParam("display", display)
                .queryParam("start", start)
                .queryParam("sort", "sim")
                .encode(StandardCharsets.UTF_8)
                .build()
                .toUri();

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Naver-Client-Id", naverClientId.trim());
        headers.set("X-Naver-Client-Secret", naverClientSecret.trim());
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(response.getBody());

            JsonNode itemsNode = rootNode.path("items");

            List<NaverNewsResDto.NewsItem> itemsList = new ArrayList<>();
            if (itemsNode.isArray()) {
                for (JsonNode item : itemsNode) {
                    itemsList.add(NaverNewsResDto.NewsItem.builder()
                            .title(item.path("title").asText(""))
                            .link(item.path("link").asText(""))
                            .description(item.path("description").asText(""))
                            .pubDate(item.path("pubDate").asText(""))
                            .build());
                }
            }

            String targetKeyword = isDefault ? "반려동물" : search;

            List<NaverNewsResDto.NewsItem> filteredList = itemsList.stream()
                    .filter(item -> {
                        String title = item.getTitle();
                        if (title == null || title.isBlank()) {
                            return false;
                        }
                        String plainTitle = title.replaceAll("<[^>]*>", "").replaceAll("&quot;", "\"");
                        return plainTitle.toLowerCase().contains(targetKeyword.toLowerCase());
                    })
                    .toList();

            int pageSize = 10;
            int fromIndex = page * pageSize;
            int toIndex = Math.min(fromIndex + pageSize, filteredList.size());

            List<NaverNewsResDto.NewsItem> pagedList = new ArrayList<>();
            if (fromIndex < filteredList.size()) {
                pagedList = filteredList.subList(fromIndex, toIndex);
            }

            int totalPages = (int) Math.ceil((double) filteredList.size() / pageSize);
            long totalElements = filteredList.size();

            return NaverNewsResDto.builder()
                    .content(pagedList)
                    .totalPages(totalPages)
                    .totalElements(totalElements)
                    .build();

        } catch (Exception e) {
            log.error("Naver News API Call Failed: ", e);
            return NaverNewsResDto.builder()
                    .content(new ArrayList<>())
                    .totalPages(0)
                    .totalElements(0L)
                    .build();
        }
    }
}