package com.example.kursach_server.dto;

import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
public class PageDto<T> {
    private List<T> content;
    private long totalElements;
    private int totalPages;
    private boolean last;
    private int numberOfElements;
    private PageableDto pageable;

    @Data
    public static class PageableDto {
        private long offset;

        public PageableDto(long offset) {
            this.offset = offset;
        }
    }

    public PageDto(Page<T> page) {
        this.content = page.getContent();
        this.totalElements = page.getTotalElements();
        this.totalPages = page.getTotalPages();
        this.last = page.isLast();
        this.numberOfElements = page.getNumberOfElements();
        this.pageable = new PageableDto(page.getPageable().getOffset());
    }
}
