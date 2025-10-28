package com.example.kursach_server.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DailyCountDTO {
    private int day;
    private int month;
    private int year;
    private long bookingsCount;
}
