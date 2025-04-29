package com.example.kursach_server.dto.resort;

import com.example.kursach_server.models.Resort;
import lombok.Getter;

import java.util.UUID;

@Getter
public class ResortIdAndTitleDTO {
    private UUID id;
    private String resortTitle;
    public ResortIdAndTitleDTO(Resort resort) {
        id = resort.getId();
        resortTitle = resort.getResortTitle();
    }
}
