package com.example.kursach_server.requests;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.UUID;

@Getter
@Setter
public class BookingsRequest {
    @NotNull
    private Date startDate;

    @NotNull
    private Date endDate;

    @NotNull
    private String email;

    @NotNull
    private String phoneNumber;

    private UUID employeeId;
}
