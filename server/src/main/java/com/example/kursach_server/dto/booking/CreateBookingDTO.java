package com.example.kursach_server.dto.booking;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
public class CreateBookingDTO {
    @NotNull
    private UUID tourId;

    @NotNull
    private Date startDate;

    @NotNull
    private Date endDate;

    @NotNull
    @Positive
    private double totalPrice;

    @NotNull
    @NotBlank
    private String roomType;

    @NotNull
    @NotBlank
    private String nutrType;

    @NotNull
    @Min(1)
    @Max(5)
    private int adultsAmount;

    @NotNull
    @Min(0)
    @Max(5)
    private int childrenAmount;
}
