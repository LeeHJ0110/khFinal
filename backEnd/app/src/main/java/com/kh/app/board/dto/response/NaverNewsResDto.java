package com.kh.app.board.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NaverNewsResDto {

    private List<NewsItem> content;
    private int totalPages;
    private long totalElements;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NewsItem {
        private String title;
        private String link;
        private String description;
        private String pubDate;
    }
}
