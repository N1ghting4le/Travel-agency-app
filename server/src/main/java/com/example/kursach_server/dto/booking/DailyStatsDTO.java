package com.example.kursach_server.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DailyStatsDTO {
    private int day;
    private int month;
    private int year;
    private double totalAmount;
}
