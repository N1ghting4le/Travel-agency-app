package com.example.kursach_server.requests;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TourParamsRequest {
    @NotNull
    @NotBlank
    private String departureCity;

    @NotNull
    @NotBlank
    private String destinationCountry;

    @NotNull
    private List<String> rooms;

    @NotNull
    private List<String> nutrition;

    @NotNull
    @Min(1)
    @Max(5)
    private int stars;

    @NotNull
    private List<String> resorts;

    @NotNull
    private List<String> hotels;
}
