package com.example.kursach_server.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class CreateReviewDTO {
    @NotNull
    private UUID tourId;

    @NotNull
    @Min(1)
    @Max(5)
    private int mark;

    @NotNull
    @NotBlank
    private String reviewText;
}
