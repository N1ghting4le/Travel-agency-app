package com.example.kursach_server.dto.booking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TourStatsDTO {
    private UUID tourId;
    private String tourTitle;
    private String destinationCountry;
    private String resortTitle;
    private long totalBookings;
    private double totalAmount;
}
