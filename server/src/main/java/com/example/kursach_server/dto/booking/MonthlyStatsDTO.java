package com.example.kursach_server.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MonthlyStatsDTO {
    private int month; // 0-11
    private double totalAmount;
    private int year;
}
