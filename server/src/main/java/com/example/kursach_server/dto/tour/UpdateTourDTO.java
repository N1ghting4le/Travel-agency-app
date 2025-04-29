package com.example.kursach_server.dto.tour;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class UpdateTourDTO {
    @NotNull
    private UUID id;

    @NotNull
    @NotBlank
    private String tourTitle;

    private String tourDescr;

    private String tourNotes;

    @NotNull
    @Positive
    private double basePrice;
}
