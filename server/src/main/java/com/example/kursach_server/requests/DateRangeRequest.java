package com.example.kursach_server.requests;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class DateRangeRequest {
    @NotNull
    private Date startDate;

    @NotNull
    private Date endDate;
}
