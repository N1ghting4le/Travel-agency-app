package com.example.kursach_server.dto;

import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
public class PageDTO<T> {
    private List<T> content;
    private long totalElements;
    private int totalPages;
    private boolean last;
    private int numberOfElements;
    private PageableDTO pageable;

    @Data
    public static class PageableDTO {
        private long offset;

        public PageableDTO(long offset) {
            this.offset = offset;
        }
    }

    public PageDTO(Page<T> page) {
        this.content = page.getContent();
        this.totalElements = page.getTotalElements();
        this.totalPages = page.getTotalPages();
        this.last = page.isLast();
        this.numberOfElements = page.getNumberOfElements();
        this.pageable = new PageableDTO(page.getPageable().getOffset());
    }
}
