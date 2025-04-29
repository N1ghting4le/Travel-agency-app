package com.example.kursach_server.dto.tour;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CreateTourDTO {
    @NotNull
    private UUID hotelId;

    @NotNull
    @NotBlank
    private String tourTitle;

    private String tourDescr;

    private String tourNotes;

    @NotNull
    @NotBlank
    private String departureCity;

    @NotNull
    @NotBlank
    private String destinationCountry;

    @NotNull
    @Positive
    private double basePrice;
}
