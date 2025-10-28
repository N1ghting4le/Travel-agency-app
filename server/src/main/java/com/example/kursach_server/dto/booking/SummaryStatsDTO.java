package com.example.kursach_server.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SummaryStatsDTO {
    private long totalBookings;
    private double totalAmount;
    private Integer year;
    private Integer month;
    private String country;
}
