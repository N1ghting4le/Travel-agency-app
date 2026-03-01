package com.example.kursach_server.dto.resort;

import com.example.kursach_server.models.Resort;
import lombok.Getter;

import java.util.UUID;

@Getter
public class ResortLookupDTO {
    private final UUID id;
    private final String resortTitle;

    public ResortLookupDTO(Resort resort) {
        id = resort.getId();
        resortTitle = resort.getResortTitle();
    }
}
