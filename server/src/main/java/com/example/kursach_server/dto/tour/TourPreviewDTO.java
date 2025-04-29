package com.example.kursach_server.dto.tour;

import com.example.kursach_server.dto.hotel.HotelPreviewDTO;
import com.example.kursach_server.models.Review;
import com.example.kursach_server.models.Tour;
import lombok.Getter;

import java.util.OptionalDouble;
import java.util.UUID;

@Getter
public class TourPreviewDTO {
    private UUID id;
    private String tourTitle;
    private double basePrice;
    private String destinationCountry;
    private HotelPreviewDTO hotel;
    private double avgMark;
    private int amount;
    public TourPreviewDTO(Tour tour) {
        id = tour.getId();
        tourTitle = tour.getTourTitle();
        basePrice = tour.getBasePrice();
        destinationCountry = tour.getDestinationCountry();
        hotel = new HotelPreviewDTO(tour.getHotel());

        OptionalDouble avg = tour.getReviews().stream().mapToInt(Review::getMark).average();
        avgMark = avg.isPresent() ? avg.getAsDouble() : 0;
        amount = tour.getReviews().size();
    }
}
