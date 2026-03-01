package com.example.kursach_server.dto.tour;

import com.example.kursach_server.dto.hotel.HotelPreviewDTO;
import com.example.kursach_server.models.Review;
import com.example.kursach_server.models.Tour;
import lombok.Getter;

import java.util.OptionalDouble;
import java.util.UUID;

@Getter
public class TourPreviewDTO {
    private final UUID id;
    private final String tourTitle;
    private final double basePrice;
    private final String destinationCountry;
    private final HotelPreviewDTO hotel;
    private final double avgMark;
    private final int amount;

    public TourPreviewDTO(Tour tour) {
        OptionalDouble avg = tour.getReviews().stream().mapToInt(Review::getMark).average();

        id = tour.getId();
        tourTitle = tour.getTourTitle();
        basePrice = tour.getBasePrice();
        destinationCountry = tour.getDestinationCountry();
        hotel = new HotelPreviewDTO(tour.getHotel());
        avgMark = avg.isPresent() ? avg.getAsDouble() : 0;
        amount = tour.getReviews().size();
    }
}
