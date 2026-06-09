package com.kh.app.board.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class UnifiedSearchResDto {

    private List<UnifiedBoardDto> boardList;
    private List<UnifiedProductDto> productList;

    @Getter
    @Builder
    public static class UnifiedBoardDto{
        private Long id;
        private String title;
        private String category;
        private String categoryName;
        private String content;
        private String writerNickname;
        private String createdAt;
        private String thumbnailUrl;
    }

    @Getter
    @Builder
    public static class UnifiedProductDto{
        private Long productId;
        private String productName;
        private Long productPrice;
        private Double reviewRatingAvg;
        private Long reviewCount;
        private String mainImageUrl;
    }

}
